import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "./api";

const TicketManagementPage = () => {
  const { eventId } = useParams();
  const [tickets, setTickets] = useState([]);
  const [eventName, setEventName] = useState("");
  const [newTicket, setNewTicket] = useState({
    name: "",
    price: "",
    total_quantity: "",
    description: "",
    sale_start_date: "",
    sale_end_date: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      setIsLoading(true);
      try {
        const [eventRes, ticketsRes] = await Promise.all([
          api.get(`/api/events/${eventId}`),
          api.get(`/api/events/${eventId}/tickets`),
        ]);
        setEventName(eventRes.data.title);
        setTickets(ticketsRes.data);
      } catch (error) {
        console.error("Failed to fetch event tickets", error);
        alert("Failed to load ticket data. Please ensure the event exists.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEventData();
  }, [eventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTicket((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTicket = async (e) => {
    e.preventDefault();
    setIsAdding(true);

    const submissionData = {
      ...newTicket,
      sale_start_date: newTicket.sale_start_date.replace("T", " ") + ":00",
      sale_end_date: newTicket.sale_end_date.replace("T", " ") + ":00",
    };

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
          (error.response?.data?.message || "Please check details.")
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

  if (isLoading) {
    return <div className="p-8 text-center">Loading Ticket Manager...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            to="/dashboard/events"
            className="text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            &larr; Back to Events
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">
            Manage Tickets
          </h1>
          <p className="text-lg text-gray-600">
            For event: <span className="font-semibold">{eventName}</span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
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
                className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
              >
                {isAdding ? "Adding..." : "Add Ticket"}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Existing Tickets
          </h3>
          {tickets.length > 0 ? (
            <ul className="space-y-3">
              {tickets.map((ticket) => (
                <li
                  key={ticket.id}
                  className="p-4 border rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{ticket.name}</p>
                    <p className="text-sm text-gray-600">
                      ${parseFloat(ticket.price).toFixed(2)} -{" "}
                      {ticket.sold_quantity}/{ticket.total_quantity} sold
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
              No tickets have been created for this event.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketManagementPage;
