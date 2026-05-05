import React, { useState, useEffect } from "react";
import { Select, Input } from "antd";

/**
 * CustomCreatableSelect: A reusable select that allows searching and creating new options on the fly.
 * If the value is not found in options, it acts as a text input (always, not just on focus).
 */
const CustomCreatableSelect = ({ options = [], value, onChange, placeholder, style, ...rest }) => {
  const [inputValue, setInputValue] = useState("");
  const [internalOptions, setInternalOptions] = useState(options);

  // Update internal options if props.options changes
  useEffect(() => {
    setInternalOptions(options);
  }, [options]);

  // Helper: is value in options?
  const isValueInOptions = (val) =>
    !!internalOptions.find(opt => (opt.value ?? opt).toString().toLowerCase() === (val ?? '').toString().toLowerCase());

  // If value is not in options and not empty, always show Input
  if (value && !isValueInOptions(value)) {
    return (
      <Input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={style}
        {...rest}
      />
    );
  }

  return (
    <Select
      showSearch
      value={value}
      placeholder={placeholder}
      style={style}
      filterOption={(input, option) =>
        (option?.label ?? option?.value ?? "").toString().toLowerCase().includes(input.toLowerCase())
      }
      onSearch={setInputValue}
      onChange={onChange}
      options={internalOptions}
      // Remove notFoundContent
      {...rest}
    />
  );
};

export default CustomCreatableSelect; 