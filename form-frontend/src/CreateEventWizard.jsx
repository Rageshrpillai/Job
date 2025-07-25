import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EventDetailsForm from "./EventDetailsForm";
import TicketSetup from "./TicketSetup";
import CouponSetup from "./CouponSetup";

const CreateEventWizard = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { number: 1, name: "Event Details" },
    { number: 2, name: "Ticket Setup" },
    { number: 3, name: "Coupon Setup" },
  ];

  const handleFinish = () => {
    // Navigate to the main events page after finishing the wizard
    navigate("/dashboard/events");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <EventDetailsForm
            eventId={eventId}
            onNext={() => setCurrentStep(2)}
          />
        );
      case 2:
        return (
          <TicketSetup
            eventId={eventId}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        );
      case 3:
        // The last step will have a finish button instead of a next button
        return (
          <CouponSetup
            eventId={eventId}
            onBack={() => setCurrentStep(2)}
            onFinish={handleFinish}
          />
        );
      default:
        return (
          <EventDetailsForm
            eventId={eventId}
            onNext={() => setCurrentStep(2)}
          />
        );
    }
  };

  return (
    <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-lg max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Complete Your Event Setup
      </h1>
      <p className="text-gray-600 mb-8">
        Follow the steps below to get your event ready for attendees.
      </p>

      {/* Stepper Navigation */}
      <div className="flex items-center justify-center mb-10">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                  currentStep >= step.number
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step.number}
              </div>
              <p
                className={`mt-2 text-sm font-medium ${
                  currentStep >= step.number
                    ? "text-indigo-600"
                    : "text-gray-500"
                }`}
              >
                {step.name}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-auto border-t-2 mx-4 ${
                  currentStep > step.number
                    ? "border-indigo-600"
                    : "border-gray-200"
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Render Current Step Component */}
      <div className="mt-8">{renderStep()}</div>
    </div>
  );
};

export default CreateEventWizard;
