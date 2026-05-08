import { useFormWithValidation } from "../../hooks/useFormWithValidation";
import { useEffect, useState, useContext } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import CurrentUserContext from "../../contexts/CurrentUserContext";

const EditProfileModal = ({ isOpen, onUpdateUser, onClose }) => {
  const currentUser = useContext(CurrentUserContext);
  const defaultValues = {
    name: "",
    avatar: "",
  };

  const validationRules = {
    name: {
      required: true,
      requiredMessage: "Name is required",
    },
    avatar: {
      required: true,
      requiredMessage: "Image URL is required",
      pattern: /^https?:\/\/.+/,
      patternMessage:
        "Please enter a valid URL starting with http:// or https://",
    },
  };

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setValues,
  } = useFormWithValidation(defaultValues, validationRules);

  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen && currentUser) {
      setValues({
        name: currentUser.name || "",
        avatar: currentUser.avatar || "",
      });
      setIsSubmitted(false);
      // Validate after setting values
      setTimeout(() => validateForm(), 0);
    }
  }, [isOpen, currentUser, setValues]);

  function handleSubmit(evt) {
    evt.preventDefault();
    setIsSubmitted(true);
    if (validateForm()) {
      onUpdateUser(values);
      resetForm();
      setIsSubmitted(false);
    }
  }

  return (
    <ModalWithForm
      title="Change profile data"
      buttonText="Save changes"
      name="edit-profile"
      onClose={onClose}
      onSubmit={handleSubmit}
      isOpen={isOpen}
    >
      <label htmlFor="name" className="modal__label">
        Name{" "}
        <input
          type="text"
          className={`modal__input ${isSubmitted && errors.name ? "modal__input_error" : ""}`}
          name="name"
          id="edit-name"
          placeholder="Name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {isSubmitted && errors.name && (
          <span className="modal__error">{errors.name}</span>
        )}
      </label>
      <label htmlFor="avatar" className="modal__label">
        Avatar URL{" "}
        <input
          type="url"
          className={`modal__input ${isSubmitted && errors.avatar ? "modal__input_error" : ""}`}
          name="avatar"
          id="edit-avatar"
          placeholder="Avatar URL"
          value={values.avatar}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {isSubmitted && errors.avatar && (
          <span className="modal__error">{errors.avatar}</span>
        )}
      </label>
    </ModalWithForm>
  );
};

export default EditProfileModal;
