# Security Policy

## Supported Versions

PodLink is currently in early development. We aim to keep `main` secure and up to date. Please use the latest commit on `main` for the most secure experience.

## Reporting a Vulnerability

- Email security issues to [brittytino22@gmail.com](mailto:brittytino22@gmail.com).
- Please include:
  - Description of the vulnerability
  - Steps to reproduce or proof-of-concept
  - Affected area (URLs, APIs, or components)
  - Potential impact
  - Suggested remediation (if any)
- We will acknowledge receipt within 72 hours and provide a resolution or mitigation plan within 10 business days whenever possible.

## Disclosure Policy

- Please do **not** disclose vulnerabilities publicly until we have confirmed and addressed them.
- We may request additional time for complex fixes; we will keep you updated on progress.
- Credit will be given to reporters who responsibly disclose (unless anonymity is requested).

## Security Best Practices (for contributors)

- Do not commit secrets or production credentials. Use environment variables.
- Run `npm run lint` and `npm run build` before submitting PRs to catch obvious issues.
- Avoid introducing dependencies without reviewing their security posture and license.
- Prefer parameterized queries through Prisma; avoid raw SQL unless necessary.
- Validate and sanitize user input on both client and server.
- Limit external network calls to trusted services defined in configuration.
