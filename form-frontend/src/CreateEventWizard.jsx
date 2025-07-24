import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EventDetailsForm from "./EventDetailsForm";
import TicketSetup from "./TicketSetup";
import CouponSetup from "./CouponSetup"; // <-- 1. Import the new component

const CreateEventWizard = () => {
  const [step, setStep] = useState(1);
  const [event, setEvent] = useState(null);
  const navigate = useNavigate();

  const handleDetailsSubmit = (createdEvent) => {
    setEvent(createdEvent);
    setStep(2);
  };

  const handleTicketSubmit = () => {
    setStep(3); // Move to step 3 (Coupons)
  };

  const handleCouponSubmit = () => {
    setStep(4); // Move to step 4 (Review & Publish)
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFinish = () => {
    alert("Event published successfully!");
    navigate("/dashboard/events");
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
      <div className="max-w-4xl mx-auto">
        {/* ... (The step indicator JSX is unchanged) ... */}

        <div>
          {step === 1 && <EventDetailsForm onNextStep={handleDetailsSubmit} />}
          {step === 2 && (
            <TicketSetup
              event={event}
              onNextStep={handleTicketSubmit}
              onPreviousStep={handlePreviousStep}
            />
          )}
          {/* --- 2. Render the CouponSetup component for Step 3 --- */}
          {step === 3 && (
            <CouponSetup
              event={event}
              onNextStep={handleCouponSubmit}
              onPreviousStep={handlePreviousStep}
            />
          )}
          {step === 4 && <div>Step 4: Review & Publish (Coming Next)</div>}
        </div>
      </div>
    </div>
  );
};

export default CreateEventWizard;
