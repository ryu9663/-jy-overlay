# @ryu9663/overlay

React overlay manager with an imperative trigger and declarative rendering.

```tsx
overlay.open(({ isOpen, close }) => (
  <Dialog open={isOpen} onClose={close}>
    ...
  </Dialog>
));
```

## Install

```bash
npm install @ryu9663/overlay
```

```bash
pnpm add @ryu9663/overlay
```

## Concept

`@ryu9663/overlay` separates overlay control into two parts.

- `overlay.open(...)`: imperative trigger — tells the overlay runtime to open something.
- `<OverlayProvider />`: React bridge — subscribes to the overlay store and renders registered overlays.
- render function: declarative UI — describes what should be rendered.

```txt
overlay.open(renderFn)
  → stores renderFn
  → notifies OverlayProvider
  → OverlayProvider renders renderFn({ isOpen, close })
```

## Usage

Place `OverlayProvider` once near your app root.

```tsx
import { OverlayProvider } from "@ryu9663/overlay";

export function App() {
  return (
    <OverlayProvider>
      <Page />
    </OverlayProvider>
  );
}
```

Open an overlay from anywhere in your React code.

```tsx
import { overlay } from "@ryu9663/overlay";

function Page() {
  return (
    <button
      onClick={() => {
        overlay.open(({ isOpen, close }) =>
          isOpen ? (
            <div role="dialog" aria-modal="true">
              <p>Hello overlay</p>
              <button onClick={close}>Close</button>
            </div>
          ) : null,
        );
      }}
    >
      Open
    </button>
  );
}
```

`overlay.open` returns a controller, so you can also close it imperatively.

```tsx
const controller = overlay.open(({ isOpen, close }) =>
  isOpen ? <MyModal onClose={close} /> : null,
);

controller.close();
```

## With a modal component

The provider does not force any modal UI. Your modal component owns layout, backdrop, focus behavior, and styling.

```tsx
import { overlay } from "@ryu9663/overlay";

function TestModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <div role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <h2>Test modal</h2>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

function OpenButton() {
  return (
    <button
      onClick={() => {
        overlay.open(({ isOpen, close }) => (
          <TestModal open={isOpen} onClose={close} />
        ));
      }}
    >
      Open modal
    </button>
  );
}
```

## API

### `OverlayProvider`

Subscribes to the overlay runtime and renders registered overlays.

```tsx
<OverlayProvider>
  <App />
</OverlayProvider>
```

### `overlay.open(render)`

Registers an overlay renderer and returns a controller.

```ts
type OverlayRenderProps = {
  isOpen: boolean;
  close: () => void;
};

type OverlayRenderer = (props: OverlayRenderProps) => React.ReactNode;

type OverlayController = {
  close: () => void;
};
```

### `overlay.close(id)`

Internal close API used by the provider. Consumers normally use the `close` function passed to the renderer or the returned controller.

## Styling note

The overlay runtime does not require consumers to import a global CSS file. Component-specific CSS is bundled with the library entry.

For implementation details, see:

- [Component-scoped Tailwind CSS loading](docs/component-scoped-tailwind-css.md)
- [TODO: Subpath exports for component-level JS/CSS splitting](docs/todo/subpath-exports-for-component-css.md)

## Development

```bash
pnpm install
pnpm test -- --run
pnpm run build
pnpm --filter playground build
```

Run the playground:

```bash
pnpm --filter playground dev
```

## License

ISC
