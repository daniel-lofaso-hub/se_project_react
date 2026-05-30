import "./ModalWithForm.css";
import { useEffect, useState } from "react";

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
  errorMessage: propErrorMessage,
  setErrorMessage: propSetErrorMessage,
}) {
  const [localErrorMessage, setLocalErrorMessage] = useState("");
  const errorMessage = propErrorMessage ?? localErrorMessage;
  const setErrorMessage = propSetErrorMessage ?? setLocalErrorMessage;
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

  useEffect(() => {
    if (!isOpen) {
      setErrorMessage("");
    }
  }, [isOpen, setErrorMessage]);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setErrorMessage("");
    if (!onSubmit) return;
    try {
      const result = await onSubmit(e);
      if (typeof result === "string" && result) {
        setErrorMessage(result);
      } else if (result && typeof result === "object") {
        if (result.error) setErrorMessage(result.error);
      }
    } catch (err) {
      let message =
        typeof err === "string"
          ? err
          : err?.message ||
            (typeof err === "object" ? JSON.stringify(err) : String(err));
      if (!message || message === "[object Object]") {
        message = "Something went wrong";
      }
      setErrorMessage(message);
    }
  };

  return (
    <div className={`modal modal_type_${name} ${isOpen ? "modal_opened" : ""}`}>
      <div className="modal__content">
        <h2 className="modal__title">{title}</h2>
        <button
          onClick={onClose}
          type="button"
          className="modal__close"
        ></button>
        <form onSubmit={handleSubmit} className="modal__form">
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
          {errorMessage && <span className="modal__error">{errorMessage}</span>}
        </form>
      </div>
    </div>
  );
}

export default ModalWithForm;
