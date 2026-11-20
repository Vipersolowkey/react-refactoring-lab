import React, { lazy, Suspense } from "react";
import { Routes, Route, NavLink, Outlet, Link } from "react-router";
import { people } from "./people";
import Skeleton from "./components/Skeleton";
import PageBoundary from "./components/PageBoundary";
const PersonDetail = lazy(() => import("./pages/PersonDetail"));
const Contact = lazy(() => import("./pages/Contact"));
const navClass = ({ isActive }) => (isActive ? "active" : "");
function Layout() {
  return (
    <>
      <a className="skip" href="#main">
        Đến nội dung
      </a>
      <header>
        <Link className="brand" to="/">
          ◈ People Studio <small>REACT LAB / 04</small>
        </Link>
        <nav aria-label="Điều hướng chính">
          <NavLink to="/" end className={navClass}>
            Tổng quan
          </NavLink>
          <NavLink to="/people" className={navClass}>
            Đội ngũ
          </NavLink>
          <NavLink to="/contact" className={navClass}>
            Liên hệ
          </NavLink>
        </nav>
      </header>
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <footer>
        Bài thực hành React · Dữ liệu mẫu · Không gửi dữ liệu đến máy chủ
      </footer>
    </>
  );
}
function Home() {
  return (
    <section className="hero">
      <span className="eyebrow">REFACTORING / REACT ROUTER V7</span>
      <h1>
        Kết nối con người.
        <br />
        <em>Tối giản trải nghiệm.</em>
      </h1>
      <p>
        Một không gian nhỏ để khám phá đội ngũ và thực hành kiến trúc React rõ
        ràng, linh hoạt.
      </p>
      <Link className="button" to="/people">
        Khám phá đội ngũ
      </Link>
      <div className="features">
        <article>
          <strong>01 / Điều hướng</strong>
          <p>Layout dùng chung và các trang con theo URL.</p>
        </article>
        <article>
          <strong>02 / Hiệu năng</strong>
          <p>Tải module khi cần với skeleton giữ bố cục.</p>
        </article>
        <article>
          <strong>03 / Tương tác</strong>
          <p>Form có validation và hỗ trợ bàn phím.</p>
        </article>
      </div>
    </section>
  );
}
function People() {
  return (
    <>
      <span className="eyebrow">OUR PEOPLE / DỮ LIỆU MẪU</span>
      <h1>Những người đồng hành.</h1>
      <p className="intro">Chọn một thành viên để tìm hiểu thêm về họ.</p>
      <div className="master-detail">
        <aside className="panel">
          <h2>
            Đội ngũ <small>{people.length} thành viên</small>
          </h2>
          <nav aria-label="Danh sách người">
            {people.map((p) => (
              <NavLink
                className={({ isActive }) =>
                  "person-link " + (isActive ? "selected" : "")
                }
                to={"/people/" + p.id}
                key={p.id}
              >
                <span className="avatar">{p.initials}</span>
                <span>
                  <strong>{p.name}</strong>
                  <small>{p.role}</small>
                </span>
              </NavLink>
            ))}
          </nav>
        </aside>
        <PageBoundary retryPath="/people">
          <Suspense fallback={<Skeleton />}>
            <Outlet />
          </Suspense>
        </PageBoundary>
      </div>
    </>
  );
}
function Empty() {
  return (
    <section className="panel detail empty">
      <span className="empty-icon">◎</span>
      <h2>Bắt đầu một kết nối</h2>
      <p>Chọn một người từ danh sách để xem thông tin chi tiết.</p>
    </section>
  );
}
export function NotFound() {
  return (
    <section className="panel detail">
      <span className="eyebrow">404 / KHÔNG TÌM THẤY</span>
      <h1>Trang không tồn tại.</h1>
      <p>Kiểm tra đường dẫn hoặc quay lại trang tổng quan.</p>
      <Link to="/">Về tổng quan</Link>
    </section>
  );
}
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="people" element={<People />}>
          <Route index element={<Empty />} />
          <Route path=":id" element={<PersonDetail />} />
        </Route>
        <Route
          path="contact"
          element={
            <PageBoundary kind="form" retryPath="/contact">
              <Suspense fallback={<Skeleton kind="form" />}>
                <Contact />
              </Suspense>
            </PageBoundary>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
