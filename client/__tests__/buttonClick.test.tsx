import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

function TestButton() {
  const [clicked, setClicked] = React.useState(false);
  return (
    <button onClick={() => setClicked(true)}>
      {clicked ? "Clicked!" : "Click me"}
    </button>
  );
}

test("button changes text after click", () => {
  render(<TestButton />);
  const button = screen.getByText("Click me");
  fireEvent.click(button);
  expect(screen.getByText("Clicked!")).toBeInTheDocument();
});
