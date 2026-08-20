import React from "react";

const GuestForm = ({
  guest,
  onSubmit,
  onClose,
}) => {

  const handleSubmit = (event) => {

    event.preventDefault();

    const formData =
      new FormData(event.target);

    const data = {
      fullName:
        formData.get("fullName"),

      email:
        formData.get("email"),

      mobileNumber:
        formData.get("mobileNumber"),

      gender:
        formData.get("gender"),

      idProofType:
        formData.get("idProofType"),

      idProofNumber:
        formData.get("idProofNumber"),

      address:
        formData.get("address"),

      city:
        formData.get("city"),

        state:
        formData.get("state"),

      country:
        formData.get("country"),

      status:
        formData.get("status"),
    };

    onSubmit(data);
  };


  return (

    <form
      className="guest-form"
      onSubmit={handleSubmit}
    >

      <div className="form-grid">

        <div className="form-group">

          <label>
            Full Name *
          </label>

          <input
            name="fullName"
            defaultValue={
              guest?.fullName ||
              guest?.name ||
              ""
            }
            placeholder="Enter guest name"
            required
          />

        </div>


        <div className="form-group">

          <label>
            Mobile Number *
          </label>

          <input
            name="mobileNumber"
            type="tel"
            defaultValue={
              guest?.phone ||
              ""
            }
            placeholder="Enter mobile number"
            required
          />

        </div>


        <div className="form-group">

          <label>
            Email
          </label>

          <input
            name="email"
            type="email"
            defaultValue={
              guest?.email || ""
            }
            placeholder="Enter email"
          />

        </div>


        <div className="form-group">

          <label>
            Gender
          </label>

          <select
            name="gender"
            defaultValue={
              guest?.gender || ""
            }
          >

            <option value="">
              Select gender
            </option>

            <option value="male">
              Male
            </option>

            <option value="female">
              Female
            </option>

            <option value="other">
              Other
            </option>

          </select>

        </div>


        <div className="form-group">

          <label>
            ID Proof Type
          </label>

          <select
            name="idProofType"
            defaultValue={
              guest?.idType || ""
            }
          >

            <option value="">
              Select ID proof
            </option>

            <option value="aadhar">
              Aadhaar
            </option>

            <option value="passport">
              Passport
            </option>

            <option value="driving_license">
              Driving License
            </option>

            <option value="voter_id">
              Voter ID
            </option>

            <option value="other">
              Other
            </option>

          </select>

        </div>


        <div className="form-group">

          <label>
            ID Proof Number
          </label>

          <input
            name="idProofNumber"
            defaultValue={
              guest?.idNumber ||
              ""
            }
            placeholder="Enter ID number"
          />

        </div>


        <div className="form-group">

          <label>
            City
          </label>

          <input
            name="city"
            defaultValue={
              guest?.city || ""
            }
            placeholder="Enter city"
          />

        </div>

        <div className="form-group">

          <label>
            State
          </label>

          <input
            name="state"
            defaultValue={
              guest?.state || ""
            }
            placeholder="Enter state"
          />

        </div>


        <div className="form-group">

          <label>
            Country
          </label>

          <input
            name="country"
            defaultValue={
              guest?.country ||
              "India"
            }
            placeholder="Enter country"
          />

        </div>

      </div>


      <div className="form-group">

        <label>
          Address
        </label>

        <textarea
          name="address"
          rows="3"
          defaultValue={
            guest?.address || ""
          }
          placeholder="Enter address"
        />

      </div>


      <div className="form-group">

        <label>
          Status
        </label>

        <select
          name="status"
          defaultValue={
            guest?.status ||
            "active"
          }
        >

          <option value="active">
            Active
          </option>

          <option value="inactive">
            Inactive
          </option>

        </select>

      </div>


      <div className="form-actions">

        <button
          type="button"
          className="secondary-button"
          onClick={onClose}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="primary-button"
        >
          {guest
            ? "Update Guest"
            : "Create Guest"}
        </button>

      </div>

    </form>

  );
};

export default GuestForm;