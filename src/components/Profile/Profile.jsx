import ClothesSection from "../ClothesSection/ClothesSection";
import SideBar from "../SideBar/SideBar";

import "./Profile.css";

export default function Profile({
  clothingItems,
  handleCardClick,
  handleAddClick,
  onEditProfileClick,
  onLogoutClick,
}) {
  return (
    <section className="profile">
      <SideBar
        onEditProfileClick={onEditProfileClick}
        onLogoutClick={onLogoutClick}
      />
      <ClothesSection
        clothingItems={clothingItems}
        onCardClick={handleCardClick}
        handleAddClick={handleAddClick}
      />
    </section>
  );
}
