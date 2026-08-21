const roomSchema = yup.object().shape({
  roomNumber: yup.string().required("Room number is required"),
  roomType: yup.string().required("Room type is required"),
  floor: yup.string().required("Floor is required"),
  capacity: yup.number().min(1).required("Capacity is required"),
  pricePerNight: yup.number().min(0).required("Price per night is required"),
  status: yup.string().required("Status is required"),
});