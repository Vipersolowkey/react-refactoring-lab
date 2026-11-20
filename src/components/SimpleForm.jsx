import React, { useState } from "react";
import InputField from "./InputField";
import { validate } from "../validation";
const fields = [
  ["name", "Họ tên"],
  ["email", "Email"],
  ["message", "Lời nhắn"],
];
export default function SimpleForm() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  const errors = validate(values);
  function submit(event) {
    event.preventDefault();
    setSubmitted(true);
    setSuccess(false);
    const first = fields.find(([name]) => errors[name]);
    if (first) {
      event.currentTarget.elements.namedItem(first[0]).focus();
      return;
    }
    setSuccess(true);
  }
  return (
    <form noValidate onSubmit={submit}>
      <p className="intro">
        Tất cả các trường đều bắt buộc. Đây là form thực hành, không gửi dữ liệu
        ra ngoài.
      </p>
      {fields.map(([name, label]) => (
        <InputField
          key={name}
          name={name}
          label={label}
          multiline={name === "message"}
          value={values[name]}
          onChange={(e) => {
            const value = e.target.value;
            setValues((current) => ({ ...current, [name]: value }));
            setSuccess(false);
          }}
          onBlur={() => setTouched((current) => ({ ...current, [name]: true }))}
          error={touched[name] || submitted ? errors[name] : undefined}
        />
      ))}
      <button className="button" type="submit">
        Kiểm tra lời nhắn
      </button>
      <p role="status" aria-live="polite">
        {success
          ? "Thông tin hợp lệ. Đã kiểm tra tại trình duyệt; chưa gửi đến máy chủ."
          : ""}
      </p>
    </form>
  );
}
