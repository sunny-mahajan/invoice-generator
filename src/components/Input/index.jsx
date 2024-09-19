import "./style.css";
const CustomInput = ({
  type,
  name,
  placeholder,
  value,
  onChange,
  title,
  inputClass,
  inputStyle,
  containerStyle,
  titleStyle,
  lableClass,
  containerClass,
  isText = false,
}) => {
  return (
    <div
      className={`input-container ${containerClass ? containerClass : ""}`}
      style={containerStyle}
    >
      {title && (
        <label
          className={`input-title ${lableClass ? lableClass : ""}`}
          style={titleStyle}
        >
          {title}
        </label>
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
        />
      ) : (
        <div className="input-field-text">{value}</div>
      )}
    </div>
  );
};

export default CustomInput;
