import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import "./SideBar.css";

export default function SideBar() {
  const currentUser = useContext(CurrentUserContext);
  return (
    <aside className="side-bar">
      <div className="side-bar__user-container">
        {currentUser.avatar ? (
          <img
            src={currentUser.avatar}
            alt={currentUser.name || "User"}
            className="side-bar__avatar"
          />
        ) : (
          <div className="side-bar__avatar-placeholder">
            {(currentUser.name || currentUser.email || "U")[0].toUpperCase()}
          </div>
        )}
        <p className="side-bar__username">
          {currentUser.name || currentUser.email || "User"}
        </p>
      </div>
    </aside>
  );
}
