import React from "react";
export default function InputField({
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  multiline = false,
}) {
  const Tag = multiline ? "textarea" : "input";
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <Tag
        id={name}
        name={name}
        required
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        type={multiline ? undefined : name === "email" ? "email" : "text"}
        autoComplete={
          name === "name" ? "name" : name === "email" ? "email" : undefined
        }
        aria-invalid={Boolean(error)}
        aria-describedby={error ? name + "-error" : undefined}
        rows={multiline ? 5 : undefined}
      />
      {error && (
        <p className="error" id={name + "-error"}>
          {error}
        </p>
      )}
    </div>
  );
}
