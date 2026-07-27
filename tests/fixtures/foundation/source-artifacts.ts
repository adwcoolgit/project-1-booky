export const foundationSourceArtifactsFixture = Object.freeze({
  manifestAuthority: "docs/source-of-truth/source-of-truth-manifest.json",
  hashAlgorithm: "SHA-256",
  verificationMode: "manifest-checksum" as const,
  packVersion: "1.0",
  runtimeApiStatus: "RUNTIME-UNVERIFIED" as const,
  criticalArtifacts: [
    {
      category: "product",
      path: "product/PRD_Library_App_Figma_Aligned_v1.3.md",
    },
    {
      category: "api",
      path: "api/Library_App_OpenAPI_3.0.3_v1.0.0.json",
    },
    {
      category: "api",
      path: "api/API_CONTRACT_INTEGRATION_SPEC_Library_App_v1.3.md",
    },
    {
      category: "design",
      path: "design/Library_App_Figma_Read_Ledger.md",
    },
    {
      category: "design",
      path: "design/design-tokens.json",
    },
    {
      category: "i18n",
      path: "i18n/I18N_IMPLEMENTATION_SPEC_Library_App_v1.3.md",
    },
  ],
});
