import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { overlay } from "./overlay";
import { OverlayProvider } from "../provider/OverlayProvider";

const removeAllOverlays = () => {
  for (const item of overlay.getSnapshot()) {
    overlay.remove(item.id);
  }
};

afterEach(() => {
  act(() => {
    removeAllOverlays();
  });
});

describe("overlay", () => {
  it("overlay.open으로 등록한 UI를 OverlayProvider에서 렌더링한다", () => {
    render(
      <OverlayProvider>
        <main>App content</main>
      </OverlayProvider>,
    );

    act(() => {
      overlay.open(({ isOpen, close }) =>
        isOpen ? (
          <section aria-label="Test dialog" role="dialog">
            <p>Opened overlay</p>
            <button onClick={close}>Close overlay</button>
          </section>
        ) : null,
      );
    });

    expect(screen.getByText("App content")).toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "Test dialog" })).toBeInTheDocument();
    expect(screen.getByText("Opened overlay")).toBeInTheDocument();
  });

  it("renderer에 전달된 close를 호출하면 overlay가 닫힌다", () => {
    render(<OverlayProvider />);

    act(() => {
      overlay.open(({ isOpen, close }) =>
        isOpen ? (
          <section aria-label="Closable dialog" role="dialog">
            <button onClick={close}>Close overlay</button>
          </section>
        ) : null,
      );
    });

    expect(screen.getByRole("dialog", { name: "Closable dialog" })).toBeInTheDocument();

    act(() => {
      screen.getByRole("button", { name: "Close overlay" }).click();
    });

    expect(screen.queryByRole("dialog", { name: "Closable dialog" })).not.toBeInTheDocument();
    expect(overlay.getSnapshot()[0]?.isOpen).toBe(false);
  });

  it("open이 반환한 controller.close로 overlay를 닫을 수 있다", () => {
    render(<OverlayProvider />);

    let controller: ReturnType<typeof overlay.open>;

    act(() => {
      controller = overlay.open(({ isOpen }) =>
        isOpen ? (
          <section aria-label="Controller dialog" role="dialog">
            Controller overlay
          </section>
        ) : null,
      );
    });

    expect(screen.getByRole("dialog", { name: "Controller dialog" })).toBeInTheDocument();

    act(() => {
      controller.close();
    });

    expect(screen.queryByRole("dialog", { name: "Controller dialog" })).not.toBeInTheDocument();
    expect(overlay.getSnapshot()[0]?.isOpen).toBe(false);
  });

  it("remove는 overlay item을 store에서 제거한다", () => {
    act(() => {
      overlay.open(({ isOpen }) =>
        isOpen ? (
          <section aria-label="Removable dialog" role="dialog">
            Removable overlay
          </section>
        ) : null,
      );
    });

    expect(overlay.getSnapshot()).toHaveLength(1);

    act(() => {
      overlay.close(overlay.getSnapshot()[0]!.id);
    });

    expect(overlay.getSnapshot()).toHaveLength(1);
    expect(overlay.getSnapshot()[0]?.isOpen).toBe(false);

    act(() => {
      overlay.remove(overlay.getSnapshot()[0]!.id);
    });

    expect(overlay.getSnapshot()).toHaveLength(0);
  });
});
