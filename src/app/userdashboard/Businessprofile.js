"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Select from 'react-select';

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";
import Link from "@tiptap/extension-link";

import {
  FiChevronDown,
  FiChevronUp,
  FiBriefcase,
  FiMapPin,
  FiFileText,
  FiClock,
  FiImage,
} from "react-icons/fi";

const BusinessProfile = () => {
  const [formData, setFormData] = useState({
    businessType: [],
    companyName: "",
    officeContact: "",
    faxNumber: "",
    ownershipType: "",
    annualTurnover: "",
    yearOfEstablishment: "",
    numberOfEmployees: "",
    address: "",
    pincode: "",
    city: "",
    state: "",
    country: "India",
    gstNumber: "",
    aadharNumber: "",
    panNumber: "",
    iecNumber: "",
    tanNumber: "",
    vatNumber: "",
    companyLogo: "",
    companyPhotos: [],
    companyVideo: "",
    companyDescription: "",
    workingDays: [],
    workingTime: { from: "", to: "" },
    preferredBusinessStates: [],
    preferredBusinessCities: [],
    nonBusinessCities: [],
  });
  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({ levels: [1, 2, 3] }),
      Bold,
      Italic,
      Underline,
      BulletList,
      OrderedList,
      ListItem,
      Blockquote,
      CodeBlock,
      Link,
    ],
    content: "", // Set empty initially
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({
        ...prev,
        companyDescription: editor.getHTML(),
      }));
    },
  });
  
  useEffect(() => {
    if (editor && formData.companyDescription) {
      editor.commands.setContent(formData.companyDescription);
    }
  }, [editor, formData.companyDescription]);

  
  const businessTypeOptions = [
    { value: 'Exporter', label: 'Exporter' },
    { value: 'Importer', label: 'Importer' },
    { value: 'Manufacturer', label: 'Manufacturer' },
    { value: 'Wholesaler', label: 'Wholesaler' },
    { value: 'Retailer', label: 'Retailer' },
  ];

  const [loading, setLoading] = useState(true);
  const [openSection, setOpenSection] = useState("companyDetails");
  const [isEditing, setIsEditing] = useState(false); // Toggle for edit/view mode


  useEffect(() => {
    const fetchBusinessProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("/api/userprofile/profile/businessprofile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success && res.data.data) {
          setFormData(res.data.data);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (e, section) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [name]: value },
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return toast.error("Please login again");

      const res = await axios.patch(
        "/api/userprofile/profile/businessprofile",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        toast.success("Business profile updated!");
      } else {
        toast.error("Update failed!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong!");
    }
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };
  const toggleEditMode = () => {
    setIsEditing((prev) => !prev); // Toggle between edit and view mode
  };
  const renderSection = (key, label, Icon, content) => (
    <div className="mb-3">
      <button
        type="button"
        className={`btn w-100 common-das-test text-start d-flex justify-content-between align-items-center fw-semibold fs-5 border ${
          openSection === key ? "common-das-background text-white" : "btn-outline-primary"
        }`}
        onClick={() => toggleSection(key)}
      >
        <span className="d-flex align-items-center">
          <Icon className="me-2" size={20} />
          {label}
        </span>
        {openSection === key ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
      </button>
      {openSection === key && (
        <div className="bg-light border border-primary-subtle rounded p-4 mt-2 shadow-sm">
          {content}
        </div>
      )}
    </div>
  );

  const handleWorkingDaysChange = (day) => {
    setFormData((prev) => {
      const isSelected = prev.workingDays.includes(day);
      return {
        ...prev,
        workingDays: isSelected
          ? prev.workingDays.filter((d) => d !== day)
          : [...prev.workingDays, day],
      };
    });
  };

  
  return (
    <div className="container mt-5 mb-5">
      <div className="shadow-lg p-4 rounded-4 border-0">
        <h2 className="title">Business <span>Profile</span></h2>

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status" />
            <p className="mt-3">Loading profile...</p>
          </div>
        ) : (
          <form onSubmit={handleSave}>
            {/* Company Info */}
            {renderSection("companyDetails", "Company Details", FiBriefcase, (
              <>
                <input type="text" className="form-control mb-3" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Name" />
                <input type="text" className="form-control mb-3" name="officeContact" value={formData.officeContact} onChange={handleChange} placeholder="Office Contact" />
                <input type="text" className="form-control mb-3" name="faxNumber" value={formData.faxNumber} onChange={handleChange} placeholder="Fax Number" />
                <input type="text" className="form-control mb-3" name="ownershipType" value={formData.ownershipType} onChange={handleChange} placeholder="Ownership Type" />
                <input type="text" className="form-control mb-3" name="annualTurnover" value={formData.annualTurnover} onChange={handleChange} placeholder="Annual Turnover" />
                <input type="number" className="form-control mb-3" name="yearOfEstablishment" value={formData.yearOfEstablishment} onChange={handleChange} placeholder="Year of Establishment" />
                <input type="number" className="form-control mb-3" name="numberOfEmployees" value={formData.numberOfEmployees} onChange={handleChange} placeholder="Number of Employees" />
              </>
            ))}

            {/* Address Info */}
            {renderSection("addressDetails", "Address Details", FiMapPin, (
              <>
                <input type="text" className="form-control mb-3" name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
                <input type="text" className="form-control mb-3" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode" />
                <input type="text" className="form-control mb-3" name="city" value={formData.city} onChange={handleChange} placeholder="City" />
                <input type="text" className="form-control mb-3" name="state" value={formData.state} onChange={handleChange} placeholder="State" />
                <input type="text" className="form-control mb-3" name="country" value={formData.country} readOnly />
              </>
            ))}

            {/* Tax Details */}
            {renderSection("taxationDetails", "Taxation Details", FiFileText, (
              <>
                {["gstNumber", "panNumber", "aadharNumber", "iecNumber", "tanNumber", "vatNumber"].map((field) => (
                  <input key={field} type="text" className="form-control mb-3" name={field} value={formData[field]} onChange={handleChange} placeholder={field.replace(/([A-Z])/g, ' $1')} />
                ))}
              </>
            ))}

 {/* Timing & Visuals */}
{renderSection("extraDetails", "Additional Details", FiClock, (
  <>
  <div className="mb-3">
  <label className="form-label">Business Type</label>
  <Select
  isMulti
  name="businessType"
  options={businessTypeOptions}
  value={businessTypeOptions.filter((opt) =>
    (formData.businessType || []).includes(opt.value)
  )}
  onChange={(selectedOptions) =>
    setFormData((prev) => ({
      ...prev,
      businessType: selectedOptions.map((option) => option.value),
    }))
  }
/>
</div>

    {/* Working Days */}
    <div className="mb-3">
      <label className="form-label">Working Days</label>
      <div className="d-flex flex-wrap gap-3">
        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
          <div key={day} className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id={day}
              checked={formData.workingDays.includes(day)}
              onChange={() => handleWorkingDaysChange(day)}
            />
            <label className="form-check-label" htmlFor={day}>
              {day}
            </label>
          </div>
        ))}
      </div>
    </div>
{/* Working Time */}
<div className="mb-3">
  <label htmlFor="workingFrom" className="form-label">Working From</label>
  <input
    type="time"
    id="workingFrom"
    name="from"
    className="form-control"
    value={formData.workingTime.from}
    onChange={(e) => handleNestedChange(e, "workingTime")}
  />
</div>

<div className="mb-3">
  <label htmlFor="workingTo" className="form-label">Working To</label>
  <input
    type="time"
    id="workingTo"
    name="to"
    className="form-control"
    value={formData.workingTime.to}
    onChange={(e) => handleNestedChange(e, "workingTime")}
  />
</div>

    {/* Logo, Video, Description */}
    <input type="text" className="form-control mb-3" name="companyLogo" value={formData.companyLogo} onChange={handleChange} placeholder="Company Logo URL" />
    <input type="text" className="form-control mb-3" name="companyVideo" value={formData.companyVideo} onChange={handleChange} placeholder="Company Video URL" />
   
    {editor && (
  <div className="d-flex flex-wrap gap-2 mb-2">
    <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className="btn btn-sm btn-outline-secondary">
      Bold
    </button>
    <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className="btn btn-sm btn-outline-secondary">
      Italic
    </button>
    <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className="btn btn-sm btn-outline-secondary">
      Underline
    </button>
    <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className="btn btn-sm btn-outline-secondary">
      H1
    </button>
    <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="btn btn-sm btn-outline-secondary">
      H2
    </button>
    <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className="btn btn-sm btn-outline-secondary">
      Bullet List
    </button>
    <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className="btn btn-sm btn-outline-secondary">
      Ordered List
    </button>
    <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className="btn btn-sm btn-outline-secondary">
      Quote
    </button>
    <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className="btn btn-sm btn-outline-secondary">
      Code Block
    </button>
  </div>
)}

<div className="mb-3">
  <label className="form-label">Company Description</label>
  <div className="border p-2 rounded bg-white">
  {isEditing ? (
                    <div>
                      <EditorContent editor={editor} />
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary mt-2"
                        onClick={toggleEditMode}
                      >
                        Save & Exit Edit Mode
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div dangerouslySetInnerHTML={{ __html: formData.companyDescription }} />
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary mt-2"
                        onClick={toggleEditMode}
                      >
                        Edit Description
                      </button>
                    </div>
                  )}
  </div>
</div>

  </>
))}


            <div className="text-center mt-4">
              <button type="submit" className="common-das-btn w-100 py-2 fw-semibold fs-5 text-light shadow-sm">
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BusinessProfile;
