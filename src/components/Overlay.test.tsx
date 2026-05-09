import { render, screen } from "@testing-library/react";
import Overlay from "./Overlay";

test("renders overlay when open", () => {
  render(
    <Overlay isOpen={true} onClose={() => {}}>
      Content
    </Overlay>,
  );
  expect(screen.getByText("Content")).toBeInTheDocument();
});
