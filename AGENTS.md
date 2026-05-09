# Project Guide Index

이 파일은 `@ryu9663/overlay` 저장소의 주요 문서 목차로 사용한다.

## Docs

- [Component-scoped Tailwind CSS loading](docs/component-scoped-tailwind-css.md)
  - 소비 앱에서 전체 CSS를 import하지 않고 컴포넌트 import만으로 필요한 Tailwind utility CSS를 로드하는 구조
  - `Overlay.css`의 `@source`, `tailwindcss/utilities.css`, Vite CSS 주입, package exports, playground dev/build 분리 설명
- [TODO: Add subpath exports for component-level JS/CSS splitting](docs/todo/subpath-exports-for-component-css.md)
  - `@ryu9663/overlay/overlay-provider` 같은 컴포넌트별 import로 사용하는 컴포넌트의 JS/CSS만 로드하기 위한 후속 작업

## Local notes

- `playground/`는 라이브러리 컴포넌트를 실제 React 앱에서 확인하는 테스트 앱이다.
- 배포 전 검증은 source alias가 아닌 dist export 기준으로 수행한다.
