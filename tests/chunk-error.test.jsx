import React from "react";
import { it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
vi.mock("../src/pages/PersonDetail", () => {
  throw new Error("Simulated failed chunk download");
});
import App from "../src/App";
it("handles a rejected lazy import inside the real application layout", async () => {
  const spy = vi.spyOn(console, "error").mockImplementation(() => {});
  try {
    render(
      <MemoryRouter initialEntries={["/people/1"]}>
        <App />
      </MemoryRouter>,
    );
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Không thể tải trang",
    );
    expect(
      screen.getByRole("navigation", { name: "Điều hướng chính" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Danh sách người" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tải lại trang" })).toHaveAttribute(
      "href",
      "/people",
    );
  } finally {
    spy.mockRestore();
  }
});
