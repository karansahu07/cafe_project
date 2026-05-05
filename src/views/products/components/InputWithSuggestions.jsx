import React, { useState, useRef, useEffect } from "react";
import { Input } from "antd";

/**
 * InputWithSuggestions: Always an input, shows suggestions as you type, but allows any value.
 * Props:
 *  - options: [{label, value}] array
 *  - value: current value
 *  - onChange: function(newValue)
 *  - placeholder: string
 *  - style: object
 *  - ...rest: other Input props
 */
const InputWithSuggestions = ({ options = [], value, onChange, placeholder, style, ...rest }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");
  const [hoveredIdx, setHoveredIdx] = useState(-1);
  const inputRef = useRef(null);

  // Keep inputValue in sync with parent value
  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  // Filtered suggestions
  const filteredOptions = options?.filter(opt =>
    (opt.label ?? opt.value ?? "").toString().toLowerCase().includes(inputValue.toLowerCase())
  );

  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    onChange(e.target.value);
    setShowDropdown(true);
  };

  // Handle suggestion click
  const handleSuggestionClick = (val) => {
    setInputValue(val);
    onChange(val);
    setShowDropdown(false);
    // Focus back to input
    if (inputRef.current) inputRef.current.focus();
  };

  // Hide dropdown on blur (with delay for click)
  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 150);
  };

  // Show dropdown on focus if there are suggestions
  const handleFocus = () => {
    if (filteredOptions.length > 0) setShowDropdown(true);
  };

  return (
    <div style={{ position: "relative", width: style?.width || "100%" }}>
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholder}
        style={style}
        autoComplete="off"
        {...rest}
      />
      {showDropdown && filteredOptions.length > 0 && (
        <div
          className="ant-select-dropdown"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 1000,
            background: "#fff",
            borderRadius: 4,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            marginTop: 2,
            padding: 0,
            maxHeight: 100,
            overflowY: "auto",
          }}
        >
          {filteredOptions.map((opt, idx) => (
            <div
              key={opt.value}
              className={`ant-select-item ant-select-item-option${hoveredIdx === idx ? " ant-select-item-option-active" : ""}`}
              style={{ padding: "2px 12px", cursor: "pointer" }}
              onMouseDown={() => handleSuggestionClick(opt.value)}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(-1)}
            >
              {opt.label ?? opt.value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InputWithSuggestions; 