import { useState, useCallback } from "react";

export function useFormWithValidation(defaultValues, validationRules = {}) {
  const [values, setValues] = useState(defaultValues);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(true);

  // Validate a single field
  const validateField = useCallback(
    (name, value) => {
      const rule = validationRules[name];
      if (!rule) return "";

      // Handle custom validation function
      if (typeof rule === "function") {
        return rule(value) || "";
      }

      // Handle validation object with rules
      if (rule.required && (!value || value.trim() === "")) {
        return rule.requiredMessage || "This field is required";
      }

      if (rule.pattern && value && !rule.pattern.test(value)) {
        return rule.patternMessage || "Invalid format";
      }

      if (rule.validate && value) {
        const error = rule.validate(value);
        if (error) return error;
      }

      return "";
    },
    [validationRules],
  );

  // Validate all fields
  const validateForm = useCallback(() => {
    const newErrors = {};
    let formIsValid = true;

    Object.keys(defaultValues).forEach((fieldName) => {
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        formIsValid = false;
      }
    });

    setErrors(newErrors);
    setIsValid(formIsValid);
    return formIsValid;
  }, [values, defaultValues, validateField]);

  // Handle change event
  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
    setIsValid(!fieldError && Object.values(errors).every((err) => !err));
  };

  // Handle blur event for validation
  const handleBlur = (event) => {
    const { name } = event.target;
    const error = validateField(name, values[name]);

    if (error) {
      setErrors({ ...errors, [name]: error });
      setIsValid(false);
    } else {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Reset form values and errors
  const resetForm = useCallback(() => {
    setValues(defaultValues);
    setErrors({});
    setIsValid(true);
  }, [defaultValues]);

  return {
    values,
    setValues,
    errors,
    setErrors,
    isValid,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
  };
}
