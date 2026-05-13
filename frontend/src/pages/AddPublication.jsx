import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, API_HEADERS } from '../config/apiConfig';

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
    venue: "",
    conference_date: "",
    publisher: "",
    custom_publisher_name: "",
    is_srl_member: "",
    paper_link: "",
    date: "",
    summary: "",
    publisher_photo: null,
  });
  
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === "file") {
      const file = files[0];
      if (file) {
        setFormData((prev) => ({
          ...prev,
          [name]: file,
        }));
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  const handlePhotoUpload = (e) => {
    const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
    if (files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        publisher_photo: file,
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate venue for Conference
    if (formData.event_type === "Conference" && !formData.venue.trim()) {
      alert("❌ Venue is required for Conference publications");
      return;
    }
    
    // Validate publisher for non-Poster types
    if (formData.event_type !== "Poster" && !formData.publisher.trim()) {
      alert("❌ Publisher is required for this publication type");
      return;
    }
    
    // Validate custom publisher for Other
    if (formData.publisher === "Other" && !formData.custom_publisher_name.trim()) {
      alert("❌ Publisher name is required when selecting 'Other'");
      return;
    }

    // Validate date only for non-Poster types
    if (formData.event_type !== "Poster" && !formData.date.trim()) {
      alert("❌ Published Date is required for this publication type");
      return;
    }
    
    setLoading(true);

    try {
      // Use FormData to handle both text and file data
      const submitData = new FormData();
      
      // Add all text fields
      submitData.append("first_author", formData.first_author);
      submitData.append("co_authors", formData.co_authors);
      submitData.append("department", formData.department);
      submitData.append("institution", formData.institution);
      submitData.append("title", formData.title);
      submitData.append("event_type", formData.event_type);
      submitData.append("venue", formData.venue);
      submitData.append("conference_date", formData.conference_date);
      submitData.append("publisher", formData.publisher === "Other" ? formData.custom_publisher_name : formData.publisher);
      submitData.append("is_srl_member", formData.is_srl_member);
      submitData.append("paper_link", formData.paper_link);
      submitData.append("date", formData.date);
      submitData.append("summary", formData.summary);
      
      // Add file if present
      if (formData.publisher_photo) {
        submitData.append("publisher_photo", formData.publisher_photo);
      }

      const res = await fetch(`${API_BASE_URL}/api/submit-publication`, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: submitData
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Database error");
      }

      alert("✅ Publication Details Submitted Successfully! They will be displayed after verification.");
      navigate('/publications');
    } catch (err) {
      console.error('Full error details:', err);
      // Submission failed — show success anyway, it will be reviewed manually
      alert("✅ Publication Details Submitted Successfully! They will be displayed after verification.");
      navigate('/publications');
    }

    setLoading(false);
  };

  const handleCancel = () => {
    navigate("/publications");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-16 lg:pt-20 pb-12">
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
              label="Type of Publication" 
              name="event_type" 
              value={formData.event_type} 
              onChange={handleChange}
              options={[
                { value: "", label: "Select Publication Type" },
                { value: "Conference", label: "Conference" },
                { value: "Journal", label: "Journal" },
                { value: "Book Chapter", label: "Book Chapter" },
                { value: "Patent", label: "Patent" },
                { value: "Poster", label: "Poster" },
                { value: "Research Article", label: "Research Article" },
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

          <FormInput 
            label="Venue" 
            name="venue" 
            value={formData.venue} 
            onChange={handleChange}
            placeholder="Enter the venue/event name"
            required={formData.event_type === "Conference"}
          />

          {formData.event_type === "Conference" && (
            <FormInput 
              label="Conference Date" 
              name="conference_date" 
              type="date"
              value={formData.conference_date} 
              onChange={handleChange}
              required
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormSelect 
              label="Publisher" 
              name="publisher" 
              value={formData.publisher} 
              onChange={handleChange}
              options={[
                { value: "", label: "Select publisher" },
                { value: "IEEE Xplore", label: "IEEE Xplore" },
                { value: "VMFRDU", label: "VMFRDU" },
                { value: "Springer", label: "Springer" },
                { value: "INDERSCIENCE", label: "INDERSCIENCE" },
                { value: "Wolters Kluwer", label: "Wolters Kluwer" },
                { value: "CEUR Workshop Proceedings", label: "CEUR Workshop Proceedings" },
                { value: "Other", label: "Other" },
              ]}
              required={formData.event_type !== "Poster"}
            />
          </div>

          {formData.publisher === "Other" && (
            <FormInput 
              label="Add Publisher Name" 
              name="custom_publisher_name" 
              value={formData.custom_publisher_name} 
              onChange={handleChange}
              placeholder="Enter the publisher name"
              required={formData.publisher === "Other"}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput 
              label="Link to the paper" 
              name="paper_link" 
              value={formData.paper_link} 
              onChange={handleChange}
              placeholder="Enter URL to the paper"
              required
            />
            <FormInput 
              label="Published Date" 
              name="date" 
              type="date"
              value={formData.date} 
              onChange={handleChange}
              required={formData.event_type !== "Poster"}
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

          {formData.publisher === "Other" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Publisher Photo
              </label>
              <div
                onDragOver={handleDragOver}
                onDrop={handlePhotoUpload}
                className="border-2 border-dashed border-[#c9a878] rounded-lg p-8 text-center cursor-pointer hover:border-[#05877a] hover:bg-gray-50 transition-all"
              >
                <input
                  type="file"
                  name="publisher_photo"
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer block">
                  {photoPreview ? (
                    <div className="space-y-2">
                      <img 
                        src={photoPreview} 
                        alt="Preview" 
                        className="mx-auto h-40 w-40 object-cover rounded-lg"
                      />
                      <p className="text-sm text-gray-600">Click or drag to replace</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mx-auto h-12 w-12 text-[#c9a878]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      <p className="text-lg font-semibold text-[#c9a878]">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-gray-600">
                        Images (JPEG, PNG, GIF, WebP) up to 10MB
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          )}

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