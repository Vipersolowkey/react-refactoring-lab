import React from "react";
import { it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import PageBoundary from "../src/components/PageBoundary";
import InputField from "../src/components/InputField";
import App from "../src/App";
function BrokenPage() {
  throw new Error("Simulated module failure");
}
it("shows an accessible recovery screen without removing shared navigation", () => {
  const spy = vi.spyOn(console, "error").mockImplementation(() => {});
  try {
    render(
      <>
        <nav aria-label="Shared navigation">Navigation remains</nav>
        <PageBoundary retryPath="/people">
          <BrokenPage />
        </PageBoundary>
      </>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Không thể tải trang");
    expect(
      screen.getByRole("navigation", { name: "Shared navigation" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tải lại trang" })).toHaveAttribute(
      "href",
      "/people",
    );
  } finally {
    spy.mockRestore();
  }
});
it("marks required fields and connects errors to the field", () => {
  render(
    <InputField
      name="email"
      label="Email"
      value="bad"
      onChange={() => {}}
      error="Email sai"
    />,
  );
  const field = screen.getByRole("textbox", { name: "Email" });
  expect(field).toBeRequired();
  expect(field).toHaveAccessibleDescription("Email sai");
  expect(field).toHaveAttribute("aria-invalid", "true");
});
it("has a focusable skip-link destination", () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  expect(screen.getByRole("link", { name: "Đến nội dung" })).toHaveAttribute(
    "href",
    "#main",
  );
  expect(screen.getByRole("main")).toHaveAttribute("tabindex", "-1");
});
