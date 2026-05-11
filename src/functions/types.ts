import type { ReactNode } from "react";

export type OverlayController = {
  close: () => void;
  remove: () => void;
};

export type OverlayRenderProps = {
  isOpen: boolean;
  close: () => void;
  remove: () => void;
};

export type OverlayRenderer = (props: OverlayRenderProps) => ReactNode;

export type OverlayOpen = (render: OverlayRenderer) => OverlayController;

export type OverlayCloser = (id: string) => void;

export type OverlayRemover = (id: string) => void;

export interface OverlayInstance {
  /** open은 렌더 함수를 store에 등록하고 제어 객체를 반환한다. */
  open: OverlayOpen;
  close: OverlayCloser;
  remove: OverlayRemover;
  getSnapshot: () => OverlayItem[];
  getServerSnapshot: () => OverlayItem[];
  subscribe: (listener: () => void) => () => void;
}

export type OverlayItem = {
  id: string;
  isOpen: boolean;
  render: OverlayRenderer;
};
