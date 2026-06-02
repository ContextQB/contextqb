/**
 * Integrity validation for telemetry ingestion endpoints (ADR-0028, Tranche D).
 *
 * Validates that requests to /membership/register and /telemetry/cli come from
 * a legitimate CLI installation, not a script forging community data. Three-layer
 * defense: User-Agent check, Origin blocklist, HMAC signature verification.
 *
 * INV-INT-1: This module is the sole verifier for telemetry integrity.
 */

interface IntegritySecret {
  v: string;
  s: string;
  revoked_at: number | null;
}

interface Env {
  INTEGRITY_SECRETS?: string;
}

type IntegrityResult = { valid: true } | { valid: false; reason: string };

let secretsCache: Map<string, IntegritySecret> | null = null;
let secretsParseError = false;

const TIMESTAMP_TOLERANCE_SECONDS = 300;
const USER_AGENT_PATTERN = /^contextqb-cli\//;
const SIGNATURE_PATTERN = /^t=(\d+),(\w+)=([0-9a-f]+)$/i;

/**
 * Parse the INTEGRITY_SECRETS env var (JSON array) into a Map keyed by version.
 * Cached in module scope; parse errors logged once and cached as failure.
 */
function getSecretsMap(env: Env): Map<string, IntegritySecret> | null {
  if (secretsCache !== null) return secretsCache;
  if (secretsParseError) return null;

  const raw = env.INTEGRITY_SECRETS;
  if (!raw) {
    console.error("[integrity] INTEGRITY_SECRETS env var is not set");
    secretsParseError = true;
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as IntegritySecret[];
    if (!Array.isArray(parsed)) {
      throw new Error("INTEGRITY_SECRETS must be a JSON array");
    }
    secretsCache = new Map(parsed.map((s) => [s.v, s]));
    return secretsCache;
  } catch (err) {
    console.error("[integrity] Failed to parse INTEGRITY_SECRETS:", err);
    secretsParseError = true;
    return null;
  }
}

/**
 * Timing-safe comparison of two hex strings.
 * Converts to Uint8Array, XOR-accumulates differences, returns true if all zero.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  const aBytes = hexToBytes(a);
  const bBytes = hexToBytes(b);

  let diff = 0;
  for (let i = 0; i < aBytes.length; i++) {
    diff |= (aBytes[i] ?? 0) ^ (bBytes[i] ?? 0);
  }
  return diff === 0;
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Compute HMAC-SHA256 using Workers-native crypto.subtle.
 */
async function computeHmac(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = hexToBytes(secret);
  const messageData = encoder.encode(message);

  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", key, messageData);
  return bytesToHex(new Uint8Array(signature));
}

/**
 * Validate integrity of a request to a telemetry ingestion endpoint.
 *
 * Checks (in order, fail-fast):
 * 1. User-Agent matches /^contextqb-cli\//
 * 2. No Origin header present
 * 3. X-ContextQB-Signature header parses as t=<unix>,<version>=<hex>
 * 4. Timestamp is within 300 seconds of server time
 * 5. Version exists in secrets and is not revoked
 * 6. HMAC signature matches
 */
export async function validateIntegrity(
  request: Request,
  rawBody: string,
  env: Env,
): Promise<IntegrityResult> {
  // 1. User-Agent check
  const userAgent = request.headers.get("User-Agent");
  if (!userAgent || !USER_AGENT_PATTERN.test(userAgent)) {
    return { valid: false, reason: "missing_user_agent" };
  }

  // 2. Origin blocklist (browsers always send Origin; CLI does not)
  const origin = request.headers.get("Origin");
  if (origin) {
    return { valid: false, reason: "origin_header_present" };
  }

  // 3. Parse signature header
  const signatureHeader = request.headers.get("X-ContextQB-Signature");
  if (!signatureHeader) {
    return { valid: false, reason: "missing_signature" };
  }

  const match = SIGNATURE_PATTERN.exec(signatureHeader);
  if (!match || !match[1] || !match[2] || !match[3]) {
    return { valid: false, reason: "malformed_signature" };
  }

  const timestampStr = match[1];
  const version = match[2];
  const providedSignature = match[3];
  const timestamp = parseInt(timestampStr, 10);

  // 4. Timestamp freshness check (5-minute tolerance for clock skew)
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestamp) > TIMESTAMP_TOLERANCE_SECONDS) {
    return { valid: false, reason: "stale_timestamp" };
  }

  // 5. Secret lookup
  const secrets = getSecretsMap(env);
  if (!secrets) {
    return { valid: false, reason: "secrets_unavailable" };
  }

  const secret = secrets.get(version);
  if (!secret) {
    return { valid: false, reason: "unknown_version" };
  }

  if (secret.revoked_at !== null && secret.revoked_at <= now) {
    return { valid: false, reason: "revoked_secret" };
  }

  // 6. HMAC verification
  // Signed string format: "${timestamp}.${rawBody}" (Stripe-style)
  const signedString = `${timestamp}.${rawBody}`;
  const expectedSignature = await computeHmac(secret.s, signedString);

  if (!timingSafeEqual(providedSignature.toLowerCase(), expectedSignature)) {
    return { valid: false, reason: "signature_mismatch" };
  }

  return { valid: true };
}

/**
 * Reset the secrets cache. Primarily for testing.
 */
export function resetSecretsCache(): void {
  secretsCache = null;
  secretsParseError = false;
}
