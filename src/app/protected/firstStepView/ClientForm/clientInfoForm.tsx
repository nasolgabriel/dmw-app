import CustomDateField from "@/components/textfields/DateField";
import SelectField from "@/components/textfields/SelectField";
import CustomTextField from "@/components/textfields/TextField";
import {
  Button,
  Container,
  Typography,
  Checkbox,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";
import {
  SEX_OPTIONS,
  TRANSACTION_OPTIONS,
  SUFFIX_OPTIONS,
} from "./transactions";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";
import { ClientInfoFormData } from "../validation";
import React from "react";

interface ClientInfoFormProps {
  control: Control<ClientInfoFormData>;
  handleSubmit: UseFormHandleSubmit<ClientInfoFormData>;
  errors: FieldErrors<ClientInfoFormData>;
  onSubmit: (data: ClientInfoFormData) => void;
  age: number | null;
  setAge: React.Dispatch<React.SetStateAction<number | null>>;
}

/**
 * Reusable form field styles
 */
const getFieldStyles = () => {
  const normalBorderColor = "#0038A8";
  const focusedBorderColor = "#002d8a";
  const borderThickness = "2px";

  return {
    fieldStyle: {
      "& .MuiOutlinedInput-root": {
        backgroundColor: "white",
        height: {
          md: "2rem",
          xl: "2.5rem",
        },
        "& fieldset": {
          borderWidth: borderThickness,
          borderColor: normalBorderColor,
        },
        "&:hover fieldset": {
          borderWidth: borderThickness,
        },
        "&.Mui-focused fieldset": {
          borderWidth: borderThickness,
          borderColor: focusedBorderColor,
        },
        "& .MuiInputBase-input": {
          fontSize: {
            md: "0.85rem",
            xl: "1rem",
          },
          fontWeight: 550,
        },
      },
      "& input": {
        textTransform: "uppercase",
        fontWeight: 550,
      },
      "& .MuiSelect-select": {
        fontSize: {
          md: "0.85rem",
          xl: "1rem",
        },
        fontWeight: 550,
      },
      "& .MuiFormLabel-root": {
        fontSize: {
          md: "0.85rem",
          xl: "1rem",
        },
        fontWeight: 550,
      },
    },
    normalBorderColor,
  };
};

const ClientInfoForm: React.FC<ClientInfoFormProps> = ({
  control,
  handleSubmit,
  errors,
  onSubmit,
  age,
  setAge,
}) => {
  const { fieldStyle, normalBorderColor } = getFieldStyles();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-[80%] bg-[#e9e9e9] my-5 mr-10 rounded-3xl flex flex-col md:w-[90%] lg:px-10"
    >
      <Typography
        variant="h1"
        sx={{
          fontWeight: "bold",
          fontSize: {
            md: "1rem",
            lg: "2rem",
            xl: "2.5rem",
          },
          paddingTop: "2rem",
          paddingLeft: "2rem",
        }}
      >
        CLIENT INFORMATION FORM
      </Typography>

      {/* Personal Information Section */}
      <Container className="flex flex-col gap-2 pt-3">
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            fontSize: {
              md: "0.8rem",
              lg: "1rem",
              xl: "1.5rem",
            },
            paddingTop: ".5rem",
          }}
        >
          Personal Information
        </Typography>
        <div className="flex flex-col gap-2 px-12">
          {/* Transaction Type */}
          <Controller
            name="transactionType"
            control={control}
            render={({ field }) => (
              <>
                <SelectField
                  name={field.name}
                  ref={field.ref}
                  onBlur={field.onBlur}
                  value={Array.isArray(field.value) && field.value.length > 0 ? field.value[0] : ""}
                  placeholder="TRANSACTION TYPE"
                  options={TRANSACTION_OPTIONS}
                  outlinedColor={normalBorderColor}
                  label="TRANSACTION TYPE"
                  sx={fieldStyle}
                  error={!!errors.transactionType}
                  onChange={(e) => {
                    // Convert the string value to an array with a single item
                    const value = e.target.value;
                    field.onChange(value ? [value] : []);
                  }}
                />
                {errors.transactionType && (
                  <FormHelperText error>
                    {errors.transactionType.message}
                  </FormHelperText>
                )}
              </>
            )}
          />

          {/* Name Fields */}
          <div className="flex w-full justify-between gap-4 items-center">
            <div className="flex-1">
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    placeholder="FIRSTNAME"
                    outlinedColor={normalBorderColor}
                    sx={fieldStyle}
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                )}
              />
            </div>
            <div className="flex-1">
              <Controller
                name="middleName"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    placeholder="MIDDLENAME"
                    outlinedColor={normalBorderColor}
                    sx={fieldStyle}
                    error={!!errors.middleName}
                    helperText={errors.middleName?.message}
                  />
                )}
              />
            </div>
            <div className="flex-1">
              <Controller
                name="surname"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    placeholder="SURNAME"
                    outlinedColor={normalBorderColor}
                    sx={fieldStyle}
                    error={!!errors.surname}
                    helperText={errors.surname?.message}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                name="suffix"
                control={control}
                render={({ field }) => (
                  <SelectField
                    {...field}
                    placeholder="SUFFIX"
                    options={SUFFIX_OPTIONS}
                    outlinedColor={normalBorderColor}
                    sx={{
                      ...fieldStyle,
                      "& .MuiFormLabel-root": {
                        fontSize: {
                          md: "0.5rem",
                          xl: "0.5rem",
                        },
                        fontWeight: 550,
                      },
                      paddingBottom: "0.8rem",
                    }}
                    error={!!errors.suffix}
                    helperText={errors.suffix?.message}
                    label="SUFFIX"
                  />
                )}
              />
            </div>
          </div>

          {/* Birthdate and Age */}
          <div className="flex flex-row items-center">
            <Controller
              name="birthdate"
              control={control}
              render={({ field: { onChange, value, ...restField } }) => (
                <div className="flex-1">
                  <CustomDateField
                    {...restField}
                    value={
                      value ? new Date(value).toISOString().split("T")[0] : ""
                    }
                    className="w-full"
                    placeholder="BIRTHDATE"
                    outlinedColor={normalBorderColor}
                    sx={fieldStyle}
                    error={!!errors.birthdate}
                    helperText={errors.birthdate?.message}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const dateStr = e.target.value;
                      if (dateStr) {
                        try {
                          const dateObj = new Date(dateStr);
                          if (!isNaN(dateObj.getTime())) {
                            onChange(dateObj);
                          }
                        } catch (error) {
                          console.error("Error parsing date:", error);
                        }
                      } else {
                        onChange(null);
                      }
                    }}
                  />
                </div>
              )}
            />
            <Typography
              variant="body1"
              sx={{
                fontWeight: "bold",
                paddingLeft: "2rem",
                paddingRight: "1rem",
              }}
            >
              Age:
            </Typography>
            <CustomTextField
              className="w-1/12"
              outlinedColor={normalBorderColor}
              value={age !== null ? age.toString() : ""}
              readOnly={true}
              sx={{
                width: "60px",
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  height: {
                    md: "2rem",
                    xl: "2.5rem",
                  },
                  "& fieldset": {
                    borderWidth: 0,
                  },
                  "& .MuiInputBase-input": {
                    fontSize: {
                      md: "1rem",
                      xl: "1rem",
                    },
                    color: "black",
                    fontWeight: "bold",
                    textAlign: "center",
                  },
                },
                "& input": {
                  textTransform: "uppercase",
                },
              }}
            />
          </div>

          {/* Sex Field */}
          <Controller
            name="sex"
            control={control}
            render={({ field }) => (
              <>
                <SelectField
                  {...field}
                  placeholder="SEX"
                  options={SEX_OPTIONS}
                  outlinedColor={normalBorderColor}
                  label="SEX"
                  className="w-1/3"
                  sx={fieldStyle}
                  error={!!errors.sex}
                />
                {errors.sex && (
                  <FormHelperText error>{errors.sex.message}</FormHelperText>
                )}
              </>
            )}
          />
        </div>
      </Container>

      {/* Contact Information Section */}
      <Container className="flex flex-col gap-2">
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            fontSize: {
              md: "0.8rem",
              lg: "1rem",
              xl: "1.5rem",
            },
            paddingTop: "1rem",
          }}
        >
          Contact Information
        </Typography>
        <div className="flex flex-col gap-2 px-12">
          <Controller
            name="passportNumber"
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                placeholder="PASSPORT NUMBER"
                outlinedColor={normalBorderColor}
                sx={fieldStyle}
                error={!!errors.passportNumber}
                helperText={errors.passportNumber?.message}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                placeholder="EMAIL"
                outlinedColor={normalBorderColor}
                sx={{
                  ...fieldStyle,
                  "& input": {
                    textTransform: "none",
                    fontWeight: 550,
                  },
                }}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />

          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                placeholder="PHONE NUMBER"
                outlinedColor={normalBorderColor}
                sx={fieldStyle}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
              />
            )}
          />

          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                placeholder="ADDRESS"
                outlinedColor={normalBorderColor}
                sx={fieldStyle}
                error={!!errors.address}
                helperText={errors.address?.message}
              />
            )}
          />
        </div>
      </Container>

      {/* Additional Information Section */}
      <Container className="flex flex-col gap-2 items-start pt-8 pl-12">
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            fontSize: {
              xs: "1rem",
              sm: "1.1rem",
              md: "1.15rem",
              lg: "1.18rem",
              xl: "1.2rem",
            },
            marginBottom: "0.5rem",
          }}
        >
          Additional Information
        </Typography>

        <div className="flex flex-col ml-4">
          {/* Checkbox for Priority */}
          <Controller
            name="priority"
            control={control}
            render={({ field: { value, onChange, ...field } }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                    {...field}
                  />
                }
                label={
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: "medium",
                      fontSize: {
                        xs: "0.85rem",
                        sm: "0.9rem",
                        md: "0.95rem",
                        lg: "1rem",
                        xl: "1.2rem",
                      },
                    }}
                  >
                    Priority (Appointment , PWD, Senior Citizen)
                  </Typography>
                }
              />
            )}
          />
        </div>
      </Container>

      {/* Submit Button */}
      <div className="flex flex-col justify-end items-end pr-20 md:pb-5 pb-28">
        <Button
          variant="contained"
          color="success"
          type="submit"
          sx={{
            fontSize: { md: "1rem", xl: "1.3rem" },
            fontWeight: "bold",
            padding: { md: ".5rem 1.5rem", xl: ".5rem 2rem" },
          }}
        >
          SUBMIT
        </Button>
      </div>
    </form>
  );
};

export default ClientInfoForm;
