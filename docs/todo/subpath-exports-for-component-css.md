# TODO: Add subpath exports for component-level JS/CSS splitting

## Context

현재 root import는 다음 형태를 지원한다.

```ts
import { OverlayProvider } from "@ryu9663/overlay";
```

이 방식은 사용성이 좋지만 패키지 root entry인 `dist/index.es.js`를 통한다. root entry가 여러 컴포넌트를 export하면, 번들러 tree-shaking 여부와 CSS side-effect 처리 방식에 따라 사용하지 않는 컴포넌트의 CSS까지 함께 로드될 수 있다.

## Goal

컴포넌트별 subpath import를 제공해서 사용하는 컴포넌트의 JS/CSS만 더 확실하게 로드되도록 한다.

권장 API:

```ts
import { Overlay } from "@ryu9663/overlay/overlay";
import { OverlayProvider } from "@ryu9663/overlay/overlay-provider";
```

root import도 편의 API로 유지할 수 있다.

```ts
import { Overlay, OverlayProvider } from "@ryu9663/overlay";
```

## Expected package shape

```txt
dist/
  index.es.js
  index.umd.js
  overlay.es.js
  overlay-provider.es.js
  overlay.css
  overlay-provider.css
  src/
    index.d.ts
    components/Overlay.d.ts
    provider/OverlayProvider.d.ts
```

## Expected exports

```json
{
  "exports": {
    ".": {
      "types": "./dist/src/index.d.ts",
      "import": "./dist/index.es.js",
      "require": "./dist/index.umd.js"
    },
    "./overlay": {
      "types": "./dist/src/components/Overlay.d.ts",
      "import": "./dist/overlay.es.js"
    },
    "./overlay-provider": {
      "types": "./dist/src/provider/OverlayProvider.d.ts",
      "import": "./dist/overlay-provider.es.js"
    },
    "./overlay.css": "./dist/overlay.css",
    "./overlay-provider.css": "./dist/overlay-provider.css",
    "./package.json": "./package.json"
  }
}
```

## Implementation notes

- Vite library build needs multiple entries.
- Each component entry should import only its own component CSS.
- The CSS injection logic in `vite.config.ts` currently injects one CSS file into `dist/index.es.js`; it must be updated to map each entry to its matching CSS file.
- Keep root import as a convenience barrel, but document that subpath imports are preferred for maximum CSS splitting.
- Prefer kebab-case subpaths such as `overlay-provider` over `overlayprovider`.

## Verification

Minimum checks:

```bash
pnpm run build
pnpm test -- --run
pnpm --filter playground build
```

Additional checks:

- `dist/overlay.es.js` imports only `overlay.css`.
- `dist/overlay-provider.es.js` imports only `overlay-provider.css`.
- `import { OverlayProvider } from "@ryu9663/overlay/overlay-provider"` works in playground.
- Root import still works:

```ts
import { OverlayProvider } from "@ryu9663/overlay";
```
