import React, { useState } from "react";
import "./style.css";
import { DownArrowIcon } from "../icons";

const FormCustomDropdown = ({
  options,
  label,
  onSelect,
  name,
  title,
  lableClass,
  containerClass,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState({
    label: "",
    value: "",
  });

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    onSelect({ name, value: option?.value });
  };

  const findLable = () => {
    return options.find(
      (option) => option.value === (label?.value ? label?.value : label)
    );
  };

  return (
    <div
      className={`FormDropdown-container ${
        containerClass ? containerClass : ""
      }`}
    >
      {title && (
        <label className={`FormDropdown-title ${lableClass ? lableClass : ""}`}>
          {title}
        </label>
      )}
      <div className="FormDropdown" onClick={handleToggle}>
        <div className={`FormDropdown-selected ${isOpen ? "open" : ""}`}>
          {findLable()
            ? findLable()?.label
            : selectedOption?.label ?? "Select an option"}
          <DownArrowIcon />
        </div>
        <div className={`FormDropdown-menu ${isOpen ? "open" : ""}`}>
          {options &&
            options?.map((option, index) => (
              <div
                key={index}
                className="FormDropdown-item"
                style={{
                  borderBottom:
                    index !== options.length - 1 && "1px solid #f8f8f8",
                }}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default FormCustomDropdown;
