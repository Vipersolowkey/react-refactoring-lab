import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useNavigate } from "react-router";
import App from "../src/App";
import SimpleForm from "../src/components/SimpleForm";
import { validate } from "../src/validation";
function History() {
  const go = useNavigate();
  return (
    <>
      <button onClick={() => go(-1)}>Back</button>
      <button onClick={() => go(1)}>Forward</button>
    </>
  );
}
function app(path = "/") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <History />
      <App />
    </MemoryRouter>,
  );
}
describe("routing and people", () => {
  it("shows index and active navigation", () => {
    app();
    expect(screen.getByRole("link", { name: "Tổng quan" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
  it("selects people and supports history", async () => {
    const u = userEvent.setup();
    app("/people");
    expect(screen.getByText("Bắt đầu một kết nối")).toBeInTheDocument();
    await u.click(screen.getByRole("link", { name: /Nguyễn Minh Anh/ }));
    expect(
      await screen.findByRole("heading", { name: "Nguyễn Minh Anh" }),
    ).toBeInTheDocument();
    await u.click(screen.getByRole("link", { name: /Trần Hoàng Nam/ }));
    expect(
      await screen.findByRole("heading", { name: "Trần Hoàng Nam" }),
    ).toBeInTheDocument();
    await u.click(screen.getByText("Back"));
    expect(
      await screen.findByRole("heading", { name: "Nguyễn Minh Anh" }),
    ).toBeInTheDocument();
    await u.click(screen.getByText("Forward"));
    expect(
      await screen.findByRole("heading", { name: "Trần Hoàng Nam" }),
    ).toBeInTheDocument();
  });
  it("opens direct detail URL", async () => {
    app("/people/3");
    expect(
      await screen.findByRole("heading", { name: "Lê Thu Hà" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Hà Nội")).toBeInTheDocument();
  });
  it("handles unknown ID", async () => {
    app("/people/nope");
    expect(await screen.findByText("ID không tồn tại")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Quay lại danh sách" }),
    ).toHaveAttribute("href", "/people");
  });
  it("handles unknown route", () => {
    app("/missing");
    expect(screen.getByText("Trang không tồn tại.")).toBeInTheDocument();
  });
});
describe("form", () => {
  it("validates boundaries", () => {
    expect(
      Object.keys(validate({ name: " ", email: "x", message: "short" })),
    ).toHaveLength(3);
    expect(
      validate({ name: "An", email: "a@b.co", message: "0123456789" }),
    ).toEqual({});
  });
  it("shows errors after interaction, focuses first error and accepts corrections", async () => {
    const u = userEvent.setup();
    render(<SimpleForm />);
    expect(screen.queryByText("Vui lòng nhập họ tên.")).not.toBeInTheDocument();
    await u.click(screen.getByRole("button", { name: "Kiểm tra lời nhắn" }));
    expect(screen.getByLabelText("Họ tên")).toHaveFocus();
    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await u.type(screen.getByLabelText("Họ tên"), "Nguyen An");
    await u.type(screen.getByLabelText("Email"), "an@example.com");
    await u.type(
      screen.getByLabelText("Lời nhắn"),
      "Xin chao cac ban trong nhom",
    );
    await u.click(screen.getByRole("button", { name: "Kiểm tra lời nhắn" }));
    expect(screen.getByRole("status")).toHaveTextContent("Thông tin hợp lệ");
    await u.clear(screen.getByLabelText("Email"));
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "aria-describedby",
      "email-error",
    );
  });
});
