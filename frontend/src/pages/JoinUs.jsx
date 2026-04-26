import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, API_HEADERS } from '../config/apiConfig';
import joinSrlImg from '../assets/Join SRL.png';

export default function JoinUs() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const formTopRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    enrollment: "",
    semester: "",
    division: "",
    branch: "",
    department: "",
    college: "",
    contact: "",
    email: "",
    batch: "",
    after_ug: "",
    cpi: "",
    ieee_member_2026: "",
    ieee_membership: "",
    resume_link: "",
    research_expertise: [],
    published_research: "",
    ongoing_research: "",
    source: "Website",
  });

  const [submitStatus, setSubmitStatus] = useState({ type: null, message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('Field changed:', name, 'Value:', value);

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log('Form data being submitted:', formData);

    try {
      const res = await fetch(`${API_BASE_URL}/api/join-us`, {
        method: "POST",
        headers: { ...API_HEADERS },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        const errMessage = errorData.detail?.message || errorData.detail || "Database error";
        throw new Error(typeof errMessage === 'string' ? errMessage : JSON.stringify(errMessage));
      }

      const json = await res.json();
      const data = json.data;
      console.log('Success! Data inserted:', data);
      
      setFormData({
        name: "",
        enrollment: "",
        semester: "",
        division: "",
        branch: "",
        department: "",
        college: "",
        contact: "",
        email: "",
        batch: "",
        after_ug: "",
        cpi: "",
        ieee_member_2026: "",
        ieee_membership: "",
        resume_link: "",
        research_expertise: [],
        published_research: "",
        ongoing_research: "",
        source: "Website",
      });

      setSubmitStatus({ 
        type: 'success', 
        message: "Your application has been submitted successfully! We will review it and get back to you soon." 
      });

      // Scroll to top so the success message is visible
      formTopRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('Full error details:', err);
      let errMsg = err.message || 'Unknown error occurred';
      
      if (errMsg.includes('unique_enrollment')) {
        errMsg = 'This enrollment number is already registered.';
      } else if (errMsg.includes('duplicate key')) {
        errMsg = 'A record with this information already exists.';
      }

      setSubmitStatus({ 
        type: 'error', 
        message: `❌ Error: ${errMsg}` 
      });
    }

    setLoading(false);
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      enrollment: "",
      semester: "",
      division: "",
      branch: "",
      department: "",
      college: "",
      contact: "",
      email: "",
      batch: "",
      after_ug: "",
      cpi: "",
      ieee_member_2026: "",
      ieee_membership: "",
      resume_link: "",
      research_expertise: [],
      published_research: "",
      ongoing_research: "",
      source: "Website",
    });
    setSubmitStatus({ type: null, message: "" });
    navigate("/");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-16 lg:pt-20 pb-12" ref={formTopRef}>
      <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-8 md:p-12 relative">
        {/* Close Button */}
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-2">
          <h2 className="text-4xl font-bold text-[#05877a]">
            Join SRL
          </h2>
          <img src={joinSrlImg} alt="Join SRL Process" className="h-16 sm:h-20 md:h-24 w-auto object-contain" />
        </div>
        <p className="text-gray-600 mb-8">
          Fill out the form to join the Students Research Lab
        </p>

        {/* Status Messages */}
        {submitStatus.message && (
          <div className={`mb-8 p-4 rounded-xl flex items-start gap-3 ${
            submitStatus.type === 'success' 
              ? 'bg-green-50 border border-green-300 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            <span className="text-2xl mt-0.5">
              {submitStatus.type === 'success' ? '✅' : '❌'}
            </span>
            <div>
              {submitStatus.type === 'success' && (
                <p className="font-bold text-green-900 mb-1">Application Submitted!</p>
              )}
              <p className="font-medium">{submitStatus.message}</p>
            </div>
          </div>
        )}

        {/* Important Instructions */}
        <div className="bg-blue-50 border-l-4 border-[#05877a] p-6 mb-8 rounded-md">
          <h3 className="text-lg font-semibold text-[#05877a] mb-3">Important Note</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-[#05877a] font-bold mt-1">•</span>
              <span><strong>Submission of this form will be considered as an application and does not constitute confirmation of being SRL Member</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#05877a] font-bold mt-1">•</span>
              <span><strong>This form only shows that you are interested in joining SRL.</strong> Your application will be reviewed by Dr. Himani Trivedi, Head Students Research Lab, MMPSRPC, KSV.</span>
            </li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Name and Enrollment - Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput 
              label="Name of Student" 
              name="name" 
              value={formData.name} 
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
            <FormInput 
              label="Enrollment Number" 
              name="enrollment" 
              value={formData.enrollment} 
              onChange={handleChange}
              placeholder="Enter your enrollment number"
              required
            />
          </div>

          {/* Semester and Division - Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormSelect 
              label="Semester" 
              name="semester" 
              value={formData.semester} 
              onChange={handleChange}
              options={[
                { value: "", label: "Select Semester" },
                { value: "1", label: "1st Semester" },
                { value: "2", label: "2nd Semester" },
                { value: "3", label: "3rd Semester" },
                { value: "4", label: "4th Semester" },
                { value: "5", label: "5th Semester" },
                { value: "6", label: "6th Semester" },
                { value: "7", label: "7th Semester" },
                { value: "8", label: "8th Semester" },
              ]}
              required
            />
            <FormSelect 
              label="Division" 
              name="division" 
              value={formData.division} 
              onChange={handleChange}
              options={[
                { value: "", label: "Select Division" },
                { value: "A", label: "Division A" },
                { value: "B", label: "Division B" },
                { value: "C", label: "Division C" },
                { value: "D", label: "Division D" },
                { value: "E", label: "Division E" },
                { value: "F", label: "Division F" },
                { value: "G", label: "Division G" },
                { value: "I", label: "Division I" },
                { value: "J", label: "Division J" },
                { value: "K", label: "Division K" },
                { value: "P", label: "Division P" },
                { value: "Q", label: "Division Q" },
              ]}
              required
            />
          </div>

          {/* Branch and Batch - Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormSelect 
              label="Branch" 
              name="branch" 
              value={formData.branch} 
              onChange={handleChange}
              options={[
                { value: "", label: "Select Branch" },
                { value: "CE", label: "Computer Engineering" },
                { value: "CSE", label: "Computer Science Engineering" },
                { value: "IT", label: "Information Technology" },
                { value: "ECE", label: "Electronics & Communication Engineering" },
                { value: "EEE", label: "Electrical Engineering" },
                { value: "MECH", label: "Mechanical Engineering" },
                { value: "CIVIL", label: "Civil Engineering" },
              ]}
              required
            />

            {/* Department/Course Name Dropdown */}
            <FormSelect
              label="Department/Course Name"
              name="department"
              value={formData.department || ""}
              onChange={handleChange}
              options={[
                { value: "", label: "Select Department/Course" },
                { value: "CE", label: "CE" },
                { value: "IT", label: "IT" },
                { value: "CSE", label: "CSE" },
                { value: "EC", label: "EC" },
              ]}
              required
            />
            <FormInput 
              label="Batch" 
              name="batch" 
              value={formData.batch} 
              onChange={handleChange}
              placeholder="e.g., 2022-2026"
              required
            />

            {/* What do you want to pursue after UG Dropdown */}
            <FormSelect
              label="What do you want to pursue after UG"
              name="after_ug"
              value={formData.after_ug || ""}
              onChange={handleChange}
              options={[
                { value: "", label: "Select Option" },
                { value: "MTech", label: "MTech" },
                { value: "MBA", label: "MBA" },
                { value: "MCA", label: "MCA" },
                { value: "PhD", label: "PhD" },
                { value: "Masters in Abroad", label: "Masters in Abroad" },
                { value: "Other", label: "Other" },
              ]}
              required
            />


            {/* CPI Till current sem */}
            <FormInput
              label="CPI Till current sem"
              name="cpi"
              value={formData.cpi || ""}
              onChange={handleChange}
              placeholder="Enter your CPI till current semester"
              required
            />

            {/* Are you an IEEE Member in year 2026? Checkbox group */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Are you an IEEE Member in year 2026? <span className="text-red-500">*</span></label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input type="radio" name="ieee_member_2026" value="Yes" checked={formData.ieee_member_2026 === "Yes"} onChange={handleChange} required />
                  Yes
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="ieee_member_2026" value="No" checked={formData.ieee_member_2026 === "No"} onChange={handleChange} required />
                  No
                </label>
              </div>
            </div>

            {/* IEEE Membership number */}
            <FormInput
              label="IEEE Membership number"
              name="ieee_membership"
              value={formData.ieee_membership || ""}
              onChange={handleChange}
              placeholder="Enter your IEEE Membership number (if any)"
            />

            {/* Resume/CV Drive Link */}
            <FormInput
              label="Drive link to your Resume/CV (The access of file shall be Anyone with the link can view)"
              name="resume_link"
              value={formData.resume_link || ""}
              onChange={handleChange}
              placeholder="Paste your Google Drive link here"
              required
            />

            {/* Research Publication Radio */}
            <div className="space-y-2">
                        {/* Research Expertise Checkbox Group */}
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Research Expertise <span className="text-red-500">*</span></label>
                          <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-2">
                              <input type="checkbox" name="research_expertise" value="Beginner" checked={Array.isArray(formData.research_expertise) && formData.research_expertise.includes('Beginner')} onChange={e => {
                                const checked = e.target.checked;
                                const value = e.target.value;
                                setFormData(prev => {
                                  let arr = Array.isArray(prev.research_expertise) ? [...prev.research_expertise] : [];
                                  if (checked) {
                                    arr.push(value);
                                  } else {
                                    arr = arr.filter(v => v !== value);
                                  }
                                  return { ...prev, research_expertise: arr };
                                });
                              }} required={!(Array.isArray(formData.research_expertise) && formData.research_expertise.length > 0)} />
                              Beginner
                            </label>
                            <label className="flex items-center gap-2">
                              <input type="checkbox" name="research_expertise" value="Intermediate" checked={Array.isArray(formData.research_expertise) && formData.research_expertise.includes('Intermediate')} onChange={e => {
                                const checked = e.target.checked;
                                const value = e.target.value;
                                setFormData(prev => {
                                  let arr = Array.isArray(prev.research_expertise) ? [...prev.research_expertise] : [];
                                  if (checked) {
                                    arr.push(value);
                                  } else {
                                    arr = arr.filter(v => v !== value);
                                  }
                                  return { ...prev, research_expertise: arr };
                                });
                              }} required={!(Array.isArray(formData.research_expertise) && formData.research_expertise.length > 0)} />
                              Intermediate
                            </label>
                            <label className="flex items-center gap-2">
                              <input type="checkbox" name="research_expertise" value="Advance" checked={Array.isArray(formData.research_expertise) && formData.research_expertise.includes('Advance')} onChange={e => {
                                const checked = e.target.checked;
                                const value = e.target.value;
                                setFormData(prev => {
                                  let arr = Array.isArray(prev.research_expertise) ? [...prev.research_expertise] : [];
                                  if (checked) {
                                    arr.push(value);
                                  } else {
                                    arr = arr.filter(v => v !== value);
                                  }
                                  return { ...prev, research_expertise: arr };
                                });
                              }} required={!(Array.isArray(formData.research_expertise) && formData.research_expertise.length > 0)} />
                              Advance
                            </label>
                          </div>
                        </div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Have you published any research publication yet? <span className="text-red-500">*</span></label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input type="radio" name="published_research" value="Yes" checked={formData.published_research === "Yes"} onChange={handleChange} required />
                  Yes
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="published_research" value="No" checked={formData.published_research === "No"} onChange={handleChange} required />
                  No
                </label>
              </div>
            </div>

            {/* Ongoing Research Radio */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Is there any research work ongoing? <span className="text-red-500">*</span></label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input type="radio" name="ongoing_research" value="Yes" checked={formData.ongoing_research === "Yes"} onChange={handleChange} required />
                  Yes
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="ongoing_research" value="No" checked={formData.ongoing_research === "No"} onChange={handleChange} required />
                  No
                </label>
              </div>
            </div>

            
          </div>

          {/* College - Row 4 */}
          <FormSelect
            label="College Name"
            name="college"
            value={formData.college}
            onChange={handleChange}
            options={[
              { value: "", label: "Select College" },
              { value: "L.D.R.P. Institute of Technology and Research", label: "L.D.R.P. Institute of Technology and Research" },
              { value: "Vidush Somany Institute of Technology and Research", label: "Vidush Somany Institute of Technology and Research" },
            ]}
            required
          />

          {/* Contact and Email - Row 5 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput 
              label="Contact Number" 
              name="contact" 
              value={formData.contact} 
              onChange={handleChange}
              placeholder="Enter your contact number"
              required
            />
			<FormInput 
              label="Email ID" 
              name="email" 
              type="email"
              value={formData.email} 
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Buttons - Row 6 */}
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
