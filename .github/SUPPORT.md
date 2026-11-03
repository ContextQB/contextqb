# Getting help and sharing feedback

## Share feedback

Tell us what you were trying to do, what happened and what you expected. Include the page or command and enough detail to reproduce the problem.

**GitHub issues are public. Leave out passwords, tokens and private project details.**

- [Open the feedback form](https://github.com/ContextQB/contextqb/issues/new?template=external-adopter-feedback.yml).
- If your AI app is [connected to ContextQB](https://contextqb.com/install/), ask your agent to use `submit_feedback`. No account or token is needed to connect. The tool prepares feedback and gives you ways to submit it; it does not send anything.
- If you use the GitHub CLI, put your feedback in a Markdown file and run:

```bash
gh issue create --repo ContextQB/contextqb \
  --title "[feedback] <one-line summary>" \
  --body-file ./your-feedback.md
```

A maintainer reads each submission, keeps a copy for follow-up and uses it to improve ContextQB. Your consent choice controls reuse elsewhere: `public` allows direct quotes, `synthesised-only` allows describing patterns without quoting you, and `private` prohibits quoting or paraphrasing elsewhere. The issue itself remains public in all three cases.

## Report a security issue

Please do not open a public issue. Email [info@contextqb.com](mailto:info@contextqb.com) with “Security” in the subject.

## Learn to use ContextQB

- [Start here](https://contextqb.com/start-here/) to choose a starting point.
- [Follow the guides](https://contextqb.com/guides/) from an idea through building, launch and operations.
- [Connect your AI app](https://contextqb.com/install/) to use the library while you work.

## Contribute

See [CONTRIBUTING.md](./CONTRIBUTING.md) for ways to contribute.
