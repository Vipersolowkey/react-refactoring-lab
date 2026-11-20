import React, { Component } from "react";

// A rejected lazy import needs a full reload: React.lazy caches the rejection.
export default class PageBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <section
          className={
            "panel " + (this.props.kind === "form" ? "form-panel" : "detail")
          }
        >
          <div role="alert">
            <h2>Không thể tải trang</h2>
            <p>
              Kiểm tra kết nối mạng rồi tải lại. Thông tin chưa gửi có thể bị
              mất khi tải lại.
            </p>
          </div>
          <a className="button" href={this.props.retryPath}>
            Tải lại trang
          </a>
        </section>
      );
    }
    return this.props.children;
  }
}
