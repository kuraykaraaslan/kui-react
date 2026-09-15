# Security Policy

## Supported versions

Only the latest published release (or, for kui-ejs, the latest commit on `main`) receives security fixes. There is no long-term support branch.

| Version | Supported |
|---|---|
| latest | yes |
| anything older | no |

## Reporting a vulnerability

Do not open a public issue for a security report. Email **kuraykaraaslan@gmail.com** with a description of the issue, steps to reproduce, and the affected version or commit.

You should expect an acknowledgement within 5 business days. This is a solo-maintained project, so fix timelines are best-effort rather than contractual — a confirmed high or critical issue is prioritised over feature work.

## Scope

This repository ships example UI and, for kui-ejs, an example Express server used to preview components. Neither is a hardened application by itself:

- Sample data in `modules/showcase` (react) / `src/data` (ejs) is fixture data, not a data-handling reference implementation.
- Consumers are responsible for their own authentication, authorization, and input validation when they adopt these components into a real product.

Reports about the showcase/demo server itself (for example, a header misconfiguration, a missing CSRF token on a demo form, or a dependency with a known CVE) are in scope and welcome.
