import "./ItemModal.css";
import { useEffect } from "react";

function ItemModal({ isOpen, onClose, card, handleDelete }) {
  const handleDeleteItem = () => {
    handleDelete(card);
  };

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
  });
  return (
    <div className={`modal  ${isOpen ? "modal_opened" : ""}`}>
      <div className="modal__content modal__content_type_image">
        <button
          onClick={onClose}
          type="button"
          className="modal__close modal__close_type_item"
        ></button>
        <img src={card.imageUrl} alt={card.name} className="modal__image" />
        <div className="modal__footer">
          <div className="modal__card-info">
            <h2 className="modal__caption">{card.name}</h2>
            <p className="modal__weather">Weather: {card.weather}</p>
          </div>
          <button
            onClick={handleDeleteItem}
            type="button"
            className="modal__delete-item-btn"
          >
            Delete item
          </button>
        </div>
      </div>
    </div>
  );
}
export default ItemModal;
