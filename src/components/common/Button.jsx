const Button = ({
  children,
  type = "button",
  loading = false,
  disabled = false,
  onClick,
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className="primary-btn"
    >
      {loading ? "Signing in..." : children}
    </button>
  );
};

export default Button;