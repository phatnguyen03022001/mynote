import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  it("states the MyNote product promise", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { name: "MyNote" })).toBeInTheDocument();
    expect(screen.getByText("Capture first. Organize later.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute("href", "/signin");
  });
});
