import * as yup from "yup";

// Regex patterns
const phoneRegex = /^(\+?\d{1,3}|0)[\s-]?\d{9,10}$/;
const passportRegex = /^(?!0+$)[A-Za-z0-9]{3,20}$/;

export const clientInfoSchema = yup.object().shape({
  transactionType: yup
    .array()
    .of(yup.string())
    .min(1, "At least one transaction type is required")
    .required("Transaction type is required"),
  firstName: yup
    .string()
    .required("First name is required")
    .max(50, "First name is too long"),
  middleName: yup.string().max(50, "Middle name is too long"),
  surname: yup
    .string()
    .required("Surname is required")
    .max(50, "Surname is too long"),
  suffix: yup.string(),
  birthdate: yup
    .date()
    .required("Birthdate is required")
    .max(new Date(), "Birthdate cannot be in the future")
    .test("is-adult", "Client must be at least 18 years old", function (value) {
      if (!value) return true; // Skip validation if no date
      const today = new Date();
      const birthDate = new Date(value);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      // Accept underage clients but provide validation info
      return true;
    }),
  sex: yup.string().required("Sex is required"),

  // Contact Information
  passportNumber: yup
    .string()
    .required("Passport number is required")
    .matches(passportRegex, "Passport number format is invalid"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(
      phoneRegex,
      "Phone number is invalid (e.g., +1234567890 or 0123456789)"
    ),
  address: yup
    .string()
    .required("Address is required")
    .min(10, "Address is too short")
    .max(200, "Address is too long"),

  priority: yup.boolean().default(false),
  withAppointment: yup.boolean().default(false),
});

export type ClientInfoFormData = yup.InferType<typeof clientInfoSchema>;
