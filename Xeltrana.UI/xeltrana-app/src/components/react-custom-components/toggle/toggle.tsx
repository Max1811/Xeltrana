import React from "react";
import "./toggle.css";

export interface ToggleOption {
  label: string;
  value: string;
}

interface ToggleProps {
  options: ToggleOption[];
  selected: string | null;
  onSelect: (value: string) => void;
}

const Toggle: React.FC<ToggleProps> = ({ options, selected, onSelect }) => {
  return (
    <div className="toggle-container">
      {options.map((option) => (
        <button
          key={option.value}
          className={`toggle-button ${
            selected === option.value ? "active" : ""
          }`}
          onClick={() => onSelect(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default Toggle;
