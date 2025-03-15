import React, { useState, useEffect, useRef } from "react";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import CustomTextField, { CustomTextFieldProps } from "./TextField";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import CancelIcon from "@mui/icons-material/Cancel";
import { InputBaseComponentProps } from "@mui/material/InputBase";

export type OptionType = {
  value: string;
  label: string;
};

export type MultiSelectFieldProps = {
  options: OptionType[];
  value?: OptionType[];
  defaultValue?: OptionType[];
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, value: OptionType[]) => void;
  renderValue?: (selected: unknown) => React.ReactNode;
  displayEmpty?: boolean;
  placeholder?: string;
} & Omit<CustomTextFieldProps, "value" | "onChange" | "select" | "SelectProps">;

const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  options,
  value,
  defaultValue = [],
  onChange,
  renderValue,
  displayEmpty = false,
  placeholder = "",
  sx,
  inputProps: externalInputProps,
  ...textFieldProps
}) => {
  const [internalValue, setInternalValue] = useState<OptionType[]>(defaultValue || []);
  const [searchText, setSearchText] = useState<string>("");
  const [filteredOptions, setFilteredOptions] = useState<OptionType[]>(options);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchText) {
      const filtered = options.filter(option => 
        option.label.toLowerCase().includes(searchText.toLowerCase()) ||
        option.value.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [searchText, options]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValues = event.target.value as unknown as string[];
    
    const selectedOptions = selectedValues.map(
      (val) => options.find((opt) => opt.value === val) || { value: val, label: val }
    );
    
    if (onChange) {
      onChange(event, selectedOptions);
    }
    
    if (value === undefined) {
      setInternalValue(selectedOptions);
    }

    setSearchText("");
  };

  const selectedOptions = value !== undefined ? value : internalValue;
  const stringValues = selectedOptions.map(option => option.value);

  const handleDelete = (optionToDelete: OptionType, event: React.MouseEvent) => {
    event.stopPropagation();
    
    const newSelectedOptions = selectedOptions.filter(
      option => option.value !== optionToDelete.value
    );
    
    if (onChange) {
      onChange(event as unknown as React.ChangeEvent<HTMLInputElement>, newSelectedOptions);
    }
    
    if (value === undefined) {
      setInternalValue(newSelectedOptions);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && selectedOptions.length > 0 && !searchText) {
      const newSelectedOptions = [...selectedOptions];
      const removedOption = newSelectedOptions.pop();
      
      if (removedOption && onChange) {
        onChange(event as unknown as React.ChangeEvent<HTMLInputElement>, newSelectedOptions);
      }
      
      if (value === undefined && removedOption) {
        setInternalValue(newSelectedOptions);
      }
    } else if (event.key === 'Escape') {
      setSearchText("");
    } else if (!/^Arrow/.test(event.key) && !event.ctrlKey && !event.metaKey && event.key !== 'Enter') {
      setSearchText(prev => {
        if (event.key === 'Backspace') {
          return prev.slice(0, -1);
        } else if (event.key.length === 1) {
          return prev + event.key;
        }
        return prev;
      });
    }
  };

  const defaultRenderValue = (selected: unknown) => {
    if (Array.isArray(selected) && selected.length === 0 && placeholder) {
      return <em>{placeholder}</em>;
    }
    
    return (
      <Box sx={{ display: 'flex', flexWrap: 'nowrap', overflow: 'hidden', width: '100%' }}>
        {selectedOptions.length > 0 && (
          <div style={{ 
            whiteSpace: 'nowrap', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            {selectedOptions.map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                size="small"
                onDelete={(e) => handleDelete(option, e)}
                deleteIcon={
                  <CancelIcon 
                    onMouseDown={(e) => e.stopPropagation()} 
                    style={{ fontSize: '16px' }}
                  />
                }
                sx={{ 
                  maxWidth: '100%',
                  height: '24px',
                  margin: '2px 0',
                  '.MuiChip-label': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }
                }}
              />
            ))}
            {searchText && (
              <div style={{ position: 'absolute', left: '-9999px' }}>{searchText}</div>
            )}
          </div>
        )}
        {selectedOptions.length === 0 && searchText && <div>{searchText}</div>}
      </Box>
    );
  };

  const customInputProps: InputBaseComponentProps = {
    ...(externalInputProps || {}),
    onKeyDown: handleKeyDown,
    ref: inputRef,
    style: { 
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      ...(externalInputProps?.style || {})
    }
  };

  const baseStyles = {
    '& .MuiOutlinedInput-root': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    '& .MuiSelect-select': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  };

  const mergedSx = typeof sx === 'object' ? { ...baseStyles, ...sx } : sx;

  return (
    <CustomTextField
      select
      variant="outlined"
      value={stringValues}
      onChange={handleChange}
      SelectProps={{
        multiple: true,
        displayEmpty: displayEmpty,
        renderValue: renderValue || defaultRenderValue,
        MenuProps: {
          PaperProps: { style: { maxHeight: 224, width: 'auto' } },
          autoFocus: false,
        },
      }}
      sx={mergedSx}
      inputProps={customInputProps}
      {...textFieldProps}
    >
      {displayEmpty && placeholder && !searchText && (
        <MenuItem disabled value=""><em>{placeholder}</em></MenuItem>
      )}
      {searchText && filteredOptions.length === 0 && (
        <MenuItem disabled><em>No options match '{searchText}'</em></MenuItem>
      )}
      {(searchText ? filteredOptions : options).map((option) => (
        <MenuItem 
          key={option.value} 
          value={option.value}
          style={{ fontWeight: stringValues.includes(option.value) ? 'bold' : 'normal' }}
        >
          <ListItemText 
            primary={option.label}
            primaryTypographyProps={{
              style: { fontWeight: stringValues.includes(option.value) ? 'bold' : 'normal' }
            }}
          />
        </MenuItem>
      ))}
    </CustomTextField>
  );
};

export default MultiSelectField;
