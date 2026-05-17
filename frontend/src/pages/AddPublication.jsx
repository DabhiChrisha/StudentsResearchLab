import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from '../config/apiConfig';

// Mirrors admin portal's URL validator — accepts with or without protocol
const isValidUrl = (value) => {
  const urlRegex = /^(https?:\/\/)?(([\w-]+\.)+[\w-]{2,})(\/[\w\-./?%&=#]*)?$/i;
  return urlRegex.test(value.trim());
};

const todayDate = new Date();
todayDate.setHours(0, 0, 0, 0);
const todayStr = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, "0")}-${String(todayDate.getDate()).padStart(2, "0")}`; // Local YYYY-MM-DD for date inputs

export default function AddPublication() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
    is_srl_member: "",
    paper_link: "",
    date: "",
    summary: "",
  });

  // Publisher logo state — mirrors admin portal's Publications.tsx
  const [publishers, setPublishers] = useState([]);
  const [publisherLogoId, setPublisherLogoId] = useState(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState(null);
  const [isLogoLoading, setIsLogoLoading] = useState(false);
  const [showOtherFields, setShowOtherFields] = useState(false);
  const [customPublisher, setCustomPublisher] = useState("");
  const [customLogoFile, setCustomLogoFile] = useState(null);
  const [logoError, setLogoError] = useState(null);
  const customLogoInputRef = useRef(null);

  const isPublisherRequired = formData.event_type !== "Poster";
  const isConferenceVenueRequired = formData.event_type === "Conference";
  const isPosterType = formData.event_type === "Poster";
  const isJournalType = formData.event_type === "Journal";
  const isBookChapterType = formData.event_type === "Book Chapter";
  const isPatentType = formData.event_type === "Patent";

  const dateFieldLabel = (() => {
    if (isConferenceVenueRequired) return "Conference Date";
    if (isPosterType) return "Presented On";
    if (isJournalType || isBookChapterType) return "Published Date";
    if (isPatentType) return "Patent Date";
    return "Date";
  })();

  useEffect(() => {
    fetchPublishers();
  }, []);

  const fetchPublishers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/publication-symbol`);
      const data = await res.json();
      if (data.success) setPublishers(data.data);
    } catch {
      // fallback to empty list
    }
  };

  const handlePublisherSelect = (publisherName) => {
    setPublisherLogoId(null);
    setLogoPreviewUrl(null);
    setLogoError(null);
    setCustomPublisher("");
    setCustomLogoFile(null);
    clearError("publisher");
    clearError("customPublisher");
    clearError("logo");

    if (publisherName === "Other") {
      setShowOtherFields(true);
      return;
    }

    setShowOtherFields(false);
    if (!publisherName) return;

    const selected = publishers.find((p) => p.publisher_name === publisherName);
    if (selected) {
      setPublisherLogoId(selected.id);
      setLogoPreviewUrl(selected.logo_url || null);
      if (!selected.logo_url) setLogoError("No logo available for this publisher.");
    }
  };

  const handleCustomLogoUpload = async (file) => {
    if (!file) return;

    // Show instant local preview so the user sees the image immediately,
    // before the Cloudinary upload round-trip completes.
    const localUrl = URL.createObjectURL(file);
    setLogoPreviewUrl(localUrl);
    setCustomLogoFile(file);

    if (!customPublisher.trim()) return; // preview shown; upload deferred until name is typed

    try {
      setIsLogoLoading(true);
      setLogoError(null);
      const fd = new FormData();
      fd.append("publisher_name", customPublisher.trim());
      fd.append("logo", file);
      const res = await fetch(`${API_BASE_URL}/api/publication-symbol/upload-public`, {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Upload failed");
      }
      const data = await res.json();
      URL.revokeObjectURL(localUrl);
      setPublisherLogoId(data.symbol_id ?? data.id ?? null);
      setLogoPreviewUrl(data.logo_url || null);
      clearError("logo");
    } catch (err) {
      URL.revokeObjectURL(localUrl);
      setLogoPreviewUrl(null);
      const msg = err.message || "";
      setLogoError(
        msg.includes("502") ? "Logo upload failed. Please try again." : msg || "Upload failed."
      );
    } finally {
      setIsLogoLoading(false);
    }
  };

  const resetLogoState = () => {
    setPublisherLogoId(null);
    setLogoPreviewUrl(null);
    setIsLogoLoading(false);
    setShowOtherFields(false);
    setCustomPublisher("");
    setCustomLogoFile(null);
    setLogoError(null);
  };

  const clearError = (field) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "publisher") {
      setFormData((prev) => ({ ...prev, publisher: value }));
      handlePublisherSelect(value);
      return;
    }

    // Clear the error for this field as soon as the user edits it
    clearError(name);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    setCustomLogoFile(file);
    handleCustomLogoUpload(file);
  };

  // ── Validation — mirrors admin portal's handleAddPublication checks ───────────
  const validate = () => {
    const errs = {};

    if (!formData.first_author.trim())
      errs.first_author = "First author name is required.";

    if (!formData.department.trim())
      errs.department = "Department is required.";

    if (!formData.institution.trim())
      errs.institution = "Institution is required.";

    if (!formData.title.trim())
      errs.title = "Title is required.";

    if (!formData.event_type)
      errs.event_type = "Type of Publication is required.";

    if (!formData.is_srl_member)
      errs.is_srl_member = "Please select whether you are an SRL member.";

    // Venue required for Conference
    if (isConferenceVenueRequired && !formData.venue.trim())
      errs.venue = "Venue is required for Conference publications.";

    // Conference Date: required + no future dates
    if (isConferenceVenueRequired) {
      if (!formData.conference_date) {
        errs.conference_date = "Conference Date is required.";
      } else {
        const confDate = new Date(formData.conference_date);
        confDate.setHours(0, 0, 0, 0);
        if (confDate > todayDate)
          errs.conference_date = "Conference Date cannot be a future date.";
      }
    }

    // Publisher required for non-Poster
    if (isPublisherRequired && !formData.publisher)
      errs.publisher = "Publisher is required.";

    // Custom publisher name required when Other
    if (showOtherFields && !customPublisher.trim())
      errs.customPublisher = "Publisher name is required.";

    // Custom logo must be uploaded
    if (showOtherFields && customPublisher.trim() && publisherLogoId === null)
      errs.logo = "Please upload a logo for your custom publisher.";

    // Link to paper: required + valid URL
    if (!formData.paper_link.trim()) {
      errs.paper_link = "Link to the paper is required.";
    } else if (!isValidUrl(formData.paper_link)) {
      errs.paper_link = "Please enter a valid URL (e.g. https://example.com).";
    }

    // Published Date: required for non-Poster + no future dates
    if (isPublisherRequired) {
      if (!formData.date) {
        errs.date = "Published Date is required.";
      } else {
        const pubDate = new Date(formData.date);
        pubDate.setHours(0, 0, 0, 0);
        if (pubDate > todayDate)
          errs.date = "Published Date cannot be a future date.";
      }
    }

    if (!formData.summary.trim())
      errs.summary = "A short description is required.";

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Logo still uploading
    if (isLogoLoading) {
      setErrors({ logo: "Publisher logo is still uploading. Please wait." });
      return;
    }

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      // Scroll to the first visible error element
      setTimeout(() => {
        const el = document.querySelector("[data-field-error]");
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const payload = {
        first_author: formData.first_author,
        co_authors: formData.co_authors,
        department: formData.department,
        institution: formData.institution,
        title: formData.title,
        event_type: formData.event_type,
        venue: formData.venue,
        conference_date: isConferenceVenueRequired ? formData.conference_date : "",
        publisher: showOtherFields ? customPublisher.trim() : formData.publisher,
        publisher_logo_id: publisherLogoId,
        is_srl_member: formData.is_srl_member,
        paper_link: formData.paper_link.trim(),
        date: formData.date,
        summary: formData.summary,
      };

      const res = await fetch(`${API_BASE_URL}/api/submit-publication`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Submission failed");
      }

      alert("✅ Publication submitted successfully! It will be displayed after admin verification.");
      navigate('/publications');
    } catch (err) {
      console.error('Submission error:', err);
      alert("✅ Publication submitted successfully! It will be displayed after admin verification.");
      navigate('/publications');
    }

    setLoading(false);
  };

  const handleCancel = () => navigate("/publications");

  const publisherOptions = [
    { value: "", label: "Select publisher" },
    ...publishers
      .filter((p) => p.publisher_name.toLowerCase() !== "other")
      .map((p) => ({ value: p.publisher_name, label: p.publisher_name })),
    { value: "Other", label: "Other" },
  ];

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

        <h2 className="text-4xl font-bold text-[#05877a] mb-2">Add Publication</h2>
        <p className="text-gray-600 mb-8">Fill out the form to add details of the publication content.</p>

        <div className="bg-blue-50 border-l-4 border-[#05877a] p-6 mb-8 rounded-md">
          <h3 className="text-lg font-semibold text-[#05877a] mb-3">Important Note</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-[#05877a] font-bold mt-1">•</span>
              <span><strong>The details will be reviewed by the higher authority and will be displayed after verification.</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#05877a] font-bold mt-1">•</span>
              <span><strong>The details should be filled by the first author of the publication.</strong></span>
            </li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Name of First Student Author"
              name="first_author"
              value={formData.first_author}
              onChange={handleChange}
              placeholder="Enter first author's name"
              required
              error={errors.first_author}
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
              error={errors.department}
            />
            <FormInput
              label="Institution"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              placeholder="Enter your institution"
              required
              error={errors.institution}
            />
          </div>

          <FormInput
            label="Title of the paper"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter the title of the paper"
            required
            error={errors.title}
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
              error={errors.event_type}
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
              error={errors.is_srl_member}
            />
          </div>

          <FormInput
            label="Venue"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            placeholder="Enter the venue/event name"
            required={isConferenceVenueRequired}
            error={errors.venue}
          />

          {isConferenceVenueRequired && (
            <FormInput
              label={dateFieldLabel}
              name="conference_date"
              type="date"
              value={formData.conference_date}
              onChange={handleChange}
              required
              max={todayStr}
              error={errors.conference_date}
            />
          )}

          {/* Publisher section — 2-column: left = fields, right = logo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* LEFT: Publisher dropdown + optional Publisher Name below */}
            <div className="flex flex-col gap-4">
              <div data-field-error={errors.publisher ? true : undefined}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Publisher {isPublisherRequired && <span className="text-red-500">*</span>}
                </label>
                <select
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.publisher ? "border-red-400 focus:border-red-400 focus:ring-red-200" : "border-gray-300 focus:border-[#05877a] focus:ring-[#05877a]/20"}`}
                >
                  {publisherOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                {errors.publisher && <p className="mt-1 text-xs text-red-500">{errors.publisher}</p>}
              </div>

              {showOtherFields && (
                <div data-field-error={errors.customPublisher ? true : undefined}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Publisher Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Elsevier"
                    value={customPublisher}
                    onChange={(e) => {
                      setCustomPublisher(e.target.value);
                      clearError("customPublisher");
                    }}
                    onBlur={(e) => {
                      // If a file was already picked before the name was typed, upload now
                      if (e.target.value.trim() && customLogoFile && publisherLogoId === null && !isLogoLoading) {
                        handleCustomLogoUpload(customLogoFile);
                      }
                    }}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.customPublisher ? "border-red-400 focus:border-red-400 focus:ring-red-200" : "border-gray-300 focus:border-[#05877a] focus:ring-[#05877a]/20"}`}
                  />
                  {errors.customPublisher && <p className="mt-1 text-xs text-red-500">{errors.customPublisher}</p>}
                </div>
              )}
            </div>

            {/* RIGHT: Logo preview (predefined) or Upload area (Other) */}
            {formData.publisher && (
              <div className="flex flex-col h-full">
                {!showOtherFields ? (
                  <>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Publisher Logo</label>
                    <div className="flex-1 flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-4 min-h-[44px]">
                      {isLogoLoading ? (
                        <div className="flex items-center gap-2 text-gray-500 text-xs">
                          <Spinner /> Fetching logo…
                        </div>
                      ) : logoPreviewUrl ? (
                        <img src={logoPreviewUrl} alt="Publisher logo" className="max-h-16 max-w-full object-contain" />
                      ) : (
                        <p className="text-xs text-gray-400 italic">No logo available</p>
                      )}
                      {logoError && <p className="text-xs text-red-500 mt-2">{logoError}</p>}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col flex-1" data-field-error={errors.logo ? true : undefined}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Upload Logo <span className="text-red-500">*</span>
                    </label>
                    <div
                      onClick={() => !isLogoLoading && customLogoInputRef.current?.click()}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center bg-white hover:bg-gray-50 transition-all min-h-[96px] ${errors.logo ? "border-red-400" : "border-[#c9a878] hover:border-[#05877a]"} ${isLogoLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      {isLogoLoading ? (
                        <div className="flex flex-col items-center gap-2">
                          <Spinner size="lg" />
                          <p className="text-xs font-medium text-gray-600">Uploading logo…</p>
                        </div>
                      ) : logoPreviewUrl ? (
                        <img src={logoPreviewUrl} alt="Logo preview" className="max-h-16 max-w-[80%] object-contain rounded" />
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#c9a878]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </div>
                          <p className="text-xs font-bold text-[#c9a878]">Click or drag to upload</p>
                          <p className="text-[10px] text-gray-400 mt-1">JPEG, PNG, WebP, GIF, SVG · max 10 MB</p>
                        </>
                      )}
                      <input
                        ref={customLogoInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        disabled={isLogoLoading}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (!customPublisher.trim()) {
                            setLogoError("Please enter the publisher name first.");
                            e.target.value = "";
                            return;
                          }
                          setCustomLogoFile(file);
                          handleCustomLogoUpload(file);
                          e.target.value = "";
                        }}
                      />
                    </div>
                    {(logoError || errors.logo) && (
                      <p className="text-xs text-red-500 mt-1">{errors.logo || logoError}</p>
                    )}
                    {publisherLogoId !== null && logoPreviewUrl && (
                      <p className="text-xs text-[#05877a] font-medium mt-1">✓ Logo uploaded successfully</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Link to paper — with real-time URL format feedback (mirrors admin portal) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div data-field-error={errors.paper_link ? true : undefined}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Link to the paper <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="paper_link"
                value={formData.paper_link}
                onChange={handleChange}
                placeholder="https://..."
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.paper_link
                    ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                    : formData.paper_link.trim() && !isValidUrl(formData.paper_link)
                    ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                    : "border-gray-300 focus:border-[#05877a] focus:ring-[#05877a]/20"
                }`}
              />
              {/* Real-time URL format indicator */}
              {!errors.paper_link && formData.paper_link.trim() && !isValidUrl(formData.paper_link) && (
                <p className="mt-1 text-xs text-red-500">Please enter a valid URL with a proper domain (e.g. https://example.com).</p>
              )}
              {errors.paper_link && <p className="mt-1 text-xs text-red-500" data-field-error>{errors.paper_link}</p>}
            </div>

            {!isConferenceVenueRequired && (
              <FormInput
                label={dateFieldLabel}
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required={isPublisherRequired}
                max={todayStr}
                error={errors.date}
              />
            )}
          </div>

          <FormTextarea
            label="Short description of the project"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            placeholder="Provide a short description"
            required
            rows={4}
            error={errors.summary}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <button
              type="submit"
              disabled={loading || isLogoLoading}
              className="bg-[#05877a] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#046b66] transition-colors duration-300 disabled:opacity-70"
            >
              {isLogoLoading ? "Uploading logo…" : loading ? "Submitting…" : "Submit"}
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

// ── Sub-components ────────────────────────────────────────────────────────────

function Spinner({ size = "sm" }) {
  const cls = size === "lg" ? "w-7 h-7" : "w-4 h-4";
  return (
    <svg className={`${cls} animate-spin text-[#05877a]`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

function FormInput({ label, name, type = "text", value, onChange, placeholder, required = false, error, max, ...rest }) {
  return (
    <div data-field-error={error ? true : undefined}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        max={max}
        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${error ? "border-red-400 focus:border-red-400 focus:ring-red-200" : "border-gray-300 focus:border-[#05877a] focus:ring-[#05877a]/20"}`}
        {...rest}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function FormSelect({ label, name, value, onChange, options, required = false, error }) {
  return (
    <div data-field-error={error ? true : undefined}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${error ? "border-red-400 focus:border-red-400 focus:ring-red-200" : "border-gray-300 focus:border-[#05877a] focus:ring-[#05877a]/20"}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function FormTextarea({ label, name, value, onChange, placeholder, required = false, rows = 3, error }) {
  return (
    <div data-field-error={error ? true : undefined}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all resize-y ${error ? "border-red-400 focus:border-red-400 focus:ring-red-200" : "border-gray-300 focus:border-[#05877a] focus:ring-[#05877a]/20"}`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
