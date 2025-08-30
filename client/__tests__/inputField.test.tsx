import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

function TestInput() {
  const [value, setValue] = React.useState("");
  return (
    <input
      placeholder="Type here"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

test("input updates value on change", () => {
  render(<TestInput />);
  const input = screen.getByPlaceholderText("Type here");
  fireEvent.change(input, { target: { value: "KanDo" } });
  expect(input).toHaveValue("KanDo");
});
