import React from "react";
import "./Modal.css";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  width = "600px",
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="common-modal-overlay" onMouseDown={onClose}>
      <div
        className="common-modal"
        style={{ maxWidth: width }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="common-modal-header">
          <h2>{title}</h2>

          <button
            type="button"
            className="common-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="common-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;