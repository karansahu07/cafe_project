import React from "react";
import { AutoComplete, Input } from "antd";

/**
 * AutoCompleteInput: Always an input, shows suggestions as you type, but allows any value.
 * Updates value on every keystroke (onInput), not just on select.
 */
const AutoCompleteInput = ({ options = [], value, onChange, placeholder, style, ...rest }) => {
  return (
    <AutoComplete
      options={options}
      value={value}
      onChange={onChange}
      style={style}
      filterOption={(inputValue, option) =>
        (option?.label ?? option?.value ?? "").toString().toLowerCase().includes(inputValue.toLowerCase())
      }
    >
      <Input
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        {...rest}
      />
    </AutoComplete>
  );
};

export default AutoCompleteInput; 