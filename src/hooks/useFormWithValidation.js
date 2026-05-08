import { useState, useCallback, useMemo } from "react";

export function useFormWithValidation(defaultValues, validationRules = {}) {
  const [values, setValues] = useState(defaultValues);

  // Initialize errors based on default values
  const initialErrors = useMemo(() => {
    const newErrors = {};

    Object.keys(defaultValues).forEach((fieldName) => {
      const rule = validationRules[fieldName];
      if (!rule) return;

      if (typeof rule === "function") {
        const result = rule(defaultValues[fieldName]);
        if (result) {
          newErrors[fieldName] = result;
        }
      } else if (
        rule.required &&
        (!defaultValues[fieldName] || defaultValues[fieldName].trim() === "")
      ) {
        newErrors[fieldName] = rule.requiredMessage || "This field is required";
      } else if (
        rule.pattern &&
        defaultValues[fieldName] &&
        !rule.pattern.test(defaultValues[fieldName])
      ) {
        newErrors[fieldName] = rule.patternMessage || "Invalid format";
      } else if (rule.validate && defaultValues[fieldName]) {
        const error = rule.validate(defaultValues[fieldName]);
        if (error) {
          newErrors[fieldName] = error;
        }
      }
    });

    return newErrors;
  }, [defaultValues, validationRules]);

  const [errors, setErrors] = useState(initialErrors);

  // Initialize isValid based on errors
  const initialIsValid = useMemo(() => {
    return Object.values(initialErrors).every((err) => !err);
  }, [initialErrors]);

  const [isValid, setIsValid] = useState(initialIsValid);

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
    const newErrors = { ...errors, [name]: fieldError };
    setErrors(newErrors);
    setIsValid(!fieldError && Object.values(newErrors).every((err) => !err));
  };

  // Handle blur event for validation
  const handleBlur = (event) => {
    const { name } = event.target;
    const error = validateField(name, values[name]);
    const newErrors = { ...errors, [name]: error };

    setErrors(newErrors);
    setIsValid(Object.values(newErrors).every((err) => !err));
  };

  // Reset form values and errors
  const resetForm = useCallback(() => {
    setValues(defaultValues);

    // Reinitialize errors for default values
    const newErrors = {};
    let formIsValid = true;

    Object.keys(defaultValues).forEach((fieldName) => {
      const error = validateField(fieldName, defaultValues[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        formIsValid = false;
      }
    });

    setErrors(newErrors);
    setIsValid(formIsValid);
  }, [defaultValues, validateField]);

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
