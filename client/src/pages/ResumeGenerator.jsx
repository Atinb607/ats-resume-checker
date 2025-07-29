import React, { useState, useRef } from "react";
import ResumeForm from "../components/ResumeForm";
import TemplatePicker from "../components/TemplatePicker";
import Modern from "../components/templates/Modern";
import Elegant from "../components/templates/Elegant";
import Compact from "../components/templates/Compact";
import Creative from "../components/templates/Creative";
import Classic from "../components/templates/Classic";
import html2pdf from "html2pdf.js";

const templateComponents = {
  modern: Modern,
  elegant: Elegant,
  compact: Compact,
  creative: Creative,
  classic: Classic,
};

const ResumeGenerator = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const resumeRef = useRef();

  const generatePDF = () => {
    html2pdf().from(resumeRef.current).save("My_Resume.pdf");
  };

  const Template = templateComponents[selectedTemplate];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {step === 1 && (
        <ResumeForm formData={formData} setFormData={setFormData} nextStep={() => setStep(2)} />
      )}
      {step === 2 && (
        <TemplatePicker
          selected={selectedTemplate}
          setSelected={setSelectedTemplate}
          nextStep={() => setStep(3)}
        />
      )}
      {step === 3 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Your Resume Preview</h2>
          <div ref={resumeRef} className="bg-white p-8 shadow-lg">
            <Template data={formData} />
          </div>
          <button
            onClick={generatePDF}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded"
          >
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default ResumeGenerator;
