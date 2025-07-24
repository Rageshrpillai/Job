import React, { useState, useEffect } from "react";
import api from "./api";

const CouponSetup = ({ event, onNextStep, onPreviousStep }) => {
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount_type: "fixed",
    discount_value: "",
    max_uses: "",
    expires_at: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch existing coupons for this event
  useEffect(() => {
    api
      .get(`/api/events/${event.id}/coupons`)
      .then((response) => {
        setCoupons(response.data);
      })
      .catch((error) => console.error("Error fetching coupons:", error));
  }, [event.id]);

  const handleChange = (e) => {
    setNewCoupon({ ...newCoupon, [e.target.name]: e.target.value });
  };

  const handleAddCoupon = (e) => {
    e.preventDefault();
    setLoading(true);
    api
      .post(`/api/events/${event.id}/coupons`, newCoupon)
      .then((response) => {
        setCoupons([...coupons, response.data]); // Add new coupon to the list
        // Reset form
        setNewCoupon({
          code: "",
          discount_type: "fixed",
          discount_value: "",
          max_uses: "",
          expires_at: "",
        });
      })
      .catch((error) => {
        console.error("Error adding coupon:", error.response?.data);
        alert("Failed to add coupon. The code may already be in use.");
      })
      .finally(() => setLoading(false));
  };

  const handleDeleteCoupon = (couponId) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      api
        .delete(`/api/coupons/${couponId}`)
        .then(() => {
          setCoupons(coupons.filter((c) => c.id !== couponId));
          alert("Coupon deleted successfully.");
        })
        .catch((error) => alert("Failed to delete coupon."));
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Coupon Setup</h2>
      <p className="text-gray-600 mb-8">
        Step 3 of 4: Create discount codes for your event.
      </p>

      {/* Form for adding a new coupon */}
      <form
        onSubmit={handleAddCoupon}
        className="bg-gray-50 p-6 rounded-lg border space-y-4 mb-8"
      >
        <h3 className="text-xl font-semibold text-gray-800">Add New Coupon</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="code"
            value={newCoupon.code}
            onChange={handleChange}
            placeholder="Coupon Code (e.g., EARLYBIRD10)"
            className="p-2 border rounded-md"
            required
          />
          <select
            name="discount_type"
            value={newCoupon.discount_type}
            onChange={handleChange}
            className="p-2 border rounded-md"
          >
            <option value="fixed">Fixed Amount ($)</option>
            <option value="percentage">Percentage (%)</option>
          </select>
          <input
            type="number"
            name="discount_value"
            value={newCoupon.discount_value}
            onChange={handleChange}
            placeholder="Discount Value"
            className="p-2 border rounded-md"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="number"
            name="max_uses"
            value={newCoupon.max_uses}
            onChange={handleChange}
            placeholder="Max Uses (optional)"
            className="p-2 border rounded-md"
          />
          <div>
            <label className="text-sm text-gray-600">
              Expiry Date (optional)
            </label>
            <input
              type="date"
              name="expires_at"
              value={newCoupon.expires_at}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 self-end"
          >
            {loading ? "Adding..." : "+ Add Coupon"}
          </button>
        </div>
      </form>

      {/* List of existing coupons */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Current Coupons
        </h3>
        <div className="space-y-3">
          {coupons.length > 0 ? (
            coupons.map((coupon) => (
              <div
                key={coupon.id}
                className="flex justify-between items-center bg-white p-4 rounded-lg border"
              >
                <div>
                  <p className="font-bold text-gray-900">{coupon.code}</p>
                  <p className="text-sm text-gray-600">
                    Discount:{" "}
                    {coupon.discount_type === "fixed"
                      ? `$${coupon.discount_value}`
                      : `${coupon.discount_value}%`}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteCoupon(coupon.id)}
                  className="text-red-500 hover:text-red-700 font-semibold"
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No coupons have been added yet.</p>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-8 mt-8 border-t">
        <button
          onClick={onPreviousStep}
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
        >
          Back to Tickets
        </button>
        <button
          onClick={onNextStep}
          className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700"
        >
          Review & Publish
        </button>
      </div>
    </div>
  );
};

export default CouponSetup;
