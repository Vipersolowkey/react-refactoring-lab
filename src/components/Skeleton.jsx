import React from "react";
function Placeholder({ width = "100%" }) {
  return (
    <span className="skeleton-text shimmer" style={{ width }}>
      &nbsp;
    </span>
  );
}
export default function Skeleton({ kind = "detail" }) {
  const isForm = kind === "form";
  return (
    <section
      className={"panel " + (isForm ? "form-panel" : "detail")}
      aria-busy="true"
      data-testid="skeleton"
    >
      <p role="status" aria-live="polite" className="sr-only">
        Đang tải giao diện…
      </p>
      <div aria-hidden="true">
        {isForm ? (
          <>
            <span className="eyebrow">
              <Placeholder width="120px" />
            </span>
            <h1>
              <Placeholder width="85%" />
            </h1>
            <p className="intro">
              Tất cả các trường đều bắt buộc. Đây là form thực hành, không gửi
              dữ liệu ra ngoài.
            </p>
            {[false, false, true].map((multiline, index) => (
              <div className="field" key={index}>
                <div className="skeleton-label">
                  <Placeholder width="90px" />
                </div>
                <div
                  className={
                    "skeleton-control shimmer" + (multiline ? " multiline" : "")
                  }
                />
              </div>
            ))}
            <div className="button skeleton-button shimmer">&nbsp;</div>
          </>
        ) : (
          <>
            <div className="avatar large shimmer" />
            <h2>
              <Placeholder width="75%" />
            </h2>
            <p className="role">
              <Placeholder width="55%" />
            </p>
            <dl>
              {[1, 2, 3, 4].map((index) => (
                <div className="detail-row" key={index}>
                  <dt>
                    <Placeholder width="80%" />
                  </dt>
                  <dd>
                    <Placeholder width="90%" />
                  </dd>
                </div>
              ))}
            </dl>
          </>
        )}
      </div>
    </section>
  );
}
