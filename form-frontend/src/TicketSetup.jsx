import React, { useState, useEffect } from "react";
import api from "./api";

const TicketSetup = ({ eventId, onNext, onBack }) => {
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({
    name: "",
    price: "",
    total_quantity: "",
    description: "",
    sale_start_date: "",
    sale_end_date: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    api
      .get(`/api/events/${eventId}/tickets`)
      .then((response) => {
        setTickets(response.data);
      })
      .catch((error) => {
        console.log("No existing tickets found or failed to fetch.");
      })
      .finally(() => setIsLoading(false));
  }, [eventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTicket((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTicket = async (e) => {
    e.preventDefault();
    setIsAdding(true);

    // ### START OF THE FIX ###
    // Format the date string by replacing 'T' with a space to match the backend.
    const submissionData = {
      ...newTicket,
      sale_start_date: newTicket.sale_start_date.replace("T", " ") + ":00",
      sale_end_date: newTicket.sale_end_date.replace("T", " ") + ":00",
    };
    // ### END OF THE FIX ###

    try {
      const response = await api.post(
        `/api/events/${eventId}/tickets`,
        submissionData
      );
      setTickets((prev) => [...prev, response.data]);
      setNewTicket({
        name: "",
        price: "",
        total_quantity: "",
        description: "",
        sale_start_date: "",
        sale_end_date: "",
      });
    } catch (error) {
      console.error("Failed to add ticket:", error.response?.data);
      alert(
        "Failed to add ticket: " +
          (error.response?.data?.message ||
            "Please check the details and try again.")
      );
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      try {
        await api.delete(`/api/tickets/${ticketId}`);
        setTickets(tickets.filter((ticket) => ticket.id !== ticketId));
      } catch (error) {
        console.error("Failed to delete ticket:", error.response?.data);
        alert("Failed to delete ticket.");
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Ticket Setup</h2>
      <p className="text-gray-600 mb-6">
        Step 2 of 3: Add the different ticket types for your event.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Add a New Ticket
        </h3>
        <form onSubmit={handleAddTicket} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Ticket Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={newTicket.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., General Admission"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description (Optional)
              </label>
              <input
                type="text"
                name="description"
                id="description"
                value={newTicket.description}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., Access to main event area"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                id="price"
                value={newTicket.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., 25.00"
              />
            </div>
            <div>
              <label
                htmlFor="total_quantity"
                className="block text-sm font-medium text-gray-700"
              >
                Total Quantity
              </label>
              <input
                type="number"
                name="total_quantity"
                id="total_quantity"
                value={newTicket.total_quantity}
                onChange={handleChange}
                required
                min="1"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., 100"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="sale_start_date"
                className="block text-sm font-medium text-gray-700"
              >
                Sale Starts On
              </label>
              <input
                type="datetime-local"
                name="sale_start_date"
                id="sale_start_date"
                value={newTicket.sale_start_date}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="sale_end_date"
                className="block text-sm font-medium text-gray-700"
              >
                Sale Ends On
              </label>
              <input
                type="datetime-local"
                name="sale_end_date"
                id="sale_end_date"
                value={newTicket.sale_end_date}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isAdding}
              className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              {isAdding ? "Adding..." : "Add Ticket"}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Current Tickets
        </h3>
        {isLoading ? (
          <p>Loading tickets...</p>
        ) : tickets.length > 0 ? (
          <ul className="space-y-3">
            {tickets.map((ticket) => (
              <li
                key={ticket.id}
                className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-gray-900">{ticket.name}</p>
                  <p className="text-sm text-gray-600">
                    ${parseFloat(ticket.price).toFixed(2)} -{" "}
                    {ticket.total_quantity} available
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteTicket(ticket.id)}
                  className="text-red-500 hover:text-red-700 font-semibold"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center py-4">
            No tickets have been added yet.
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
          onClick={onNext}
          className="inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
};

export default TicketSetup;
