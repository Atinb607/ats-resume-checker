import React from "react";

const templates = ["modern", "elegant", "compact", "creative", "classic"];

const TemplatePicker = ({ selected, setSelected, nextStep }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Choose Your Template</h2>
      <div className="grid grid-cols-2 gap-4">
        {templates.map((template) => (
          <div
            key={template}
            onClick={() => setSelected(template)}
            className={`border p-4 cursor-pointer rounded-lg ${
              selected === template ? "border-blue-500 bg-blue-100" : ""
            }`}
          >
            <p className="capitalize font-semibold">{template} Template</p>
          </div>
        ))}
      </div>
      <button
        onClick={nextStep}
        className="mt-6 bg-green-500 text-white px-4 py-2 rounded"
      >
        Generate Resume
      </button>
    </div>
  );
};

export default TemplatePicker;
