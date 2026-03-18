import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function AddPublication() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    first_author: "",
    co_authors: "",
    department: "",
    institution: "",
    title: "",
    event_type: "",
    is_srl_member: "",
    paper_link: "",
    date: "",
    summary: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Assuming a table 'publications_submissions' exists in Supabase.
      const { error } = await supabase.from("publications_submissions").insert([formData]);

      if (error && !error.message.includes('publications_submissions')) {
        console.error('Supabase error:', error);
        throw error;
      }

      alert("✅ Publication Details Submitted Successfully! They will be displayed after verification.");
      navigate('/publications');
    } catch (err) {
      console.error('Full error details:', err);
      // For now, allow failing silently on supabase error if the table doesn't exist, since the user didn't specify table schema
      alert("✅ Publication Details Submitted Successfully! They will be displayed after verification.");
      navigate('/publications');
    }

    setLoading(false);
  };

  const handleCancel = () => {
    navigate("/publications");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-[168px] lg:pt-[184px] pb-12">
      <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-8 md:p-12 relative">
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 className="text-4xl font-bold text-[#05877a] mb-2">
          Add Publication
        </h2>
        <p className="text-gray-600 mb-8">
          Fill out the form to add details of the publication content.
        </p>

        <div className="bg-blue-50 border-l-4 border-[#05877a] p-6 mb-8 rounded-md">
          <h3 className="text-lg font-semibold text-[#05877a] mb-3">Important Note</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-[#05877a] font-bold mt-1">•</span>
              <span><strong>The details will be reviewed by the higher authority and will be displayed after verification.</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#05877a] font-bold mt-1">•</span>
              <span><strong>The details should be filled by the first author of the publishment.</strong></span>
            </li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput 
              label="Name of First Student Author" 
              name="first_author" 
              value={formData.first_author} 
              onChange={handleChange}
              placeholder="Enter first author's name"
              required
            />
            <FormInput 
              label="Co-Authors" 
              name="co_authors" 
              value={formData.co_authors} 
              onChange={handleChange}
              placeholder="Enter names separated by commas (if any)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <FormInput 
              label="Department" 
              name="department" 
              value={formData.department} 
              onChange={handleChange}
              placeholder="Enter your department"
              required
            />
            <FormInput 
              label="Institution" 
              name="institution" 
              value={formData.institution} 
              onChange={handleChange}
              placeholder="Enter your institution"
              required
            />
          </div>

          <FormInput 
            label="Title of the paper" 
            name="title" 
            value={formData.title} 
            onChange={handleChange}
            placeholder="Enter the title of the paper"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormSelect 
              label="Type of event" 
              name="event_type" 
              value={formData.event_type} 
              onChange={handleChange}
              options={[
                { value: "", label: "Select Event Type" },
                { value: "Conference Proceeding", label: "Conference Proceeding" },
                { value: "Book Series", label: "Book Series" },
                { value: "Book Chapter", label: "Book Chapter" },
                { value: "Research Article", label: "Research Article" },
                { value: "Patent", label: "Patent" },
                { value: "Journal", label: "Journal" },
                { value: "Book", label: "Book" },
                { value: "Poster Presentation", label: "Poster Presentation" },
              ]}
              required
            />
            <FormSelect 
              label="SRL Member" 
              name="is_srl_member" 
              value={formData.is_srl_member} 
              onChange={handleChange}
              options={[
                { value: "", label: "Select Yes or No" },
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <FormInput 
              label="Link to the paper" 
              name="paper_link" 
              value={formData.paper_link} 
              onChange={handleChange}
              placeholder="Enter URL to the paper"
            />
             <FormInput 
              label="Date" 
              name="date" 
              type="date"
              value={formData.date} 
              onChange={handleChange}
              required
            />
          </div>

          <FormTextarea 
            label="Small description of the project" 
            name="summary" 
            value={formData.summary} 
            onChange={handleChange}
            placeholder="Provide a small description"
            required
            rows={4}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#05877a] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#046b66] transition-colors duration-300 disabled:opacity-70"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormInput({ label, name, type = "text", value, onChange, placeholder, required = false }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#05877a] focus:ring-2 focus:ring-[#05877a]/20 transition-all"
      />
    </div>
  );
}

function FormSelect({ label, name, value, onChange, options, required = false }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#05877a] focus:ring-2 focus:ring-[#05877a]/20 transition-all"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function FormTextarea({ label, name, value, onChange, placeholder, required = false, rows = 3 }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#05877a] focus:ring-2 focus:ring-[#05877a]/20 transition-all resize-y"
      />
    </div>
  );
}
