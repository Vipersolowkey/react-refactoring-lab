import React from "react";
import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import userEvent from "@testing-library/user-event";
import App from "../src/App";
import Skeleton from "../src/components/Skeleton";
import SimpleForm from "../src/components/SimpleForm";
it("keeps shared navigation and list visible while a detail module loads", async () => {
  render(
    <MemoryRouter initialEntries={["/people/1"]}>
      <App />
    </MemoryRouter>,
  );
  expect(screen.getByTestId("skeleton")).toHaveAttribute("aria-busy", "true");
  expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
  expect(
    screen.getByRole("navigation", { name: "Điều hướng chính" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("navigation", { name: "Danh sách người" }),
  ).toBeInTheDocument();
  expect(
    await screen.findByRole("heading", { name: "Nguyễn Minh Anh" }),
  ).toBeInTheDocument();
  expect(screen.queryByTestId("skeleton")).not.toBeInTheDocument();
});
it("form skeleton contains no focusable fake controls", () => {
  const { container } = render(<Skeleton kind="form" />);
  expect(container.querySelectorAll(".skeleton-control")).toHaveLength(3);
  expect(container.querySelectorAll("input,textarea,button,a")).toHaveLength(0);
  expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
});
it("shows a field error on blur and skips valid fields when focusing errors", async () => {
  const user = userEvent.setup();
  render(<SimpleForm />);
  await user.click(screen.getByLabelText("Email"));
  await user.tab();
  expect(screen.getByText("Vui lòng nhập email hợp lệ.")).toBeInTheDocument();
  await user.type(screen.getByLabelText("Họ tên"), "An");
  await user.click(screen.getByRole("button", { name: "Kiểm tra lời nhắn" }));
  expect(screen.getByLabelText("Email")).toHaveFocus();
});
