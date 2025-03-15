import React, { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import CustomTextField, { CustomTextFieldProps } from "./TextField";
export type SelectFieldProps = {
  options: { value: string; label: string }[];
  value?: string;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
} & Omit<CustomTextFieldProps, "value" | "onChange">;

const SelectField: React.FC<SelectFieldProps> = ({
  options,
  value,
  defaultValue,
  onChange,
  ...textFieldProps
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue || "");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event);
    }
    if (value === undefined) {
      setInternalValue(event.target.value);
    }
  };

  const selectedValue = value !== undefined ? value : internalValue;

  return (
    <CustomTextField
      select
      variant="outlined"
      value={selectedValue}
      onChange={handleChange}
      {...textFieldProps}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </CustomTextField>
  );
};

export default SelectField;
