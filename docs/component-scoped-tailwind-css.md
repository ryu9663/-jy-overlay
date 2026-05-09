# Component-scoped Tailwind CSS loading

이 문서는 `@ryu9663/overlay`가 소비 앱에서 전체 Tailwind CSS를 로드하지 않고, import한 컴포넌트에 필요한 CSS만 로드하도록 구성한 원리를 설명한다.

## 목표

소비 앱은 별도 전역 CSS import 없이 컴포넌트만 import한다.

```tsx
import { Overlay } from "@ryu9663/overlay";
```

이때 기대하는 동작은 다음과 같다.

- 소비 앱이 `@ryu9663/overlay/index.css` 같은 전체 CSS를 직접 import하지 않는다.
- 라이브러리 번들이 `Overlay`에 필요한 CSS를 자동으로 가져온다.
- Tailwind 전체 CSS가 아니라 `Overlay.tsx`에서 사용한 utility CSS만 생성된다.

## 현재 파일 구조

```txt
src/
  index.ts
  components/
    Overlay.tsx
    Overlay.css
vite.config.ts
package.json
playground/
  vite.config.ts
```

## 런타임 import 흐름

소비 앱에서 `Overlay`를 import하면 다음 흐름으로 CSS가 따라온다.

```txt
소비 앱
  └─ import { Overlay } from "@ryu9663/overlay"
       └─ dist/index.es.js
            └─ import "./overlay.css"
                 └─ Overlay 전용 Tailwind utility CSS
```

`src/components/Overlay.tsx`는 컴포넌트 전용 CSS를 side-effect import한다.

```tsx
import "./Overlay.css";
```

그리고 라이브러리 build 후 `dist/index.es.js` 맨 위에는 다음 import가 주입된다.

```js
import "./overlay.css";
```

그래서 소비 앱은 컴포넌트만 import해도 스타일을 같이 받는다.

## Overlay.css의 역할

현재 `Overlay.css`는 다음과 같다.

```css
@source "./Overlay.tsx";
@source not "../../playground";

@layer utilities;
@import "tailwindcss/utilities.css" layer(utilities);
```

### `@source "./Overlay.tsx"`

Tailwind에게 `Overlay.tsx`에서 className을 스캔하라고 명시한다.

이 줄이 없으면 playground dev alias 환경에서 `Overlay.css`가 처리될 때 `Overlay.tsx`의 className을 찾지 못해 다음처럼 빈 CSS에 가까운 결과가 나올 수 있다.

```css
@layer utilities;
@layer utilities;
```

그 경우 DOM에는 className이 있어도 실제 CSS rule이 없어서 overlay가 적용되지 않는다.

예를 들어 다음 className이 있어도:

```tsx
className="fixed inset-[0] z-[1000] flex ..."
```

생성 CSS에 `.fixed`, `.inset-\[0\]`, `.z-\[1000\]` rule이 없으면 브라우저 계산 스타일은 `position: static`, `display: block`, `z-index: auto`가 된다.

### `@source not "../../playground"`

Tailwind가 playground 코드까지 스캔하지 않도록 제외한다.

이 설정이 없으면 playground에서 쓰는 className까지 라이브러리 CSS에 섞일 수 있다. 라이브러리 CSS는 라이브러리 컴포넌트가 사용하는 class만 포함해야 한다.

### `@import "tailwindcss/utilities.css"`

Tailwind 전체가 아니라 utilities 레이어만 가져온다.

전체 Tailwind import는 대략 theme/base/preflight/utilities를 포함할 수 있다.

```css
@import "tailwindcss";
```

Overlay에는 reset/preflight/theme 전체가 필요 없으므로 utilities만 사용한다.

```css
@import "tailwindcss/utilities.css" layer(utilities);
```

## 생성되는 CSS 예시

빌드 후 `dist/overlay.css`에는 Overlay에서 쓰는 utility만 포함된다.

예시:

```css
.fixed { position: fixed; }
.inset-\[0\] { inset: 0; }
.z-\[1000\] { z-index: 1000; }
.flex { display: flex; }
.h-full { height: 100%; }
.w-full { width: 100%; }
.w-\[90\%\] { width: 90%; }
.max-w-\[500px\] { max-width: 500px; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.rounded-\[8px\] { border-radius: 8px; }
.bg-\[\#fff\] { background-color: #fff; }
.bg-\[rgba\(0\,0\,0\,0\.5\)\] { background-color: rgba(0,0,0,0.5); }
.p-\[20px\] { padding: 20px; }
```

즉 Tailwind 전체 CSS가 아니라 Overlay에 필요한 CSS만 생성된다.

## 왜 `inset-[0]`을 사용하는가

현재는 CSS 크기를 줄이기 위해 `tailwindcss/utilities.css`만 가져온다. 이때 theme token에 의존하는 scale utility보다 arbitrary value utility가 더 안전하다.

