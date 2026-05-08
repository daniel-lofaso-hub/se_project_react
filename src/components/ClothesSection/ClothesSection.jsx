import { useContext } from "react";
import "./ClothesSection.css";
import ItemCard from "../ItemCard/ItemCard";
import CurrentUserContext from "../../contexts/CurrentUserContext";

export default function ClothesSection({
  clothingItems,
  onCardClick,
  onCardLike,
  handleAddClick,
}) {
  const currentUser = useContext(CurrentUserContext);
  const visibleItems = currentUser
    ? clothingItems.filter(
        (item) =>
          item.owner?._id === currentUser._id || item.owner === currentUser._id,
      )
    : [];

  return (
    <div className="clothes-section">
      <div className="clothes-section__row">
        <p>Your items</p>
        <button
          onClick={handleAddClick}
          type="button"
          className="clothes-section__add-btn"
        >
          + Add new
        </button>
      </div>

      <ul className="clothes-section__list">
        {visibleItems.map((item) => {
          return (
            <ItemCard
              key={item._id}
              item={item}
              onCardClick={onCardClick}
              onCardLike={onCardLike}
            />
          );
        })}
      </ul>
    </div>
  );
}
