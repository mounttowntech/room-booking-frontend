import React, { useEffect, useState } from "react";
// import "./RoomForm.css";

const roomTypes = [
  { value: "single", label: "Single" },
  { value: "double", label: "Double" },
  { value: "twin", label: "Twin" },
  { value: "deluxe", label: "Deluxe" },
  { value: "suite", label: "Suite" },
  { value: "family", label: "Family" },
];

const roomStatuses = [
  { value: "available", label: "Available" },
  { value: "reserved", label: "Reserved" },
  { value: "occupied", label: "Occupied" },
  { value: "maintenance", label: "Maintenance" },
  { value: "cleaning", label: "Cleaning" },
  { value: "blocked", label: "Blocked" },
];

const defaultFormData = {
  roomNumber: "",
  roomType: "single",
  floor: "",
  capacity: 2,
  pricePerNight: "",
  amenities: [],
  status: "available",
  description: "",
  isActive: true,
};

const RoomForm = ({ room, onSubmit, onClose, loading = false }) => {
    console.log("RoomForm props:", { room, onSubmit, onClose, loading });
  const [formData, setFormData] = useState(defaultFormData);
  const [amenityInput, setAmenityInput] = useState("");

  // ============================================================
  // EDIT DATA
  // ============================================================

  useEffect(() => {
    console.log("Room data received in RoomForm:", room);
    if (room) {
      setFormData({
        roomNumber: room.roomNumber || "",
        roomType: room.roomType || "single",
        floor: room.floor || "",
        capacity: room.capacity ?? 2,
        pricePerNight: room.pricePerNight ?? "",
        amenities: Array.isArray(room.amenities) ? room.amenities : [],
        status: room.status || "available",
        description: room.description || "",
        isActive: room.isActive ?? true,
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [room]);

  // ============================================================
  // INPUT CHANGE
  // ============================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ============================================================
  // ADD AMENITY
  // ============================================================

  const handleAddAmenity = () => {
    const value = amenityInput.trim();

    if (!value) return;

    if (
      formData.amenities.some(
        (amenity) => amenity.toLowerCase() === value.toLowerCase(),
      )
    ) {
      setAmenityInput("");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      amenities: [...prev.amenities, value],
    }));

    setAmenityInput("");
  };

  // ============================================================
  // AMENITY ENTER
  // ============================================================

  const handleAmenityKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddAmenity();
    }
  };

  // ============================================================
  // REMOVE AMENITY
  // ============================================================

  const handleRemoveAmenity = (index) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }));
  };

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      roomNumber: formData.roomNumber.trim(),
      floor: formData.floor.trim(),
      capacity: Number(formData.capacity),
      pricePerNight: Number(formData.pricePerNight),
      description: formData.description.trim(),
      amenities: formData.amenities,
    };

    onSubmit(payload);
  };

  return (
   <form
  onSubmit={handleSubmit}
  className="flex w-full flex-col gap-6"
>
  {/* ======================================================
      ROOM DETAILS
  ====================================================== */}
  <section>
    <div className="mb-5">
      <h3 className="text-sm font-semibold leading-5 text-gray-900">
        Room Details
      </h3>

      <p className="mt-1 text-xs leading-4 text-gray-500">
        Enter the basic information for this room.
      </p>
    </div>

    <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">

      {/* Room Number */}
      <div className="flex min-w-0 flex-col">
        <label
          htmlFor="roomNumber"
          className="mb-2 text-xs font-medium leading-4 text-gray-700"
        >
          Room Number <span className="text-red-500">*</span>
        </label>

        <input
          id="roomNumber"
          type="text"
          name="roomNumber"
          value={formData.roomNumber}
          onChange={handleChange}
          placeholder="e.g. 101"
          required
          className="box-border h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Room Type */}
      <div className="flex min-w-0 flex-col">
        <label
          htmlFor="roomType"
          className="mb-2 text-xs font-medium leading-4 text-gray-700"
        >
          Room Type <span className="text-red-500">*</span>
        </label>

        <select
          id="roomType"
          name="roomType"
          value={formData.roomType}
          onChange={handleChange}
          required
          className="box-border h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-sm outline-none transition hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          {roomTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Floor */}
      <div className="flex min-w-0 flex-col">
        <label
          htmlFor="floor"
          className="mb-2 text-xs font-medium leading-4 text-gray-700"
        >
          Floor
        </label>

        <input
          id="floor"
          type="text"
          name="floor"
          value={formData.floor}
          onChange={handleChange}
          placeholder="e.g. Ground Floor"
          className="box-border h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Guest Capacity */}
      <div className="flex min-w-0 flex-col">
        <label
          htmlFor="capacity"
          className="mb-2 text-xs font-medium leading-4 text-gray-700"
        >
          Guest Capacity
        </label>

        <div className="flex h-10 w-full overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
          <input
            id="capacity"
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            min="1"
            placeholder="2"
            className="min-w-0 flex-1 border-0 bg-transparent px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-0"
          />

          <span className="flex items-center px-3 text-xs text-gray-400">
            guests
          </span>
        </div>
      </div>
    </div>
  </section>


  {/* ======================================================
      PRICING & STATUS
  ====================================================== */}
  <section className="border-t border-gray-200 pt-6">
    <div className="mb-5">
      <h3 className="text-sm font-semibold leading-5 text-gray-900">
        Pricing & Status
      </h3>

      <p className="mt-1 text-xs leading-4 text-gray-500">
        Set the nightly price and availability status.
      </p>
    </div>

    <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">

      {/* Price */}
      <div className="flex min-w-0 flex-col">
        <label
          htmlFor="pricePerNight"
          className="mb-2 text-xs font-medium leading-4 text-gray-700"
        >
          Price Per Night <span className="text-red-500">*</span>
        </label>

        <div className="flex h-10 w-full overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
          <span className="flex items-center border-r border-gray-200 bg-gray-50 px-3 text-sm text-gray-500">
            ₹
          </span>

          <input
            id="pricePerNight"
            type="number"
            name="pricePerNight"
            value={formData.pricePerNight}
            onChange={handleChange}
            min="0"
            step="0.01"
            placeholder="2500"
            required
            className="min-w-0 flex-1 border-0 bg-transparent px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-0"
          />
        </div>
      </div>

      {/* Status */}
      <div className="flex min-w-0 flex-col">
        <label
          htmlFor="status"
          className="mb-2 text-xs font-medium leading-4 text-gray-700"
        >
          Status
        </label>

        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="box-border h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-sm outline-none transition hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          {roomStatuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  </section>


  {/* ======================================================
      AMENITIES
  ====================================================== */}
  <section className="border-t border-gray-200 pt-6">
    <div className="mb-4">
      <h3 className="text-sm font-semibold leading-5 text-gray-900">
        Amenities
      </h3>

      <p className="mt-1 text-xs leading-4 text-gray-500">
        Add facilities available in this room.
      </p>
    </div>

    <div className="flex w-full gap-2">
      <input
        type="text"
        value={amenityInput}
        onChange={(e) => setAmenityInput(e.target.value)}
        onKeyDown={handleAmenityKeyDown}
        placeholder="e.g. WiFi, AC, TV"
        className="box-border h-10 min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

      <button
        type="button"
        onClick={handleAddAmenity}
        className="h-10 shrink-0 rounded-lg bg-[#BE7127] px-4 text-xs font-medium text-white transition hover:bg-[#9a6012] focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        Add
      </button>
    </div>

    {formData.amenities.length > 0 && (
      <div className="mt-3 flex flex-wrap gap-2">
        {formData.amenities.map((amenity, index) => (
          <span
            key={`${amenity}-${index}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
          >
            {amenity}

            <button
              type="button"
              onClick={() => handleRemoveAmenity(index)}
              className="flex h-4 w-4 items-center justify-center rounded-full text-blue-500 transition hover:bg-blue-100 hover:text-red-500"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    )}
  </section>


  {/* ======================================================
      DESCRIPTION
  ====================================================== */}
  <section>
    <label
      htmlFor="description"
      className="mb-2 block text-xs font-medium leading-4 text-gray-700"
    >
      Description
    </label>

    <textarea
      id="description"
      name="description"
      value={formData.description}
      onChange={handleChange}
      rows={4}
      placeholder="Enter details about the room..."
      className="block min-h-[100px] w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    />

    <p className="mt-1.5 text-[11px] leading-4 text-gray-400">
      Add room features, view, bed type, or other useful details.
    </p>
  </section>


  {/* ======================================================
      ACTIVE ROOM
  ====================================================== */}
  <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">

    <div className="min-w-0">
      <p className="text-xs font-semibold text-gray-800">
        Active Room
      </p>

      <p className="mt-0.5 text-[11px] leading-4 text-gray-500">
        Allow this room to be available for booking.
      </p>
    </div>

    <label className="relative ml-4 inline-flex h-6 w-11 shrink-0 cursor-pointer">
      <input
        type="checkbox"
        id="isActive"
        name="isActive"
        checked={formData.isActive}
        onChange={handleChange}
        className="peer sr-only"
      />

      <span className="absolute inset-0 rounded-full bg-[#BE7127] transition-colors peer-checked:bg-[#9a6012] peer-focus:ring-4 peer-focus:ring-blue-100" />

      <span className="absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
    </label>
  </div>


  {/* ======================================================
      ACTIONS
  ====================================================== */}
  <div className="flex items-center justify-end gap-2 border-t border-gray-200 pt-5">

    <button
      type="button"
      onClick={onClose}
      disabled={loading}
      className="h-9 rounded-lg border border-gray-300 bg-white px-4 text-xs font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Cancel
    </button>

    <button
      type="submit"
      disabled={loading}
      className="h-9 rounded-lg bg-[#BE7127] px-4 text-xs font-medium text-white shadow-sm transition hover:bg-[#9a6012] focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading
        ? "Saving..."
        : room
        ? "Update Room"
        : "Create Room"}
    </button>

  </div>
</form>
  );
};

export default RoomForm;