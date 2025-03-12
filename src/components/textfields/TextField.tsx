import React, { useState } from "react";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { styled } from "@mui/material/styles";

export type CustomTextFieldProps = TextFieldProps & {
  outlinedColor?: string;
  filledColor?: string;
  endAdornment?: React.ReactNode;
  readOnly?: boolean;
};

const StyledTextField = styled(TextField, {
  shouldForwardProp: (prop) =>
    prop !== "outlinedColor" && prop !== "filledColor" && prop !== "readOnly",
})<CustomTextFieldProps>(({ theme, outlinedColor, filledColor, error }) => ({
  "& .MuiInputLabel-root": {
    position: "static",
    transform: "none",
    color: error ? theme.palette.error.main : undefined,
  },
  // Outlined variant styling: apply filledColor as background along with custom border colors
  "& .MuiOutlinedInput-root": {
    backgroundColor: filledColor || undefined,
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: error
        ? theme.palette.error.main
        : outlinedColor || theme.palette.grey[400],
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: error
        ? theme.palette.error.main
        : outlinedColor || theme.palette.text.primary,
    },
    "& .MuiFormHelperText-root": {
      minHeight: "1rem",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: error
        ? theme.palette.error.main
        : outlinedColor || theme.palette.primary.main,
    },
    
  },
  // Filled variant styling
  "& .MuiFilledInput-root": {
    backgroundColor: filledColor || theme.palette.background.paper,
  },
}));

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  outlinedColor,
  filledColor,
  helperText,
  error,
  variant = "outlined",
  value,
  defaultValue,
  onChange,
  endAdornment,
  InputProps,
  readOnly,
  ...props
}) => {
  // For uncontrolled usage, manage internal state
  const [internalValue, setInternalValue] = useState(defaultValue || "");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange && !readOnly) {
      onChange(event);
    }
    // Only update internal state if not controlled and not readOnly
    if (value === undefined && !readOnly) {
      setInternalValue(event.target.value);
    }
  };

  const inputValue = value !== undefined ? value : internalValue;

  // Merge any provided InputProps with the custom endAdornment and readOnly
  const combinedInputProps = {
    ...InputProps,
    endAdornment: endAdornment || InputProps?.endAdornment,
    readOnly: readOnly,
  };

  return (
    <StyledTextField
      variant={variant}
      outlinedColor={outlinedColor}
      filledColor={filledColor}
      error={error}
      helperText={helperText}
      value={inputValue}
      onChange={handleChange}
      InputProps={combinedInputProps}
      {...props}
    />
  );
};

export default CustomTextField;
