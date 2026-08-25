import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import {
  createPayment,
} from "../../redux/slices/paymentSlice";

const PaymentForm = ({
  payment,
  onSuccess,
  onClose,
}) => {

    console.log("PaymentForm payment prop:", payment);
  const dispatch = useDispatch();

  const booking =
    payment?.bookingId ||
    payment?.booking;

  const guest =
    payment?.guestId ||
    payment?.guest;

  const room =
    payment?.roomId ||
    payment?.room;

  const totalAmount =
    Number(
      payment?.totalAmount ||
      booking?.totalAmount ||
      0
    );

  const alreadyPaid =
    Number(
      payment?.paidAmount ||
      payment?.amountPaid ||
      booking?.paidAmount ||
      0
    );

  const existingDue =
    payment?.dueAmount ??
    booking?.dueAmount ??
    Math.max(
      totalAmount - alreadyPaid,
      0
    );

  const [formData, setFormData] =
    useState({
      amount: existingDue,
      paymentMethod: "cash",
      referenceNumber: "",
      notes: "",
    });

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      amount: existingDue,
    }));
  }, [existingDue]);

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const amount =
      Number(formData.amount);

    if (!amount || amount <= 0) {
      toast.error(
        "Please enter a valid payment amount"
      );
      return;
    }

    if (amount > existingDue) {
      toast.error(
        "Payment cannot be greater than due amount"
      );
      return;
    }

    if (
      ["upi", "card", "bank_transfer"].includes(
        formData.paymentMethod
      ) &&
      !formData.referenceNumber.trim()
    ) {
      toast.error(
        "Please enter payment reference number"
      );
      return;
    }

    try {
      setLoading(true);

      /*
       * Adjust these field names according
       * to your backend payment controller.
       */

      const payload = {
        bookingId:
          booking?._id ||
          payment?.bookingId || payment?._id,

        guestId:
          guest?._id ||
          payment?.guestId,

        roomId:
          room?._id ||
          payment?.roomId,

        amount,

        paymentMethod:
          formData.paymentMethod,

        referenceNumber:
          formData.referenceNumber,

        notes:
          formData.notes,
      };

      const result =
        await dispatch(
          createPayment(payload)
        );

      if (
        createPayment.fulfilled.match(
          result
        )
      ) {
        toast.success(
          "Payment collected successfully!"
        );

        onSuccess?.(
          result.payload
        );
      } else {
        toast.error(
          result.payload ||
            "Failed to collect payment"
        );
      }

    } catch (error) {
      console.error(
        "Payment error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to collect payment"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (
    amount
  ) => {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }
    ).format(Number(amount) || 0);
  };

  return (
    <form
      className="payment-form"
      onSubmit={handleSubmit}
    >

      {/* BOOKING INFO */}

      <div className="payment-booking-card">

        <div>
          <span>Booking</span>

          <strong>
            {booking?.bookingNo ||
              payment?.bookingNo ||
              "—"}
          </strong>
        </div>

        <div>
          <span>Guest</span>

          <strong>
            {guest?.name ||
              "—"}
          </strong>
        </div>

        <div>
          <span>Room</span>

          <strong>
            {room?.roomNumber
              ? `Room ${room.roomNumber}`
              : "—"}
          </strong>
        </div>

      </div>

      {/* SUMMARY */}

      <div className="payment-collection-summary">

        <div>
          <span>
            Total Amount
          </span>

          <strong>
            {formatCurrency(
              totalAmount
            )}
          </strong>
        </div>

        <div>
          <span>
            Already Paid
          </span>

          <strong>
            {formatCurrency(
              alreadyPaid
            )}
          </strong>
        </div>

        <div className="due">
          <span>
            Outstanding
          </span>

          <strong>
            {formatCurrency(
              existingDue
            )}
          </strong>
        </div>

      </div>

      {/* AMOUNT */}

      <div className="input-group">

        <label htmlFor="amount">
          Payment Amount
          <span>*</span>
        </label>

        <input
          id="amount"
          type="number"
          name="amount"
          min="1"
          max={existingDue}
          value={formData.amount}
          onChange={handleChange}
          placeholder="Enter payment amount"
        />

        <small>
          Maximum:
          {" "}
          {formatCurrency(
            existingDue
          )}
        </small>

      </div>

      {/* METHOD */}

      <div className="input-group">

        <label htmlFor="paymentMethod">
          Payment Method
          <span>*</span>
        </label>

        <select
          id="paymentMethod"
          name="paymentMethod"
          value={
            formData.paymentMethod
          }
          onChange={handleChange}
        >
          <option value="cash">
            Cash
          </option>

          <option value="upi">
            UPI
          </option>

          <option value="card">
            Card
          </option>

          <option value="bank_transfer">
            Bank Transfer
          </option>

          <option value="other">
            Other
          </option>
        </select>

      </div>

      {/* REFERENCE */}

      <div className="input-group">

        <label htmlFor="referenceNumber">
          Reference Number
        </label>

        <input
          id="referenceNumber"
          type="text"
          name="referenceNumber"
          value={
            formData.referenceNumber
          }
          onChange={handleChange}
          placeholder="Transaction / UPI reference"
        />

      </div>

      {/* NOTES */}

      <div className="input-group">

        <label htmlFor="notes">
          Notes
        </label>

        <textarea
          id="notes"
          name="notes"
          rows="3"
          value={
            formData.notes
          }
          onChange={handleChange}
          placeholder="Payment notes..."
        />

      </div>

      {/* ACTIONS */}

      <div className="payment-form-actions">

        <button
          type="button"
          className="secondary-button"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="primary-button"
          disabled={
            loading ||
            existingDue <= 0
          }
        >
          {loading
            ? "Processing..."
            : "Collect Payment"}
        </button>

      </div>

    </form>
  );
};

export default PaymentForm;