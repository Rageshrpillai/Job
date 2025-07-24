import React, { useState, useEffect } from "react";
import api from "./api";

const TicketSetup = ({ event, onNextStep, onPreviousStep }) => {
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({
    name: "",
    price: "",
    quantity: "",
    sale_start_date: "",
    sale_end_date: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch existing tickets for this event when the component loads
  useEffect(() => {
    api
      .get(`/api/events/${event.id}/tickets`)
      .then((response) => {
        setTickets(response.data);
      })
      .catch((error) => console.error("Error fetching tickets:", error));
  }, [event.id]);

  const handleChange = (e) => {
    setNewTicket({ ...newTicket, [e.target.name]: e.target.value });
  };

  const handleAddTicket = (e) => {
    e.preventDefault();
    setLoading(true);
    api
      .post(`/api/events/${event.id}/tickets`, newTicket)
      .then((response) => {
        setTickets([...tickets, response.data]); // Add new ticket to the list
        // Reset form
        setNewTicket({
          name: "",
          price: "",
          quantity: "",
          sale_start_date: "",
          sale_end_date: "",
        });
      })
      .catch((error) => {
        console.error("Error adding ticket:", error.response?.data);
        alert("Failed to add ticket.");
      })
      .finally(() => setLoading(false));
  };

  const handleDeleteTicket = (ticketId) => {
    if (window.confirm("Are you sure you want to delete this ticket type?")) {
      api
        .delete(`/api/tickets/${ticketId}`)
        .then(() => {
          setTickets(tickets.filter((t) => t.id !== ticketId));
          alert("Ticket deleted successfully.");
        })
        .catch((error) => alert("Failed to delete ticket."));
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Ticket Setup</h2>
      <p className="text-gray-600 mb-8">
        Step 2 of 4: Add different ticket types for your event.
      </p>

      {/* Form for adding a new ticket type */}
      <form
        onSubmit={handleAddTicket}
        className="bg-gray-50 p-6 rounded-lg border space-y-4 mb-8"
      >
        <h3 className="text-xl font-semibold text-gray-800">
          Add New Ticket Type
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="name"
            value={newTicket.name}
            onChange={handleChange}
            placeholder="Ticket Name (e.g., General Admission)"
            className="p-2 border rounded-md"
            required
          />
          <input
            type="number"
            name="price"
            value={newTicket.price}
            onChange={handleChange}
            placeholder="Price ($)"
            className="p-2 border rounded-md"
            required
          />
          <input
            type="number"
            name="quantity"
            value={newTicket.quantity}
            onChange={handleChange}
            placeholder="Quantity Available"
            className="p-2 border rounded-md"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-gray-600">Sale Start Date</label>
            <input
              type="date"
              name="sale_start_date"
              value={newTicket.sale_start_date}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Sale End Date</label>
            <input
              type="date"
              name="sale_end_date"
              value={newTicket.sale_end_date}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 self-end"
          >
            {loading ? "Adding..." : "+ Add Ticket"}
          </button>
        </div>
      </form>

      {/* List of existing tickets */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Current Ticket Types
        </h3>
        <div className="space-y-3">
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex justify-between items-center bg-white p-4 rounded-lg border"
              >
                <div>
                  <p className="font-bold text-gray-900">{ticket.name}</p>
                  <p className="text-sm text-gray-600">
                    Price: ${ticket.price} | Quantity: {ticket.quantity}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteTicket(ticket.id)}
                  className="text-red-500 hover:text-red-700 font-semibold"
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              No ticket types have been added yet.
            </p>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-8 mt-8 border-t">
        <button
          onClick={onPreviousStep}
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
        >
          Back to Details
        </button>
        <button
          onClick={onNextStep}
          className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700"
        >
          Continue to Coupons
        </button>
      </div>
    </div>
  );
};

export default TicketSetup;
