import React, { useRef, useState } from "react";
import "./style.css";
import { DownArrowIcon } from "../../utils/icons";
import useClickOutside from "../../hooks/useClickOutside";

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
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const dropDownRef = useRef();
  const searchInputRef = useRef();
  const [selectedOption, setSelectedOption] = useState({
    label: "",
    value: "",
  });

  useClickOutside([dropDownRef], () => setIsOpen(false));

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    onSelect({ name, value: option?.label, isoCode: option?.isoCode });
  };

  const findLabel = () => {
    return options?.find(
      (option) => option.value === (label?.value ? label?.value : label)
    );
  };

  // Filter options based on search query
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`FormDropdown-container ${
        containerClass ? containerClass : ""
      }`}
      ref={dropDownRef}
    >
      {title && (
        <div className="invoice-title-container">
          <label
            className={`FormDropdown-title ${lableClass ? lableClass : ""}`}
          >
            {title}
          </label>
        </div>
      )}
      <div className="FormDropdown" onClick={handleToggle}>
        <div className={`FormDropdown-selected ${isOpen ? "open" : ""}`}>
          {findLabel()
            ? findLabel()?.label
            : selectedOption?.label || "Select an option"}
          <DownArrowIcon />
        </div>
        {isOpen && (
          <div className={`FormDropdown-menu ${isOpen ? "open" : ""}`}>
            {/* Search Input */}
            <div
              className="FormDropdown-search"
              onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing
            >
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                className="FormDropdown-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* Options List */}
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={index}
                  className="FormDropdown-item"
                  style={{
                    borderBottom:
                      index !== filteredOptions?.length - 1 &&
                      "1px solid var(--color)",
                  }}
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="FormDropdown-no-options">No options found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormCustomDropdown;
