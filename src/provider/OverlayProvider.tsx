import { Fragment, useSyncExternalStore, type PropsWithChildren } from "react";
import "./OverlayProvider.css";
import { overlay } from "../functions/overlay";

export const OverlayProvider = ({ children }: PropsWithChildren) => {
  const overlays = useSyncExternalStore(
    overlay.subscribe,
    overlay.getSnapshot,
    overlay.getServerSnapshot,
  );

  return (
    <>
      {children}
      {overlays.map(({ render, isOpen, id }) => (
        <Fragment key={id}>
          {render({
            isOpen,
            close: () => overlay.close(id),
          })}
        </Fragment>
      ))}
    </>
  );
};
