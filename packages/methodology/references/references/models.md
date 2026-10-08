---
id: models
title: Models and capabilities
summary: Neutral, dated facts about the model families that lessons mention by role — which models each provider currently lists, the limits it publishes, and how open-weight models are licensed. No quality comparison and no recommendation.
version: 0.1.0
audience:
  - novice-builder
  - founder
  - operator
  - developer
  - agent
maintainer: ContextQB editorial (Travis Simpson accountable)
tags:
  - llm
entries:
  - id: families
    title: Model families and current lineups
    role: Which models each provider currently lists, with the context and output limits the provider publishes for them.
    status: current
    owner: ContextQB editorial
    review_by: "2026-11-07"
    review_trigger: A provider announces a new model generation, changes a published limit or retires a listed model.
    limits: Records what each provider's own documentation says on the check date. It does not compare quality, speed, cost-effectiveness or suitability, does not cover every provider or every specialist model, and is not a recommendation. Context and output figures are the providers' published maximums for their own APIs; a tool that wraps a model can allow less.
    facts:
      - subject: Anthropic Claude — current models
        value: Claude Fable 5.1, Claude Opus 5.5, Claude Sonnet 5.5 and Claude Haiku 5.5 are listed as the current lineup. Claude Fable 5, Opus 5, Opus 4.8, Opus 4.7, Opus 4.6, Opus 4.5, Sonnet 5, Sonnet 4.6 and Haiku 4.5 are listed as legacy models that are still available.
        applies_to: Claude API (Anthropic's models overview)
        evidence: [anthropic-models]
      - subject: Anthropic Claude — context window and output limit
        value: 1M-token context window and 128K-token maximum output for each of the four current models.
        applies_to: Claude Fable 5.1, Opus 5.5, Sonnet 5.5 and Haiku 5.5 on the Claude API; the output limit is for the synchronous Messages API
        evidence: [anthropic-models]
        note: Anthropic states that 1M tokens is roughly 555k words on the current tokenizer.
      - subject: Cohere — text-generation models
        value: The Command family (Command A+, Command A, Command R7B, Command A Translate, Command A Reasoning, Command A Vision, Command R+, Command R and Command) is listed as Cohere's text-generation models, used through the Chat endpoint.
        applies_to: Cohere API v2 documentation
        evidence: [cohere-models]
      - subject: Google Gemini — current models
        value: Gemini 3.8 Flash (model code gemini-3.8-flash) is listed as stable. Gemini 3.1 Pro (gemini-3.1-pro-preview) is listed as a preview. Gemini 3.7 Flash and 3.6 Flash are described as previous-generation and Gemini 3.5 Flash as legacy.
        applies_to: Gemini API (Google AI for Developers models page)
        evidence: [gemini-models]
      - subject: Google Gemini — context window and output limit
        value: Input token limit 1,048,576 and output token limit 65,536.
        applies_to: Gemini 3.8 Flash and Gemini 3.1 Pro Preview on the Gemini API
        evidence: [gemini-38-flash, gemini-31-pro]
      - subject: Mistral — listed models
        value: The models page lists Mistral Medium 3.5, Mistral Small 4, Mistral Large 4, Mistral Large 3 and Ministral 3 (14B, 8B and 3B), plus specialist code, audio, OCR, embedding and moderation models.
        applies_to: Mistral AI models overview
        evidence: [mistral-models]
      - subject: OpenAI GPT — current models
        value: GPT-6 Astra (gpt-6-astra), GPT-6.1 Sol (gpt-6.1-sol) and GPT-6 Luna (gpt-6-luna) are listed as the flagship models.
        applies_to: OpenAI API (models page)
        evidence: [openai-models]
      - subject: OpenAI GPT — context window and output limit
        value: 1.05M-token context window and 128K-token maximum output for each of the three flagship models.
        applies_to: gpt-6-astra, gpt-6.1-sol and gpt-6-luna on the OpenAI API
        evidence: [openai-models]
      - subject: xAI Grok — current model
        value: grok-4.7 is listed as the flagship model, with a 500k-token context.
        applies_to: xAI API (models page)
        evidence: [xai-models]
    evidence:
      - id: anthropic-models
        url: "https://platform.claude.com/docs/en/about-claude/models/overview"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Models overview > Compare models table (Context window, Max output rows) and the 'Legacy models (still available)' line"
      - id: cohere-models
        url: "https://docs.cohere.com/docs/models"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "An Overview of Cohere's Models > What can these models be used for? (Command family sentence)"
      - id: gemini-models
        url: "https://ai.google.dev/gemini-api/docs/models?hl=en"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Models > Gemini 3 model cards (Stable / Preview labels) and 'All Gemini 3 models' endpoint table"
      - id: gemini-38-flash
        url: "https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash?hl=en"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Gemini 3.8 Flash > Token limits (page last updated 2026-09-02 UTC)"
      - id: gemini-31-pro
        url: "https://ai.google.dev/gemini-api/docs/models/gemini-3.1-pro-preview?hl=en"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Gemini 3.1 Pro Preview > Token limits (page last updated 2026-08-18 UTC)"
      - id: mistral-models
        url: "https://docs.mistral.ai/models"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Models overview tables (model name, licence label and version columns)"
      - id: openai-models
        url: "https://developers.openai.com/api/docs/models"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Models > Flagship models cards (Max output, Context window)"
      - id: xai-models
        url: "https://docs.x.ai/developers/models"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Models > grok-4.7 card (Context)"
  - id: open-weight
    title: Open-weight model families
    role: Which publishers release downloadable model weights that lessons mention, and the licence each publisher attaches.
    status: current
    owner: ContextQB editorial
    review_by: "2027-01-07"
    review_trigger: A publisher releases a new open-weight generation or changes a licence.
    limits: One representative recent model per publisher, read from the publisher's own model card or model list. Other models from the same publisher can carry different licences; read the licence of the exact model you download. Does not cover hardware requirements, quality or hosted API availability, and is not legal advice.
    facts:
      - subject: DeepSeek
        value: DeepSeek-V4-Flash weights are published on Hugging Face under the MIT licence, without gated access.
        applies_to: deepseek-ai/DeepSeek-V4-Flash model card (last modified 2026-06-22)
        evidence: [deepseek-v4]
      - subject: Meta Llama
        value: Llama 4 Scout 17B-16E Instruct is published under the Llama 4 Community Licence (model-card licence name llama4), with gated access that requires an approved request. The most recent Llama language models in Meta's Hugging Face organization are the Llama 4 Scout and Maverick models, created in April 2025.
        applies_to: meta-llama organization on Hugging Face
        evidence: [llama-4-scout, meta-llama-list]
      - subject: Mistral
        value: Mistral Small 4, Mistral Large 3 and Ministral 3 (14B, 8B, 3B) are labelled Apache 2.0; Mistral Large 4 is labelled Open; Mistral Medium 3.5 is labelled Modified MIT; other models are labelled Premier.
        applies_to: Mistral AI models overview
        evidence: [mistral-models]
      - subject: Qwen
        value: Qwen3.8-27B weights are published on Hugging Face under the Apache 2.0 licence, without gated access.
        applies_to: Qwen/Qwen3.8-27B model card (last modified 2026-08-14)
        evidence: [qwen-38-27b]
    evidence:
      - id: deepseek-v4
        url: "https://huggingface.co/api/models/deepseek-ai/DeepSeek-V4-Flash"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Model card metadata: license (mit), gated (false)"
      - id: llama-4-scout
        url: "https://huggingface.co/api/models/meta-llama/Llama-4-Scout-17B-16E-Instruct"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Model card metadata: license (other), license_name (llama4), gated (manual)"
      - id: meta-llama-list
        url: "https://huggingface.co/api/models?author=meta-llama&sort=createdAt&direction=-1&limit=8"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Eight most recently created models in the meta-llama organization (createdAt field)"
      - id: mistral-models
        url: "https://docs.mistral.ai/models"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Models overview tables (licence label column)"
      - id: qwen-38-27b
        url: "https://huggingface.co/api/models/Qwen/Qwen3.8-27B"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Model card metadata: license (apache-2.0), gated (false)"
---

These tables hold facts that change. Each row names the model or publisher, states what the provider's own documentation said on the check date, and links that documentation as evidence. Rows are sorted by subject; their order is not a ranking.

The lessons explain how to think about models — roles, context, cost and verification. Use this table to look up the current specifics, and check the provider's page before you rely on a number.
