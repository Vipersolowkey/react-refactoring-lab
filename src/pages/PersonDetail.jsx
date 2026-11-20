import React from "react";
import { useParams, Link } from "react-router";
import { people } from "../people";
export default function PersonDetail() {
  const { id } = useParams();
  const person = people.find((p) => String(p.id) === id);
  if (!person)
    return (
      <section className="panel detail">
        <span className="eyebrow">KHÔNG TÌM THẤY THÀNH VIÊN</span>
        <h2>ID không tồn tại</h2>
        <p>Không có thành viên phù hợp với đường dẫn này.</p>
        <Link to="/people">Quay lại danh sách</Link>
      </section>
    );
  return (
    <section className="panel detail">
      <span className="avatar large">{person.initials}</span>
      <h2>{person.name}</h2>
      <p className="role">{person.role}</p>
      <dl>
        {[
          ["Nhóm", person.team],
          ["Email", person.email],
          ["Địa điểm", person.location],
          ["Giới thiệu", person.bio],
        ].map(([label, value]) => (
          <div className="detail-row" key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
