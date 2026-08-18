export const getToken = () => {
  return localStorage.getItem("hotel_token");
};

export const getUser = () => {
  const user = localStorage.getItem("hotel_user");

  try {
    return user ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
};

export const isAuthenticated = () => {
  return Boolean(getToken());
};

export const clearAuth = () => {
  localStorage.removeItem("hotel_token");
  localStorage.removeItem("hotel_user");
};