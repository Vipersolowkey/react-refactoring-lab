export function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Vui lòng nhập họ tên.";
  else if (values.name.trim().length < 2)
    errors.name = "Họ tên cần ít nhất 2 ký tự.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = "Vui lòng nhập email hợp lệ.";
  if (values.message.trim().length < 10)
    errors.message = "Lời nhắn cần ít nhất 10 ký tự.";
  return errors;
}
