# Booky Source-of-Truth

These files are the approved inputs for Spec Kit and Codex CLI.

Do not edit source artifacts casually. Changes require an impact review and a
new version or explicit decision record.

## Structure

```text
product/       PRD baseline
engineering/   implementation constraints and resolved reviews
api/           OpenAPI, API integration spec, endpoint manifest, raw reference
design/        saved Figma ledger, tokens, asset manifest
i18n/          localization specification and starter catalogs
quality/       document audit evidence
```

Run the verification script after copying:

```bash
node ./scripts/verify-source-of-truth.mjs --root ./docs/source-of-truth
```

The checksums prove file integrity inside this pack. They do not prove runtime
API behavior or production readiness.
