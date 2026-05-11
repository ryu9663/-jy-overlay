import type { OverlayInstance, OverlayItem } from "./types";

let overlays: OverlayItem[] = [];
const serverSnapshot: OverlayItem[] = [];

let listeners = new Set<() => void>();

const notify = () => {
  listeners.forEach((listener) => listener());
};

export const overlay: OverlayInstance = {
  open(render) {
    const id = crypto.randomUUID();

    overlays = [...overlays, { id, isOpen: true, render }];

    notify();

    return {
      close() {
        overlay.close(id);
      },
      remove() {
        overlay.remove(id);
      },
    };
  },

  close(id: string) {
    overlays = overlays.map((overlay) => {
      return overlay.id === id ? { ...overlay, isOpen: false } : overlay;
    });

    notify();
  },

  remove(id: string) {
    overlays = overlays.filter((overlay) => overlay.id !== id);
    notify();
  },

  getSnapshot() {
    return overlays;
  },

  subscribe(listener: () => void) {
    listeners.add(listener);

    return () => listeners.delete(listener);
  },

  getServerSnapshot() {
    return serverSnapshot;
  },
};
