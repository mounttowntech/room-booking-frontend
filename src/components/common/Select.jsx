const Select = ({
  label,
  name,
  // value,
  // onChange,
  placeholder = "",
  register,
  errors,
  required = false,
  options
}) => {
  return (
    <div className="input-group">
      {label && (
        <label htmlFor={name}>
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}

      <select
        id={name}
        // name={name}
        // value={value}
        // onChange={onChange}
        placeholder={placeholder}
        {...register(name)}
      >
        <option value="">
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {errors && errors[name] && (
        <p className="error-message">
          {errors[name].message}
        </p>
      )}

    </div>
  );
};

export default Select;