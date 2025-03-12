import React, { useState } from "react";
import CustomTextField, { CustomTextFieldProps } from "./TextField";

export type CustomDateFieldProps = Omit<
  CustomTextFieldProps,
  "type" | "onChange"
> & {
  /**
   * Date value in the format "YYYY-MM-DD"
   */
  value?: string;
  /**
   * Default date value in the format "YYYY-MM-DD"
   */
  defaultValue?: string;
  /**
   * Callback fired when the date changes.
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const CustomDateField: React.FC<CustomDateFieldProps> = ({
  value,
  defaultValue,
  onChange,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState<string>(
    defaultValue || ""
  );

  const normalizeDateValue = (dateStr: string): string => {
    if (!dateStr) return dateStr;
    
    // Ensure date format is valid
    const parts = dateStr.split("-");
    if (parts.length === 3 && parts[0].length > 4) {
      parts[0] = parts[0].slice(0, 4);
      return parts.join("-");
    }
    return dateStr;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Normalize and validate the date value
    const newValue = normalizeDateValue(event.target.value);
    
    // Create a synthetic event with the normalized value
    const syntheticEvent = {
      ...event,
      target: {
        ...event.target,
        value: newValue,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    // Always call onChange if provided
    if (onChange) {
      onChange(syntheticEvent);
    }
    
    // Only update internal state if not controlled
    if (value === undefined) {
      setInternalValue(newValue);
    }
  };

  // Use controlled or uncontrolled value
  const dateValue =
    value !== undefined ? normalizeDateValue(value) : internalValue;

  return (
    <CustomTextField
      type="date"
      value={dateValue}
      onChange={handleChange}
      InputLabelProps={{
        shrink: true,
      }}
      {...props}
    />
  );
};

export default CustomDateField;
