export const formatBookingStatus = (status) => {
  if (!status) return "—";

  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
};