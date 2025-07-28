import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";
import AddEvent from "./AddEvent";
import EventFormModal from "./EventFormModal";
import PreviewEventModal from "./PreviewEventModal";

const ManageEvents = ({ filter }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewingEvent, setPreviewingEvent] = useState(null);
  const navigate = useNavigate();

  const fetchEvents = () => {
    setLoading(true);
    api
      .get("/api/events", { params: { filter } }) // ✅ pass filter as query param
      .then((response) => {
        setEvents(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setEvents([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, [filter]); // This can stay, it won't cause issues

  const handleDelete = (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      api
        .delete(`/api/events/${eventId}`)
        .then(() => {
          alert("Event deleted successfully!");
          fetchEvents();
        })
        .catch((error) => alert("Failed to delete event."));
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setIsFormModalOpen(true);
  };

  const handlePreview = (event) => {
    setPreviewingEvent(event);
    setIsPreviewModalOpen(true);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const onFormSubmit = () => {
    setIsFormModalOpen(false);
    fetchEvents();
  };

  if (loading)
    return <div className="text-center py-10">Loading events...</div>;

  return (
    <>
      <div className="bg-white p-6 rounded-b-2xl rounded-tr-2xl shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Start Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {events.length > 0 ? (
                events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {event.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(event.start_time).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full capitalize ${
                          event.status === "draft"
                            ? "bg-gray-200 text-gray-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handlePreview(event)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => handleEdit(event)}
                        className="text-green-600 hover:text-green-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleNavigate(
                            `/dashboard/events/${event.id}/tickets`
                          )
                        }
                        className="text-orange-600 hover:text-orange-800"
                      >
                        Tickets
                      </button>
                      <button
                        onClick={() =>
                          handleNavigate(
                            `/dashboard/events/${event.id}/coupons`
                          )
                        }
                        className="text-purple-600 hover:text-purple-800"
                      >
                        Coupons
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-gray-500">
                    You have not created any events yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <EventFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmitSuccess={onFormSubmit}
        eventData={editingEvent}
      />
      <PreviewEventModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        event={previewingEvent}
      />
    </>
  );
};

const EventManagementPage = () => {
  const [activeTab, setActiveTab] = useState("manage");
  // Filter state is kept for future use but doesn't affect the API call for now.
  const [filter, setFilter] = useState("all");

  const baseTabStyles =
    "py-3 px-6 font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
  const activeTabStyles =
    "border-b-4 border-blue-600 text-blue-600 bg-white rounded-t-lg";
  const inactiveTabStyles =
    "text-gray-500 hover:text-gray-800 border-b-4 border-transparent";

  const getFilterButtonClass = (buttonFilter) => {
    return filter === buttonFilter
      ? "bg-indigo-600 text-white"
      : "bg-white text-gray-700 hover:bg-gray-50";
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("manage")}
            className={`${baseTabStyles} ${
              activeTab === "manage" ? activeTabStyles : inactiveTabStyles
            }`}
          >
            Manage Events
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className={`${baseTabStyles} ${
              activeTab === "add" ? activeTabStyles : inactiveTabStyles
            }`}
          >
            Add New Event
          </button>
        </div>

        {activeTab === "manage" && (
          <div className="pt-6 pb-4 bg-white px-6 rounded-tr-2xl">
            <div className="flex space-x-3">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 text-sm font-semibold rounded-full shadow-sm border border-gray-300 ${getFilterButtonClass(
                  "all"
                )}`}
              >
                All Events
              </button>
              <button
                onClick={() => setFilter("upcoming")}
                className={`px-4 py-2 text-sm font-semibold rounded-full shadow-sm border border-gray-300 ${getFilterButtonClass(
                  "upcoming"
                )}`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setFilter("current")}
                className={`px-4 py-2 text-sm font-semibold rounded-full shadow-sm border border-gray-300 ${getFilterButtonClass(
                  "current"
                )}`}
              >
                Current
              </button>
              <button
                onClick={() => setFilter("past")}
                className={`px-4 py-2 text-sm font-semibold rounded-full shadow-sm border border-gray-300 ${getFilterButtonClass(
                  "past"
                )}`}
              >
                Past
              </button>
              <button
                onClick={() => setFilter("drafted")}
                className={`px-4 py-2 text-sm font-semibold rounded-full shadow-sm border border-gray-300 ${getFilterButtonClass(
                  "drafted"
                )}`}
              >
                Drafts
              </button>
            </div>
          </div>
        )}

        <div className={activeTab === "manage" ? "mt-[-1px]" : ""}>
          {activeTab === "manage" ? (
            <ManageEvents filter={filter} />
          ) : (
            <AddEvent />
          )}
        </div>
      </div>
    </div>
  );
};

export default EventManagementPage;
