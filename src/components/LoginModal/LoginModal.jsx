import { useFormWithValidation } from "../../hooks/useFormWithValidation";
import { useEffect, useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";

const LoginModal = ({ isOpen, onLogin, onClose }) => {
  const defaultValues = {
    email: "",
    password: "",
  };

  const validationRules = {
    email: {
      required: true,
      requiredMessage: "Email is required",
    },
    password: {
      required: true,
      requiredMessage: "Password is required",
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
      onLogin(values);
      resetForm();
      setIsSubmitted(false);
    }
  }

  return (
    <ModalWithForm
      title="Log in"
      buttonText="Log in"
      name="login"
      onClose={onClose}
      onSubmit={handleSubmit}
      isOpen={isOpen}
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
    </ModalWithForm>
  );
};

export default LoginModal;
