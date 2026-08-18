import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import { logout } from "../../redux/slices/authSlice";

const Header = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { user } = useSelector(
    (state) => state.auth
  );

  const handleLogout = () => {
    dispatch(logout());

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <header className="header">

      <div>
        <h2>Hotel PMS</h2>
      </div>

      <div className="header-right">

        <span>
          {user?.name || "Admin"}
        </span>

        <button
          onClick={handleLogout}
          className="logout-btn"
        >
          Logout
        </button>

      </div>

    </header>
  );
};

export default Header;