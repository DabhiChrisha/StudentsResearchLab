import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, API_HEADERS } from '../config/apiConfig';
import joinSrlImg from '../assets/Join SRL.png';

export default function JoinUs({ isModal = false, onClose }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const formTopRef = useRef(null);
  // Ref to imperatively reset the uncontrolled file input after submission
  const fileInputRef = useRef(null);

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
    research_expertise: "",
    published_research: "",
    ongoing_research: "",
    description: "",
    source: "Website",
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeFileName, setResumeFileName] = useState("");
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadedResumeLink, setUploadedResumeLink] = useState(null);

  const [submitStatus, setSubmitStatus] = useState({ type: null, message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('Field changed:', name, 'Value:', value);

    let processed = value;
    if (name === "contact") {
      processed = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processed,
    }));
  };

  const handleResumeChange = async (e) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      setResumeFile(null);
      setResumeFileName("");
      return;
    }
    
    setResumeFile(file);
    setResumeFileName(file.name);
    setSubmitStatus({ type: null, message: "" });

    const allowedTypes = ["application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      setSubmitStatus({ type: 'error', message: "Resume must be a PDF file." });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setSubmitStatus({ type: 'error', message: "Resume PDF size must be less than or equal to 10MB." });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setUploadingResume(true);
    setUploadedResumeLink(null);
    try {
      const payload = new FormData();
      payload.append("resume", file);
      
      const res = await fetch(`${API_BASE_URL}/api/upload-temp-resume`, {
        method: "POST",
        body: payload,
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setUploadedResumeLink(data.url);
      } else {
        setSubmitStatus({ type: 'error', message: data.detail || "Failed to upload resume." });
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (err) {
      setSubmitStatus({ type: 'error', message: "Network error during upload." });
      if (fileInputRef.current) fileInputRef.current.value = "";
    } finally {
      setUploadingResume(false);
    }
  };

  // Resets all form state including the uncontrolled file input element
  const resetForm = () => {
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
      research_expertise: "",
      published_research: "",
      ongoing_research: "",
      description: "",
      source: "Website",
    });
    setResumeFile(null);
    setResumeFileName("");
    setUploadingResume(false);
    setUploadedResumeLink(null);
    // Imperatively clear the native file input — React state alone cannot reset
    // uncontrolled file inputs; we must clear the DOM element's value directly.
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const validationErrors = [];

    if (!formData.name.trim()) validationErrors.push("Please enter your full name.");
    if (!formData.enrollment.trim()) validationErrors.push("Please enter your enrollment number.");
    if (!formData.semester) validationErrors.push("Please select your semester.");
    if (!formData.branch) validationErrors.push("Please select your branch.");
    if (!formData.department) validationErrors.push("Please select your department or course.");
    if (!formData.college) validationErrors.push("Please select your college.");
    if (!/^\d{10}$/.test(formData.contact)) validationErrors.push("Please enter a valid 10-digit contact number.");
    const trimmedEmail = formData.email.trim();
    if (!trimmedEmail || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmedEmail)) {
      validationErrors.push("Please enter a valid email address.");
    }
    if (!formData.batch.trim()) validationErrors.push("Please enter your batch.");
    if (!formData.after_ug) validationErrors.push("Please select what you want to pursue after UG.");
    if (!formData.cpi.trim()) validationErrors.push("Please enter your CPI till current semester.");
    if (!formData.ieee_member_2026) validationErrors.push("Please select whether you are an IEEE member in 2026.");
    if (!formData.ongoing_research) validationErrors.push("Please answer whether you have ongoing research.");
    if (!uploadedResumeLink) validationErrors.push("Please wait for your resume to finish uploading or select a valid PDF.");

    if (validationErrors.length > 0) {
      setSubmitStatus({ type: 'error', message: validationErrors[0] });
      setLoading(false);
      return;
    }

    try {
      const payload = new FormData();
      payload.append("name", formData.name.trim());
      payload.append("enrollment", formData.enrollment.trim());
      payload.append("semester", formData.semester);
      payload.append("division", formData.division);
      payload.append("branch", formData.branch);
      payload.append("department", formData.department);
      payload.append("college", formData.college);
      payload.append("contact", formData.contact);
      payload.append("email", formData.email.trim().toLowerCase());
      payload.append("batch", formData.batch.trim());
      payload.append("after_ug", formData.after_ug);
      payload.append("cpi", formData.cpi.trim());
      payload.append("ieee_member_2026", formData.ieee_member_2026);
      payload.append("ieee_membership", formData.ieee_membership.trim());
      payload.append("research_expertise", formData.research_expertise);
      payload.append("published_research", formData.published_research);
      payload.append("ongoing_research", formData.ongoing_research);
      payload.append("description", formData.description ? formData.description.trim() : "");
      payload.append("source", formData.source);
      payload.append("resume_link", uploadedResumeLink);

      const res = await fetch(`${API_BASE_URL}/api/join-us`, {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
        body: payload,
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        const errMessage = errorData.detail || errorData.message || "Submission failed";
        throw new Error(typeof errMessage === 'string' ? errMessage : JSON.stringify(errMessage));
      }

      const json = await res.json();
      const data = json.data;
      console.log('Success! Data inserted:', data);
      
      // Reset all form fields and clear the PDF file input
      resetForm();

      setSubmitStatus({ 
        type: 'success', 
        message: "Your application has been submitted successfully! We will review it and get back to you soon." 
      });

      // Scroll to top so the success message is visible briefly
      formTopRef.current?.scrollIntoView({ behavior: 'smooth' });

      // After a short delay, navigate to homepage (or close modal if in modal context)
      setTimeout(() => {
        if (isModal && typeof onClose === 'function') {
          onClose();
        } else {
          navigate("/");
        }
      }, 2500);

    } catch (err) {
      console.error('Full error details:', err);
      let errMsg = err.message || 'Unknown error occurred';
      
      if (errMsg.includes('duplicate key')) {
        errMsg = 'A record with this information already exists.';
      }

      setSubmitStatus({ 
        type: 'error', 
        message: errMsg 
      });
    }

    setLoadingText("");
    setLoading(false);
  };

  const handleCancel = () => {
    resetForm();
    setSubmitStatus({ type: null, message: "" });
    if (isModal && typeof onClose === 'function') {
      onClose();
    } else {
      navigate("/");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-12 lg:pt-16 pb-10" ref={formTopRef}>
      <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-7 md:p-9 relative">
        {/* Close Button — only shown when used as a standalone page, not inside JoinUsModal */}
        {!isModal && (
          <button
            onClick={handleCancel}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        {/* Header — only shown when used as a standalone page, not inside JoinUsModal
            (JoinUsModal renders its own header with the title and logo to avoid duplication) */}
        {!isModal && (
          <div className="flex flex-col items-center gap-6 sm:gap-8 mb-8 sm:mb-10 w-full py-2">
            <h2 className="text-5xl sm:text-6xl md:text-5xl font-bold text-[#05877a] text-center w-full tracking-tight leading-none">
              Join SRL
            </h2>
            <div className="w-full flex justify-center">
              <img
                src={joinSrlImg}
                alt="Join SRL Process"
                className="w-full max-w-[340px] sm:max-w-[450px] md:max-w-[550px] h-auto object-contain"
              />
            </div>
          </div>
        )}

        <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base text-center max-w-xl mx-auto">
          Fill out the form to join the Students Research Lab
        </p>

        {/* Status Messages */}
        {submitStatus.message && (
          <div className={`mb-8 p-4 rounded-xl flex items-center gap-3 ${
            submitStatus.type === 'success' 
              ? 'bg-green-50 border border-green-300 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            <span className="text-xl leading-none flex-shrink-0">
              {submitStatus.type === 'success' ? '❖' : '✖'}
            </span>
            <div className="flex-1 min-w-0">
              {submitStatus.type === 'success' && (
                <p className="font-bold text-green-900 mb-0.5">Application Submitted!</p>
              )}
              <p className="font-medium">{submitStatus.message}</p>
            </div>
          </div>
        )}

        {/* Important Instructions */}
        <div className="bg-blue-50 border-l-4 border-[#05877a] p-3.5 mb-5 rounded-md">
          <h3 className="text-md font-semibold text-[#05877a] mb-1.5">Important Note</h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-[#05877a] font-bold mt-1">•</span>
              <span><strong>Submission of this form is an application, not confirmation of membership.</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#05877a] font-bold mt-1">•</span>
              <span>Your application will be reviewed by Dr. Himani Trivedi, Head Students Research Lab, MMPSRPC, KSV.</span>
            </li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
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

          <div className="grid gap-4 md:grid-cols-2">
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
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
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
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormInput 
              label="Batch" 
              name="batch" 
              value={formData.batch} 
              onChange={handleChange}
              placeholder="e.g., 2022-2026"
              required
            />
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
          </div>

          

          <div className="grid gap-4 md:grid-cols-2">
            <FormInput
              label="CPI Till current sem"
              name="cpi"
              value={formData.cpi || ""}
              onChange={handleChange}
              placeholder="Enter your CPI till current semester"
              required
            />
            <FormInput
              label="IEEE Membership number"
              name="ieee_membership"
              value={formData.ieee_membership || ""}
              onChange={handleChange}
              placeholder="Enter your IEEE Membership number (if any)"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">IEEE Member in 2026? <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="ieee_member_2026" value="Yes" checked={formData.ieee_member_2026 === "Yes"} onChange={handleChange} required className="h-4 w-4 text-[#05877a] border-gray-300 focus:ring-[#05877a]" />
                  Yes
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="ieee_member_2026" value="No" checked={formData.ieee_member_2026 === "No"} onChange={handleChange} required className="h-4 w-4 text-[#05877a] border-gray-300 focus:ring-[#05877a]" />
                  No
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Upload Resume (.pdf)<span className="text-red-500">*</span></label>
              <div className="flex flex-col">
                {/* ref attached so we can imperatively reset the native file input after submission */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleResumeChange}
                  disabled={loading || uploadingResume}
                  className={`w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#05877a] file:text-white hover:file:bg-[#046b66] transition-all duration-300 ${loading || uploadingResume ? 'opacity-50 cursor-not-allowed' : ''}`}
                  required
                />
                {uploadingResume && (
                  <div className="flex items-center mt-3 bg-blue-50 border border-blue-100 p-2.5 rounded-lg">
                    <svg className="animate-spin h-5 w-5 text-[#05877a]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="ml-3 text-sm font-semibold text-[#05877a] animate-pulse">Uploading Resume...</span>
                  </div>
                )}
                {!uploadingResume && uploadedResumeLink && (
                  <div className="flex items-center mt-3 bg-green-50 border border-green-100 p-2.5 rounded-lg">
                    <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span className="ml-2 text-sm font-semibold text-green-700">Resume Uploaded Successfully!</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Research Expertise <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-3 gap-3">
                {['Beginner', 'Intermediate', 'Advance'].map((option) => (
                  <label key={option} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="research_expertise"
                      value={option}
                      checked={formData.research_expertise === option}
                      onChange={handleChange}
                      required
                      className="h-4 w-4 text-[#05877a] border-gray-300 focus:ring-[#05877a]"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Research Publication <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="published_research" value="Yes" checked={formData.published_research === "Yes"} onChange={handleChange} required className="h-4 w-4 text-[#05877a] border-gray-300 focus:ring-[#05877a]" />
                  Yes
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="published_research" value="No" checked={formData.published_research === "No"} onChange={handleChange} required className="h-4 w-4 text-[#05877a] border-gray-300 focus:ring-[#05877a]" />
                  No
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ongoing Research <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="ongoing_research" value="Yes" checked={formData.ongoing_research === "Yes"} onChange={handleChange} required className="h-4 w-4 text-[#05877a] border-gray-300 focus:ring-[#05877a]" />
                Yes
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="ongoing_research" value="No" checked={formData.ongoing_research === "No"} onChange={handleChange} required className="h-4 w-4 text-[#05877a] border-gray-300 focus:ring-[#05877a]" />
                No
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Brief Description
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Tell us briefly why you want to join SRL and what you hope to contribute or learn (optional)"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#05877a] focus:ring-2 focus:ring-[#05877a]/20 transition-all resize-none"
            />
          </div>

          {/* College - Row 4 */}
          <FormSelect
            label="College Name"
            name="college"
            value={formData.college}
            onChange={handleChange}
            options={[
              { value: "", label: "Select College" },
              { value: "LDRP Institute of Technology and Research", label: "LDRP Institute of Technology and Research" },
              { value: "Vidush Somany Institute of Technology and Research", label: "Vidush Somany Institute of Technology and Research" },
            ]}
            required
          />

          {/* Contact and Email - Row 5 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Contact Number"
              name="contact"
              type="tel"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Enter 10-digit contact number"
              required
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit contact number"
              maxLength={10}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2.5">
            <button
              type="submit"
              disabled={loading || uploadingResume}
              className="bg-[#05877a] text-white font-semibold py-2.5 px-5 rounded-lg hover:bg-[#046b66] transition-colors duration-300 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? "Submitting..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="border-2 border-gray-300 text-gray-700 font-semibold py-2.5 px-5 rounded-lg hover:bg-gray-50 transition-colors duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormInput({ label, name, type = "text", value, onChange, placeholder, required = false, ...rest }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
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
        {...rest}
      />
    </div>
  );
}

function FormSelect({ label, name, value, onChange, options, required = false }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
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