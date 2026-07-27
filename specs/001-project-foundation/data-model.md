# Data Model: Project Foundation

## Overview

The foundation feature does not model business entities such as books, loans,
or user profiles. Its data model covers repository-level and shell-level
concepts that later features depend on.

## Entities

### 1. ApplicationShellVariant
- Purpose: Represents the non-functional shell composition used by placeholder
  routes.
- Values:
  - `user-facing`
  - `admin-facing`
- Required fields:
  - `id`: stable identifier (`user-facing` or `admin-facing`)
  - `headerHeight`: token-backed shell header height
  - `navigationMode`: `public`, `user`, or `admin` placeholder navigation set
  - `supportsSkipLink`: boolean, always `true`
  - `supportedBoundaryStates`: ordered list of boundary-state identifiers
- Relationships:
  - One `ApplicationShellVariant` is used by many `FoundationRoute` records.
  - One `ApplicationShellVariant` consumes one `DesignTokenBaseline`.
- Validation rules:
  - `id` is unique.
  - `headerHeight` must map to approved design-token layout values.
  - `navigationMode` cannot imply a business workflow.

### 2. FoundationRoute
- Purpose: Represents a non-functional route used to validate locale-prefixed
  navigation and shell coverage.
- Required fields:
  - `pathPattern`: locale-prefixed route path
  - `area`: `public`, `user`, or `admin`
  - `shellVariantId`: foreign key to `ApplicationShellVariant`
  - `localePolicy`: supported locales list and unsupported-locale outcome
  - `isPlaceholder`: boolean, always `true` for this feature
- Relationships:
  - Many `FoundationRoute` records belong to one `ApplicationShellVariant`.
  - Many `FoundationRoute` records use one `LocaleConfiguration`.
- Validation rules:
  - `pathPattern` must include the locale segment.
  - `area` is unique per placeholder route.
  - Unsupported locales resolve to the controlled `not-found` outcome.

### 3. LocaleConfiguration
- Purpose: Captures locale rules shared across routing, metadata, and catalogs.
- Required fields:
  - `defaultLocale`: `en`
  - `supportedLocales`: ordered set `en`, `id`
  - `directionMap`: both locales map to `ltr`
  - `persistenceMode`: `cookie`
  - `unsupportedLocaleBehavior`: `controlled-not-found-no-redirect`
- Relationships:
  - One `LocaleConfiguration` is referenced by many `FoundationRoute` records.
  - One `LocaleConfiguration` maps to many `TranslationCatalog` records.
- Validation rules:
  - Supported locales must stay in key parity.
  - The default locale must also be in the supported locale set.

### 4. TranslationCatalog
- Purpose: Represents one message catalog used by the foundation shell.
- Required fields:
  - `locale`: `en` or `id`
  - `namespaceSet`: list of namespaces required by the foundation
  - `checksumSource`: source-of-truth file path or generated app path
  - `parityState`: `passing` or `failing`
- Relationships:
  - Many `TranslationCatalog` records belong to one `LocaleConfiguration`.
- Validation rules:
  - Namespaces must match across `en` and `id`.
  - Missing keys fail the parity check.

### 5. BoundaryStateDefinition
- Purpose: Standardizes the shell-level loading, error, and not-found views.
- Required fields:
  - `state`: `loading`, `error`, or `not-found`
  - `accessibilityContract`: live-region/focus/document-structure requirements
  - `localizationNamespace`: catalog namespace for copy
  - `shellVariantCoverage`: list of shell variants where the state is reused
- Relationships:
  - Many `BoundaryStateDefinition` records are reused by one or more
    `ApplicationShellVariant` records.
- Validation rules:
  - Each state must have localized content in both supported locales.
  - `not-found` must support the controlled unsupported-locale flow.

### 6. DesignTokenBaseline
- Purpose: Defines the approved visual primitives available to the foundation.
- Required fields:
  - `fontFamilies`
  - `fontScales`
  - `colorScale`
  - `radiusScale`
  - `spacingScale`
  - `shadowTokens`
  - `layoutReferences`
- Relationships:
  - One `DesignTokenBaseline` feeds many shell and shared UI components.
- Validation rules:
  - Values trace to `design-tokens.json` or saved CSS token sources.
  - Semantic aliases must map back to a saved token, not an invented value.

### 7. SourceArtifactRecord
- Purpose: Tracks integrity requirements for the approved source pack.
- Required fields:
  - `relativePath`
  - `sha256`
  - `category`: `product`, `api`, `design`, `i18n`, `engineering`, `quality`
  - `verificationMode`: `manifest-checksum`
- Relationships:
  - Many `SourceArtifactRecord` records belong to one `SourceArtifactPack`.
- Validation rules:
  - Every required source file listed in the manifest must be present.
  - Hash mismatches fail the verification command and CI gate.

### 8. QueryClientProfile
- Purpose: Captures shared defaults for TanStack Query and test utilities.
- Required fields:
  - `retry`
  - `staleTimeMs`
  - `gcTimeMs`
  - `refetchOnWindowFocus`
  - `testIsolationMode`
- Relationships:
  - One `QueryClientProfile` is used by runtime providers and test utilities.
- Validation rules:
  - Test utilities must create isolated clients.
  - Runtime defaults must not imply auth/session behavior.

### 9. ToolingGateProfile
- Purpose: Represents the command and CI surface required for foundation
  quality.
- Required fields:
  - `commandName`
  - `purpose`
  - `phase`: `local`, `ci`, or `both`
  - `blocking`: boolean
- Relationships:
  - Many `ToolingGateProfile` records define one `QualityGateSet`.
- Validation rules:
  - The command set must include source verification, lint, typecheck, i18n
    parity, tests, build, and Playwright smoke coverage.

## State Transitions

### FoundationRoute lifecycle
1. `declared` -> route exists in plan/contracts.
2. `implemented` -> placeholder route renders the correct shell variant.
3. `validated` -> route passes locale, accessibility, and responsive checks.
4. `extended-by-feature` -> later feature replaces placeholder content while
   preserving shell contracts.

### TranslationCatalog parity lifecycle
1. `draft` -> catalog created.
2. `paired` -> both `en` and `id` files exist.
3. `checked` -> parity script passes.
4. `regressed` -> a missing or extra key fails parity.

### SourceArtifactRecord lifecycle
1. `listed` -> included in manifest.
2. `verified` -> checksum passes.
3. `failed` -> missing or hash mismatch detected.

## Scale Assumptions
- Only a handful of foundation routes exist in this feature.
- Catalog size is small and focused on shell/boundary copy.
- Query cache remains minimal until business features add real server-state
  surfaces.
- CI jobs run against deterministic fixtures only; no production traffic is
  involved.
