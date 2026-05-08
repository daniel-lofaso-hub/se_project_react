import "./ModalWithForm.css";
import { useEffect } from "react";

function ModalWithForm({
  children,
  buttonText,
  title,
  name,
  isOpen,
  onClose,
  onSubmit,
  disabled,
  secondaryButton,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscClose = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscClose);

    return () => {
      document.removeEventListener("keydown", handleEscClose);
    };
  }, [isOpen]);

  return (
    <div className={`modal modal_type_${name} ${isOpen ? "modal_opened" : ""}`}>
      <div className="modal__content">
        <h2 className="modal__title">{title}</h2>
        <button
          onClick={onClose}
          type="button"
          className="modal__close"
        ></button>
        <form onSubmit={onSubmit} className="modal__form">
          {children}

          <div className="modal__buttons">
            <button
              type="submit"
              className={`modal__submit modal__submit_type_${name} ${disabled ? "modal__submit_disabled" : ""}`}
              disabled={disabled}
            >
              {buttonText}
            </button>
            {secondaryButton}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalWithForm;
