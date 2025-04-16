import React, { useState } from "react";

const TimeSlotSelector = ({ availableSlots, onSelect }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleSelect = (slot) => {
    setSelectedSlot(slot);
    onSelect(slot);
  };

  return (
    <div>
      <h3>Select a Time Slot</h3>
      <ul>
        {availableSlots.map((slot, index) => (
          <li key={index}>
            <button
              onClick={() => handleSelect(slot)}
              style={{
                padding: "10px",
                margin: "5px",
                backgroundColor: selectedSlot === slot ? "#4CAF50" : "#ddd",
                border: "none",
                cursor: "pointer",
              }}
            >
              {slot}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TimeSlotSelector;
