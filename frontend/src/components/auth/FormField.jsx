import {
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const FormField = ({
  icon: Icon,

  type = "text",

  name,
  value,

  onChange,

  placeholder,

  options = [],

  showPassword = false,

  onTogglePassword,

  required = false,

  disabled = false,

  autoComplete,

  ...props
}) => {
  /* ==========================
      SELECT FIELD
  ========================== */

  if (type === "select") {
    return (
      <div className="input-group">
        {Icon && (
          <Icon className="input-icon" />
        )}

        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          {...props}
        >
          {options.map((option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }

  /* ==========================
      PASSWORD FIELD
  ========================== */

  if (type === "password") {
    return (
      <div className="input-group password-group">
        {Icon && (
          <Icon className="input-icon" />
        )}

        <input
          type={
            showPassword
              ? "text"
              : "password"
          }
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          {...props}
        />

        <button
          type="button"
          className="password-toggle"
          onClick={onTogglePassword}
        >
          {showPassword ? (
            <FaEyeSlash />
          ) : (
            <FaEye />
          )}
        </button>
      </div>
    );
  }

  /* ==========================
      TEXT / EMAIL FIELD
  ========================== */

  return (
    <div className="input-group">
      {Icon && (
        <Icon className="input-icon" />
      )}

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        {...props}
      />
    </div>
  );
};

export default FormField;