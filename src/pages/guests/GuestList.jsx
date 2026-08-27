import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useDispatch } from "react-redux";

import toast from "react-hot-toast";

import Modal from "../../components/common/Modal";

import GuestForm from "./GuestForm";

import {
  getGuests,
  createGuest,
  updateGuest,
  deleteGuest,
} from "../../redux/slices/guestSlice";

import "./guests.css";


// ============================================================
// STATUS LABELS
// ============================================================

const statusLabels = {
  active: "Active",
  inactive: "Inactive",
};


// ============================================================
// GUEST LIST
// ============================================================

const GuestList = () => {

  const dispatch = useDispatch();


  // ==========================================================
  // STATE
  // ==========================================================

  const [guests, setGuests] = useState([]);

  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");

  const [status, setStatus] = useState("all");

  const [selectedGuest, setSelectedGuest] =
    useState(null);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [openActionId, setOpenActionId] =
    useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);


  // ==========================================================
  // FETCH GUESTS
  // ==========================================================

  const fetchGuests = async () => {

    try {

      setLoading(true);

      console.log("Fetching guests...");

      const response =
        await dispatch(
          getGuests()
        ).unwrap();

      console.log(
        "Fetched guests:",
        response
      );


      const guestData =
        response?.data?.guests ||
        response?.data?.data ||
        response?.data ||
        [];


      setGuests(
        Array.isArray(guestData)
          ? guestData
          : []
      );

    } catch (error) {

      console.error(
        "Failed to fetch guests:",
        error
      );

      setGuests([]);

      toast.error(
        typeof error === "string"
          ? error
          : "Failed to fetch guests"
      );

    } finally {

      setLoading(false);

    }
  };


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {

    fetchGuests();

  }, []);


  // ==========================================================
  // SUMMARY COUNTS
  // ==========================================================

  const statusCounts = useMemo(() => {

    return {

      total: guests.length,

      active: guests.filter(
        (guest) =>
          guest.status === "active"
      ).length,

      inactive: guests.filter(
        (guest) =>
          guest.status === "inactive"
      ).length,

    };

  }, [guests]);


  // ==========================================================
  // FILTER GUESTS
  // ==========================================================

  const filteredGuests = useMemo(() => {

    const searchValue =
      query
        .trim()
        .toLowerCase();


    return guests.filter((guest) => {

      const matchesSearch =
        !searchValue ||

        guest.fullName
          ?.toLowerCase()
          .includes(searchValue) ||

        guest.name
          ?.toLowerCase()
          .includes(searchValue) ||

        guest.email
          ?.toLowerCase()
          .includes(searchValue) ||

        guest.mobileNumber
          ?.toLowerCase()
          .includes(searchValue) ||

        guest.phone
          ?.toLowerCase()
          .includes(searchValue) ||

        guest.idProofNumber
          ?.toLowerCase()
          .includes(searchValue);


      const matchesStatus =
        status === "all" ||
        guest.status === status;


      return (
        matchesSearch &&
        matchesStatus
      );

    });

  }, [
    guests,
    query,
    status,
  ]);

    // ============================================================
    // PAGINATION
    // ============================================================
    
    const totalItems = filteredGuests.length;
    
    const totalPages = Math.ceil(
      totalItems / itemsPerPage
    );
    
    const startIndex =
      (currentPage - 1) * itemsPerPage;
    
    const endIndex =
      startIndex + itemsPerPage;
    
    const paginatedGuests =
      filteredGuests.slice(
        startIndex,
        endIndex
      );
    
    
      useEffect(() => {
      setCurrentPage(1);
    }, [query, status, itemsPerPage]);


  // ==========================================================
  // ADD GUEST
  // ==========================================================

  const handleAddGuest = () => {

    setSelectedGuest(null);

    setOpenActionId(null);

    setIsModalOpen(true);

  };


  // ==========================================================
  // EDIT GUEST
  // ==========================================================

  const handleEditGuest = (guest) => {

    console.log(
      "Editing guest:",
      guest
    );

    setSelectedGuest(guest);

    setOpenActionId(null);

    setIsModalOpen(true);

  };


  // ==========================================================
  // CLOSE MODAL
  // ==========================================================

  const handleClose = () => {

    setIsModalOpen(false);

    setSelectedGuest(null);

  };


  // ==========================================================
  // FORM SUCCESS
  // ==========================================================

  const handleFormSuccess = () => {

    handleClose();

    fetchGuests();

  };


  // ==========================================================
  // CREATE / UPDATE
  // ==========================================================

  const handleFormSubmit = async (
    formData
  ) => {

    try {

      // ------------------------------------------------------
      // UPDATE
      // ------------------------------------------------------

      if (selectedGuest) {

        const result =
          await dispatch(
            updateGuest({
              id: selectedGuest._id,
              guestData: formData,
            })
          );

        console.log(
          "Guest updated:",
          result
        );


        if (
          updateGuest.fulfilled.match(
            result
          )
        ) {

          toast.success(
            "Guest updated successfully!"
          );

          handleFormSuccess();

        } else {

          toast.error(
            result.payload ||
              "Failed to update guest"
          );

        }

      }

      // ------------------------------------------------------
      // CREATE
      // ------------------------------------------------------

      else {

        const result =
          await dispatch(
            createGuest(formData)
          );

        console.log(
          "Guest created:",
          result
        );


        if (
          createGuest.fulfilled.match(
            result
          )
        ) {

          toast.success(
            "Guest created successfully!"
          );

          handleFormSuccess();

        } else {

          toast.error(
            result.payload ||
              "Failed to create guest"
          );

        }

      }

    } catch (error) {

      console.error(
        "Failed to submit guest:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to save guest"
      );

    }

  };


  // ==========================================================
  // DELETE GUEST
  // ==========================================================

  const handleDeleteGuest = async (
    guest
  ) => {

    setOpenActionId(null);


    const guestName =
      guest.fullName ||
      guest.name ||
      "this guest";


    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${guestName}?`
      );


    if (!confirmed) {
      return;
    }


    try {

      const result =
        await dispatch(
          deleteGuest(guest._id)
        );


      if (
        deleteGuest.fulfilled.match(
          result
        )
      ) {

        toast.success(
          "Guest deleted successfully!"
        );

        fetchGuests();

      } else {

        toast.error(
          result.payload ||
            "Failed to delete guest"
        );

      }

    } catch (error) {

      console.error(
        "Failed to delete guest:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to delete guest"
      );

    }

  };


  // ==========================================================
  // GET GUEST NAME
  // ==========================================================

  const getGuestName = (guest) => {

    return (
      guest.fullName ||
      guest.name ||
      "Unknown Guest"
    );

  };


  // ==========================================================
  // GET INITIALS
  // ==========================================================

  const getInitials = (guest) => {

    const name =
      getGuestName(guest);


    return name
      .split(" ")
      .map(
        (item) =>
          item.charAt(0)
      )
      .join("")
      .substring(0, 2)
      .toUpperCase();

  };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <main className="guest-list-page">

      {/* ====================================================
          HEADER
      ==================================================== */}

      <header className="guest-list-header">

        <div>

          <p className="eyebrow">
            Front desk
          </p>

          <h1>
            Guests
          </h1>

          <p className="subtitle">
            Manage guest profiles and contact information
          </p>

        </div>


        <button
          type="button"
          className="primary-button"
          onClick={handleAddGuest}
        >

          <span className="button-icon">
            +
          </span>

          Add guest

        </button>

      </header>


      {/* ====================================================
          SUMMARY
      ==================================================== */}

      <section
        className="guest-summary"
        aria-label="Guest summary"
      >

        <button
          type="button"
          className={`summary-card ${
            status === "all"
              ? "selected"
              : ""
          }`}
          onClick={() =>
            setStatus("all")
          }
        >

          <div className="summary-card-top">

            <span className="status-dot total" />

            <span className="summary-label">
              Total guests
            </span>

          </div>

          <strong>
            {statusCounts.total}
          </strong>

        </button>


        <button
          type="button"
          className={`summary-card ${
            status === "active"
              ? "selected"
              : ""
          }`}
          onClick={() =>
            setStatus(
              status === "active"
                ? "all"
                : "active"
            )
          }
        >

          <div className="summary-card-top">

            <span className="status-dot active" />

            <span className="summary-label">
              Active
            </span>

          </div>

          <strong>
            {statusCounts.active}
          </strong>

        </button>


        <button
          type="button"
          className={`summary-card ${
            status === "inactive"
              ? "selected"
              : ""
          }`}
          onClick={() =>
            setStatus(
              status === "inactive"
                ? "all"
                : "inactive"
            )
          }
        >

          <div className="summary-card-top">

            <span className="status-dot inactive" />

            <span className="summary-label">
              Inactive
            </span>

          </div>

          <strong>
            {statusCounts.inactive}
          </strong>

        </button>

      </section>


      {/* ====================================================
          LIST PANEL
      ==================================================== */}

      <section className="guest-list-panel">

        {/* TOOLBAR */}

        <div className="guest-list-toolbar">

          <div className="toolbar-left">

            <label className="search-box">

              <span className="search-icon">
                ⌕
              </span>

              <input
                type="text"
                value={query}
                onChange={(event) =>
                  setQuery(
                    event.target.value
                  )
                }
                placeholder="Search by name, email or mobile"
              />

              {query && (

                <button
                  type="button"
                  className="clear-search"
                  onClick={() =>
                    setQuery("")
                  }
                >
                  ×
                </button>

              )}

            </label>

          </div>


          <div className="toolbar-right">

            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value
                )
              }
            >

              <option value="all">
                All statuses
              </option>

              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>

            </select>


            <button
              type="button"
              className="refresh-button"
              onClick={fetchGuests}
              disabled={loading}
              title="Refresh"
            >
              ↻
            </button>

          </div>

        </div>


        {/* ==================================================
            TABLE
        ================================================== */}

        <div className="guest-table-wrap">

          <table className="guest-table">

            <thead>

              <tr>

                <th>Guest</th>

                <th>Contact</th>

                <th>ID proof</th>

                <th>Location</th>

                <th>Status</th>

                <th className="actions-column">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan="6"
                    className="table-loading"
                  >

                    <div className="loading-spinner" />

                    Loading guests...

                  </td>

                </tr>

              ) : paginatedGuests.length > 0 ? (

                paginatedGuests.map(
                  (guest) => (

                    <tr
                      key={guest._id}
                    >

                      {/* GUEST */}

                      <td>

                        <div className="guest-name-cell">

                          <div className="guest-avatar">
                            {getInitials(
                              guest
                            )}
                          </div>

                          <div>

                            <strong>
                              {getGuestName(
                                guest
                              )}
                            </strong>

                            {guest.gender && (
                              <span>
                                {guest.gender}
                              </span>
                            )}

                          </div>

                        </div>

                      </td>


                      {/* CONTACT */}

                      <td>

                        <div className="contact-cell">

                          <span>
                            {guest.mobileNumber ||
                              guest.phone ||
                              "—"}
                          </span>

                          <span>
                            {guest.email ||
                              "—"}
                          </span>

                        </div>

                      </td>


                      {/* ID PROOF */}

                      <td>

                        <div className="id-proof-cell">

                          <strong>
                            {guest.idType ||
                              "—"}
                          </strong>

                          <span>
                            {guest.idNumber ||
                              "—"}
                          </span>

                        </div>

                      </td>


                      {/* LOCATION */}

                      <td>

                        <span className="location-text">

                          {guest.city ||
                            guest.state ||
                            guest.address ||
                            "—"}

                        </span>

                      </td>


                      {/* STATUS */}

                      <td>

                        <span
                          className={`status-badge ${
                            guest.status ||
                            "active"
                          }`}
                        >

                          <span className="status-dot" />

                          {statusLabels[
                            guest.status
                          ] ||
                            guest.status ||
                            "Active"}

                        </span>

                      </td>


                      {/* ACTIONS */}

                      <td className="actions-column">

                        <div className="guest-actions">

                          <button
                            type="button"
                            className="more-button"
                            onClick={() =>
                              setOpenActionId(
                                openActionId ===
                                  guest._id
                                  ? null
                                  : guest._id
                              )
                            }
                          >
                            ⋮
                          </button>


                          {openActionId ===
                            guest._id && (

                            <div className="action-menu">

                              <button
                                type="button"
                                onClick={() =>
                                  handleEditGuest(
                                    guest
                                  )
                                }
                              >
                                <span>
                                  ✎
                                </span>

                                Edit guest
                              </button>


                              <button
                                type="button"
                                className="danger-action"
                                onClick={() =>
                                  handleDeleteGuest(
                                    guest
                                  )
                                }
                              >
                                <span>
                                  ⌫
                                </span>

                                Delete guest
                              </button>

                            </div>

                          )}

                        </div>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    className="empty-state-cell"
                  >

                    <div className="empty-state">

                      <div className="empty-icon">
                        👤
                      </div>

                      <h3>
                        No guests found
                      </h3>

                      <p>

                        {query ||
                        status !== "all"
                          ? "Try changing your search or filter."
                          : "Start by adding your first guest."}

                      </p>


                      {!query &&
                        status === "all" && (

                        <button
                          type="button"
                          className="primary-button"
                          onClick={
                            handleAddGuest
                          }
                        >

                          <span>+</span>

                          Add guest

                        </button>

                      )}

                    </div>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>


        {/* ==================================================
            FOOTER
        ================================================== */}

        {/* {!loading &&
          guests.length > 0 && (

          <div className="guest-list-footer">

            Showing{" "}

            <strong>
              {filteredGuests.length}
            </strong>{" "}

            of{" "}

            <strong>
              {guests.length}
            </strong>{" "}

            guests

          </div>

        )} */}

        {!loading && paginatedGuests.length > 0 && (

  <div className="room-list-footer">

    {/* SHOWING INFO */}

    <div className="pagination-info">

      Showing{" "}

      <strong>
        {startIndex + 1}
      </strong>

      {" - "}

      <strong>
        {Math.min(
          endIndex,
          totalItems
        )}
      </strong>

      {" of "}

      <strong>
        {totalItems}
      </strong>

      {" rooms"}

    </div>


    {/* ITEMS PER PAGE */}

    <div className="pagination-size">

      <span>
        Rows:
      </span>

      <select
        value={itemsPerPage}
        onChange={(event) => {
          setItemsPerPage(
            Number(event.target.value)
          );

          setCurrentPage(1);
        }}
      >

        <option value={5}>
          5
        </option>

        <option value={10}>
          10
        </option>

        <option value={20}>
          20
        </option>

        <option value={50}>
          50
        </option>

      </select>

    </div>


    {/* PAGINATION */}

    {totalPages > 1 && (

      <div className="pagination-controls">

        {/* PREVIOUS */}

        <button
          type="button"
          className="pagination-button"
          disabled={currentPage === 1}
          onClick={() =>
            setCurrentPage(
              (page) => page - 1
            )
          }
          aria-label="Previous page"
        >
          ‹
        </button>


        {/* PAGE NUMBERS */}

        {Array.from(
          { length: totalPages },
          (_, index) => index + 1
        ).map((page) => (

          <button
            type="button"
            key={page}
            className={
              currentPage === page
                ? "pagination-button active"
                : "pagination-button"
            }
            onClick={() =>
              setCurrentPage(page)
            }
          >
            {page}
          </button>

        ))}


        {/* NEXT */}

        <button
          type="button"
          className="pagination-button"
          disabled={
            currentPage === totalPages
          }
          onClick={() =>
            setCurrentPage(
              (page) => page + 1
            )
          }
          aria-label="Next page"
        >
          ›
        </button>

      </div>

    )}

  </div>

)}

      </section>


      {/* ====================================================
          GUEST MODAL
      ==================================================== */}

      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={
          selectedGuest
            ? "Edit Guest"
            : "Add New Guest"
        }
        width="800px"
      >

        <GuestForm
          guest={selectedGuest}
          onSubmit={handleFormSubmit}
          onClose={handleClose}
        />

      </Modal>

    </main>

  );
};

export default GuestList;