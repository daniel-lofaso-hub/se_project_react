import { useFormWithValidation } from "../../hooks/useFormWithValidation";
import { useEffect, useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";

const RegisterModal = ({ isOpen, onRegister, onClose, onLoginClick }) => {
  const defaultValues = {
    email: "",
    password: "",
    name: "",
    avatar: "",
  };

  const validationRules = {
    email: {
      required: true,
      requiredMessage: "Email is required",
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      patternMessage: "(this is not a email address)",
    },
    password: {
      required: true,
      requiredMessage: "Password is required",
    },
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
      validateForm();
      setIsSubmitted(false);
    }
  }, [isOpen]);

  function handleSubmit(evt) {
    evt.preventDefault();
    setIsSubmitted(true);
    if (validateForm()) {
      onRegister(values);
      resetForm();
      setIsSubmitted(false);
    }
  }

  return (
    <ModalWithForm
      title="Sign up"
      buttonText="Next"
      name="sign-up"
      onClose={onClose}
      onSubmit={handleSubmit}
      isOpen={isOpen}
      disabled={!isValid || isSubmitted}
      secondaryButton={
        <button
          type="button"
          className="modal__secondary-btn"
          onClick={onLoginClick}
        >
          or Log in
        </button>
      }
    >
      <label htmlFor="email" className="modal__label">
        Email*{" "}
        <input
          type="email"
          className={`modal__input ${isSubmitted && errors.email ? "modal__input_error" : ""}`}
          name="email"
          id="email"
          placeholder="Email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {isSubmitted && errors.email && (
          <span className="modal__error">{errors.email}</span>
        )}
      </label>
      <label htmlFor="password" className="modal__label">
        Password*{" "}
        <input
          type="password"
          className={`modal__input ${isSubmitted && errors.password ? "modal__input_error" : ""}`}
          name="password"
          id="password"
          placeholder="Password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {isSubmitted && errors.password && (
          <span className="modal__error">{errors.password}</span>
        )}
      </label>
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
      <label htmlFor="avatar" className="modal__label">
        Avatar URL{" "}
        <input
          type="url"
          className={`modal__input ${isSubmitted && errors.avatar ? "modal__input_error" : ""}`}
          name="avatar"
          id="avatar"
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

export default RegisterModal;
