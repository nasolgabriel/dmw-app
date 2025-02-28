import * as yup from "yup";

export const loginSchema = yup.object({
  username: yup.string().required("Username "),
  password: yup.string().required("Password is required."),
  rememberMe: yup.boolean().optional(),
});

export type LoginSchemaType = yup.InferType<typeof loginSchema>;
