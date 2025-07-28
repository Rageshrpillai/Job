import React, { useState, useEffect } from "react";
import api from "./api";

const CouponSetup = ({ eventId, onBack, onFinish }) => {
  const [coupons, setCoupons] = useState([]);
  const [availableTickets, setAvailableTickets] = useState([]);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount_type: "fixed",
    discount_value: "",
    usage_limit: "",
    valid_from: "",
    valid_to: "",
    ticket_ids: [],
  });
  const [isLoading, setIsLoading] = useState(true); // Start as true
  const [isAdding, setIsAdding] = useState(false);

  // ### START OF THE FIX ###
  // Fetch tickets and coupons separately for better error handling.
  useEffect(() => {
    // 1. Fetch tickets first, since they are essential for the form.
    api
      .get(`/api/events/${eventId}/tickets`)
      .then((response) => {
        setAvailableTickets(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch tickets", error);
        alert(
          "Could not load tickets. Please go back and ensure they were created correctly."
        );
      })
      .finally(() => {
        // 2. After tickets are fetched (or failed), try to fetch coupons.
        api
          .get(`/api/events/${eventId}/coupons`)
          .then((response) => {
            setCoupons(response.data);
          })
          .catch((error) => {
            console.log(
              "Could not fetch existing coupons. This is expected if the backend is not ready."
            );
          });
        setIsLoading(false);
      });
  }, [eventId]);
  // ### END OF THE FIX ###

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCoupon((prev) => ({ ...prev, [name]: value }));
  };

  const handleTicketSelection = (ticketId) => {
    setNewCoupon((prev) => {
      const newTicketIds = prev.ticket_ids.includes(ticketId)
        ? prev.ticket_ids.filter((id) => id !== ticketId)
        : [...prev.ticket_ids, ticketId];
      return { ...prev, ticket_ids: newTicketIds };
    });
  };

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    if (newCoupon.ticket_ids.length === 0) {
      alert("Please select at least one ticket this coupon applies to.");
      return;
    }
    setIsAdding(true);

    const submissionData = {
      ...newCoupon,
      valid_from: newCoupon.valid_from.replace("T", " ") + ":00",
      valid_to: newCoupon.valid_to.replace("T", " ") + ":00",
    };

    try {
      const response = await api.post(
        `/api/events/${eventId}/coupons`,
        submissionData
      );
      setCoupons((prev) => [...prev, response.data.load("tickets")]); // Assuming the backend returns the coupon with tickets
      setNewCoupon({
        code: "",
        discount_type: "fixed",
        discount_value: "",
        usage_limit: "",
        valid_from: "",
        valid_to: "",
        ticket_ids: [],
      });
    } catch (error) {
      console.error("Failed to add coupon:", error.response?.data);
      alert(
        "Failed to add coupon: " +
          (error.response?.data?.message || "Please check details.")
      );
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        await api.delete(`/api/coupons/${couponId}`);
        setCoupons(coupons.filter((c) => c.id !== couponId));
      } catch (error) {
        console.error("Failed to delete coupon:", error.response?.data);
        alert("Failed to delete coupon.");
      }
    }
  };

  if (isLoading) {
    return <div>Loading ticket information...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Coupon Setup</h2>
      <p className="text-gray-600 mb-6">
        Step 3 of 3: Create discount codes for your event.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Add a New Coupon
        </h3>
        <form onSubmit={handleAddCoupon} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700"
              >
                Coupon Code
              </label>
              <input
                type="text"
                name="code"
                id="code"
                value={newCoupon.code}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., SUMMER25"
              />
            </div>
            <div>
              <label
                htmlFor="discount_type"
                className="block text-sm font-medium text-gray-700"
              >
                Discount Type
              </label>
              <select
                name="discount_type"
                id="discount_type"
                value={newCoupon.discount_type}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="fixed">Fixed Amount ($)</option>
                <option value="percentage">Percentage (%)</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="discount_value"
                className="block text-sm font-medium text-gray-700"
              >
                Value
              </label>
              <input
                type="number"
                name="discount_value"
                id="discount_value"
                value={newCoupon.discount_value}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., 10 or 25"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="usage_limit"
                className="block text-sm font-medium text-gray-700"
              >
                Usage Limit (Optional)
              </label>
              <input
                type="number"
                name="usage_limit"
                id="usage_limit"
                value={newCoupon.usage_limit}
                onChange={handleChange}
                min="1"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., 100"
              />
            </div>
            <div>
              <label
                htmlFor="valid_from"
                className="block text-sm font-medium text-gray-700"
              >
                Valid From
              </label>
              <input
                type="datetime-local"
                name="valid_from"
                id="valid_from"
                value={newCoupon.valid_from}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="valid_to"
                className="block text-sm font-medium text-gray-700"
              >
                Valid To
              </label>
              <input
                type="datetime-local"
                name="valid_to"
                id="valid_to"
                value={newCoupon.valid_to}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Applies to Tickets
            </label>
            {availableTickets.length > 0 ? (
              <div className="space-y-2">
                {availableTickets.map((ticket) => (
                  <label key={ticket.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newCoupon.ticket_ids.includes(ticket.id)}
                      onChange={() => handleTicketSelection(ticket.id)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-700">
                      {ticket.name} (${ticket.price})
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No tickets found. Please add tickets in the previous step.
              </p>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isAdding || availableTickets.length === 0}
              className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
            >
              {isAdding ? "Adding..." : "Add Coupon"}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Current Coupons
        </h3>
        {coupons.length > 0 ? (
          <ul className="space-y-3">
            {coupons.map((coupon) => (
              <li
                key={coupon.id}
                className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-gray-900">{coupon.code}</p>
                  <p className="text-sm text-gray-600">
                    {coupon.discount_type === "fixed"
                      ? `$${coupon.discount_value}`
                      : `${coupon.discount_value}%`}{" "}
                    off - Usage: {coupon.usage_count} /{" "}
                    {coupon.usage_limit || "∞"}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteCoupon(coupon.id)}
                  className="text-red-500 hover:text-red-700 font-semibold"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center py-4">
            No coupons have been added yet.
          </p>
        )}
      </div>

      <div className="flex justify-between pt-6 mt-6 border-t">
        <button
          onClick={onBack}
          className="py-3 px-8 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={onFinish}
          className="inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Finish & Publish Event
        </button>
      </div>
    </div>
  );
};

export default CouponSetup;
