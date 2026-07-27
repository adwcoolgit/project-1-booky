# Booky

Booky adalah fondasi frontend Next.js App Router untuk aplikasi perpustakaan dua bahasa (`en` dan `id`). Repository ini mengikuti pendekatan specification-first dan menggunakan `docs/source-of-truth/` sebagai referensi utama sebelum implementasi.

## Source of truth

Urutan referensi yang berlaku:

1. `docs/source-of-truth/product/PRD_Library_App_Figma_Aligned_v1.3.md`
2. `docs/source-of-truth/api/Library_App_OpenAPI_3.0.3_v1.0.0.json`
3. `docs/source-of-truth/api/API_CONTRACT_INTEGRATION_SPEC_Library_App_v1.3.md`
4. `docs/source-of-truth/design/Library_App_Figma_Read_Ledger.md`
5. `docs/source-of-truth/design/design-tokens.json`
6. `docs/source-of-truth/i18n/I18N_IMPLEMENTATION_SPEC_Library_App_v1.3.md`
7. `docs/source-of-truth/engineering/ENGINEERING_INSTRUCTIONS_Library_App_v1.3.md`

`docs/source-of-truth/source-of-truth-manifest.json` adalah otoritas checksum untuk source pack. Jalankan `npm run verify:source` sebelum menilai build, test, atau perubahan spesifikasi.

## Runtime stance

Fondasi ini tidak mengklaim verifikasi runtime backend produksi. Semua perilaku API live tetap `RUNTIME-UNVERIFIED` kecuali ada aktivitas integrasi terkontrol yang mendokumentasikan bukti terpisah. MSW dan fixture di repository hanya menyediakan surface foundation yang deterministik untuk shell, boundary, dan governance.

## Saved token baseline

Fondasi visual Booky mengacu langsung pada artefak token tersimpan berikut:

- `docs/source-of-truth/design/design-tokens.json`
- `docs/source-of-truth/design/tokens.css`
- `src/shared/styles/tokens.css`

Referensi inti yang dipakai tetap Quicksand untuk display/body, `#1C65DA` sebagai primary action, radius hingga `24px`, shadow kartu `0 0 10px rgba(203, 202, 202, 0.25)`, serta layout `393px` mobile dan `1440px` desktop.

## Quality commands

Perintah lokal utama:

```bash
npm run verify:source
npm run lint
npm run typecheck
npm run i18n:check
npm run test
npm run test:e2e
npm run build
npm run build:proof
```

`npm run quality:foundation` menjalankan gate lokal berurutan tanpa E2E penuh. `npm run quality:ci` menambahkan Playwright shell smoke di atas urutan yang sama.

## Validation record

Validation terbaru dijalankan pada **Monday, July 27, 2026**.

- `npm run verify:source`: PASS, `18/18` artefak source-of-truth tervalidasi checksum SHA-256.
- `npm run lint`: PASS.
- `npm run typecheck`: PASS.
- `npm run i18n:check`: PASS, parity `en` dan `id` bersih.
- `npm run test`: PASS, `11` test files dan `23` tests.
- `npm run build`: PASS, route foundation `public`, `user`, dan `admin` terbangun dengan `src/proxy.ts` aktif.
- `npm run test:e2e`: PASS, `29` Playwright tests termasuk accessibility, E2E, dan visual overflow checks pada `393px` dan `1440px`.
- `npm run build:proof`: PASS, `1` proof test untuk placeholder shell routes pada production build.

## Responsive evidence

Evidence responsif yang tervalidasi berasal dari:

- `tests/visual/foundation-shell.spec.ts` untuk overflow dan readability di `393px` dan `1440px`.
- `tests/e2e/foundation-shell.spec.ts` untuk locale switching, unsupported-locale recovery, dan production-build proof.
- `tests/accessibility/foundation-shell.spec.ts` dan `tests/accessibility/foundation-boundaries.spec.ts` untuk skip link, locale switcher, dan boundary accessibility.
