import React, { useState } from "react";
import EventForm from "./EventForm";
import ParticipantList from "./ParticipantList";

function App() {
  const [view, setView] = useState("form"); // 'form' or 'list'
  const [currentParticipant, setCurrentParticipant] = useState(null);

  const handleViewParticipant = (participant) => {
    setCurrentParticipant(participant);
    setView("form");
  };

  const showForm = () => {
    setCurrentParticipant(null);
    setView("form");
  };

  // This is the new function to go back to the list
  const showList = () => {
    setView("list");
    setCurrentParticipant(null); // Clear any selected participant
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 to-slate-100 min-h-screen py-10">
      <div className="text-center mb-8">
        <button
          onClick={showForm}
          className={`px-6 py-2 mx-2 rounded-md font-semibold transition ${
            view === "form" && !currentParticipant
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700"
          }`}
        >
          Registration Form
        </button>
        <button
          onClick={showList}
          className={`px-6 py-2 mx-2 rounded-md font-semibold transition ${
            view === "list"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700"
          }`}
        >
          View Participants
        </button>
      </div>
      <main className="w-full max-w-4xl mx-auto p-4">
        {view === "form" ? (
          // Pass the new showList function as a prop
          <EventForm participant={currentParticipant} onBack={showList} />
        ) : (
          <ParticipantList onView={handleViewParticipant} />
        )}
      </main>
    </div>
  );
}

export default App;
