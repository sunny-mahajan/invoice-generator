import "./style.css";
const CustomInput = ({
  type,
  name,
  placeholder,
  value,
  onChange,
  onKeyDown,
  title,
  inputClass,
  inputStyle,
  containerStyle,
  titleStyle,
  lableClass,
  containerClass,
  isText = false,
  required = false,
}) => {
  return (
    <div
      className={`input-container ${containerClass ? containerClass : ""}`}
      style={containerStyle}
    >
      {title && (
        <div className="invoice-title-container">
          <label
            className={`input-title ${lableClass ? lableClass : ""}`}
            style={titleStyle}
          >
            {title}
          </label>
          {required && <span className="text-red-700">*</span>}
        </div>
      )}
      {!isText ? (
        <input
          type={type}
          name={name}
          style={inputStyle}
          placeholder={placeholder}
          value={value}
          className={`input-field ${inputClass ? inputClass : ""}`}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
      ) : (
        <div className="input-field-text">{value}</div>
      )}
    </div>
  );
};

export default CustomInput;
