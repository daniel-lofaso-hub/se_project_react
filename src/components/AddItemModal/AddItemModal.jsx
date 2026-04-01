import { useFormWithValidation } from "../../hooks/useFormWithValidation";
import { useEffect, useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";

const AddItemModal = ({ isOpen, onAddItem, onClose }) => {
  const defaultValues = {
    name: "",
    imageUrl: "",
    weather: "",
  };

  const validationRules = {
    name: {
      required: true,
      requiredMessage: "Name is required",
    },
    imageUrl: {
      required: true,
      requiredMessage: "Image URL is required",
      pattern: /^https?:\/\/.+/,
      patternMessage:
        "Please enter a valid URL starting with http:// or https://",
    },
    weather: {
      required: true,
      requiredMessage: "Please select a weather type",
    },
  };

  const {
    values,
    errors,
    isValid,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
  } = useFormWithValidation(defaultValues, validationRules);

  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      resetForm();
      setIsSubmitted(false);
    }
  }, [isOpen]);

  function handleSubmit(evt) {
    evt.preventDefault();
    setIsSubmitted(true);
    if (validateForm()) {
      onAddItem(values);
      resetForm();
      setIsSubmitted(false);
    }
  }

  return (
    <ModalWithForm
      title="New garment"
      buttonText="Add garment"
      name="add-garment"
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
          id="name"
          placeholder="Name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {isSubmitted && errors.name && (
          <span className="modal__error">{errors.name}</span>
        )}
      </label>
      <label htmlFor="imageUrl" className="modal__label">
        Image{" "}
        <input
          type="url"
          className={`modal__input ${isSubmitted && errors.imageUrl ? "modal__input_error" : ""}`}
          name="imageUrl"
          id="imageUrl"
          placeholder="Image URL"
          value={values.imageUrl}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {isSubmitted && errors.imageUrl && (
          <span className="modal__error">{errors.imageUrl}</span>
        )}
      </label>
      <fieldset
        className={`modal__radio-buttons ${isSubmitted && errors.weather ? "modal__radio-buttons_error" : ""}`}
      >
        <legend className="modal__legend">Select the weather type:</legend>
        <label htmlFor="hot" className="modal__label modal__label_type_radio">
          <input
            id="hot"
            type="radio"
            name="weather"
            checked={values.weather === "hot"}
            className="modal__radio-input"
            value="hot"
            onChange={handleChange}
            onBlur={handleBlur}
          />{" "}
          Hot
        </label>
        <label htmlFor="warm" className="modal__label modal__label_type_radio">
          <input
            id="warm"
            type="radio"
            name="weather"
            checked={values.weather === "warm"}
            className="modal__radio-input"
            value="warm"
            onChange={handleChange}
            onBlur={handleBlur}
          />{" "}
          Warm
        </label>
        <label htmlFor="cold" className="modal__label modal__label_type_radio">
          <input
            id="cold"
            type="radio"
            name="weather"
            checked={values.weather === "cold"}
            className="modal__radio-input"
            value="cold"
            onChange={handleChange}
            onBlur={handleBlur}
          />{" "}
          Cold
        </label>
        {isSubmitted && errors.weather && (
          <span className="modal__error">{errors.weather}</span>
        )}
      </fieldset>
    </ModalWithForm>
  );
};

export default AddItemModal;
