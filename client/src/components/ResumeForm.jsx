import React from "react";

const ResumeForm = ({ formData, setFormData, nextStep }) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form className="flex flex-col gap-4 p-4">
      <input name="name" placeholder="Full Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="phone" placeholder="Phone" onChange={handleChange} />
      <textarea name="education" placeholder="Education" onChange={handleChange} />
      <textarea name="experience" placeholder="Experience" onChange={handleChange} />
      <textarea name="skills" placeholder="Skills (comma separated)" onChange={handleChange} />
      <button type="button" onClick={nextStep} className="bg-blue-500 text-white px-4 py-2 rounded">
        Next: Pick Template
      </button>
    </form>
  );
};

export default ResumeForm;