따라서 다음보다:

```tsx
className="inset-0"
```

현재 구조에서는 다음을 사용한다.

```tsx
className="inset-[0]"
```

이렇게 하면 생성 CSS에 확실히 다음 rule이 포함된다.

```css
.inset-\[0\] { inset: 0; }
```

## Vite build 설정

`vite.config.ts`는 빌드 결과 ESM entry에 CSS import를 주입한다.

```ts
const injectLibraryCss = (): Plugin => ({
  name: "inject-library-css-import",
  closeBundle() {
    // dist/index.es.js 맨 위에 import "./overlay.css"; 삽입
  },
});
```

이유는 라이브러리 build에서 CSS가 별도 파일로 나뉘기 때문이다.

```txt
dist/
  index.es.js
  index.umd.js
  overlay.css
```

소비 앱 bundler가 `dist/index.es.js`를 읽을 때 `overlay.css`도 의존성으로 인식하게 만들기 위해 ESM entry에 CSS import를 남긴다.

## package.json 설정

### `sideEffects`

```json
"sideEffects": [
  "**/*.css"
]
```

CSS import는 JS 값으로 사용되지 않지만, 스타일 적용이라는 side effect가 있다. 이 설정은 번들러가 CSS import를 tree-shaking으로 제거하지 않게 한다.

### `exports`

```json
"exports": {
  ".": {
    "types": "./dist/src/index.d.ts",
    "import": "./dist/index.es.js",
    "require": "./dist/index.umd.js"
  },
  "./overlay.css": "./dist/overlay.css",
  "./package.json": "./package.json"
}
```

패키지의 public entry는 dist를 기준으로 한다. 소비 앱은 기본적으로 `dist/index.es.js`를 사용하고, 그 entry가 `overlay.css`를 자동 import한다.

## React external 설정

```ts
external: [/^react(?:\/.*)?$/, /^react-dom(?:\/.*)?$/]
```

React와 React DOM 계열 모듈은 라이브러리 번들에 포함하지 않고 소비 앱의 React를 사용한다.

정규식으로 처리하는 이유는 JSX transform이 `react/jsx-runtime`을 import하기 때문이다.

```txt
react
react/jsx-runtime
react/jsx-dev-runtime
react-dom
react-dom/client
```

이 모듈들이 라이브러리 번들에 말려 들어가면 React 중복, hooks 문제, 브라우저 `require("react")` 에러가 발생할 수 있다.

## Playground 개발/배포 검증 분리

`playground/vite.config.ts`는 dev와 build를 다르게 동작시킨다.

```ts
export default defineConfig(({ command }) => ({
  plugins: command === "serve" ? [react(), tailwindcss()] : [react()],
  resolve: {
    alias:
      command === "serve"
        ? {
            "@ryu9663/overlay": resolve(__dirname, "../src/index.ts"),
          }
        : undefined,
  },
}));
```

- `command === "serve"`: `vite dev` 모드다. source를 직접 alias해서 빠르게 개발한다.
- `command === "build"`: `vite build` 모드다. alias를 끄고 실제 package export인 dist를 검증한다.

이렇게 하면 개발 중에는 빠르게 반영되고, 배포 전에는 실제 npm 소비자와 같은 경로를 확인할 수 있다.

## 현재 구조의 한계

현재는 `Overlay` 하나뿐이라 다음 import가 사실상 Overlay CSS만 가져온다.

```tsx
import { Overlay } from "@ryu9663/overlay";
```

하지만 나중에 `src/index.ts`에서 여러 컴포넌트를 한 번에 export하면, root entry가 여러 컴포넌트 CSS를 함께 참조할 수 있다.

```ts
export { default as Overlay } from "./components/Overlay";
export { default as Tooltip } from "./components/Tooltip";
export { default as Modal } from "./components/Modal";
```

이 경우 진짜로 “사용한 컴포넌트의 CSS만” 보장하려면 컴포넌트별 subpath export를 추가하는 것이 좋다.

```tsx
import { Overlay } from "@ryu9663/overlay/overlay";
```

예상 package export:

```json
"exports": {
  ".": {
    "import": "./dist/index.es.js",
    "types": "./dist/src/index.d.ts"
  },
  "./overlay": {
    "import": "./dist/overlay.es.js",
    "types": "./dist/src/components/Overlay.d.ts"
  }
}
```

## 검증 방법

변경 후 최소 검증은 다음이다.

```bash
pnpm run build
pnpm test -- --run
pnpm --filter playground build
```

시각 검증이 필요하면 playground dev server에서 확인한다.

```bash
pnpm --filter playground dev
```

정상 Overlay의 계산 스타일은 다음 조건을 만족해야 한다.

```txt
position: fixed
inset: 0px
z-index: 1000
display: flex
align-items: center
justify-content: center
background-color: rgba(0, 0, 0, 0.5)
```
