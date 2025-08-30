import { render, screen } from "@testing-library/react";

test("renders welcome message", () => {
  render(<h1>Welcome to KanDo!</h1>);
  expect(screen.getByText("Welcome to KanDo!")).toBeInTheDocument();
});
