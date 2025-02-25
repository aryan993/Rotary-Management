"use client";
import { formatDate } from "@/app/utils/dateFormatter";
import { useState, useEffect } from "react";

export default function EditModal({ user_id, partner_id, onSave, onClose }) {
  const convertToDateInputFormat = (dateString) => {
    if (!dateString) return ""; // Handle empty dates
    const [month, day, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    member_id: "",
    spouse_id: "",
    member_name: "",
    spouse_name: "",
    member_birthday: "",
    spouse_birthday: "",
    member_email: "",
    spouse_email: "",
    member_phone: "",
    spouse_phone: "",
    member_club: "",
    spouse_club: "",
    anniversary_date: "",
  });

  const [isSpouseEnabled, setIsSpouseEnabled] = useState(false);
  const [isEditable, setIsEditable] = useState(false); // State to manage form editability

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/data/modalUser?user_id=${user_id}&partner_id=${partner_id}`);
        const data = await response.json();
        console.log(data)

        if (response.ok) {
          const memberData = data.find(user => user.user_type === "member");
          const spouseData = data.find(user => user.user_type === "spouse");
          console.log("member data is"+JSON.stringify(memberData))
          console.log("spouse data is"+JSON.stringify(spouseData))

          setFormData({
            member_id: memberData?.user_id || "",
            spouse_id: spouseData?.user_id || "",
            member_name: memberData?.name || "",
            spouse_name: spouseData?.name || "",
            member_birthday: convertToDateInputFormat(formatDate(memberData?.Birthday)),
            spouse_birthday: convertToDateInputFormat(formatDate(spouseData?.Birthday)),
            member_email: memberData?.email || "",
            spouse_email: spouseData?.email || "",
            member_phone: memberData?.phone_number || "",
            spouse_phone: spouseData?.phone_number || "",
            member_club: memberData?.club || "",
            spouse_club: spouseData?.club || "",
            anniversary_date: convertToDateInputFormat(formatDate(memberData?.anniversary_date)),
          });

          setIsSpouseEnabled(!!spouseData); // Enable spouse fields if spouse data exists
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user_id, partner_id]);


  console.log(formData)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/data/viewUsers", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          member_id: formData.member_id,
          spouse_id: isSpouseEnabled ? formData.spouse_id : null,
          member_name: formData.member_name,
          spouse_name: isSpouseEnabled ? formData.spouse_name : "",
          member_birthday: formData.member_birthday,
          spouse_birthday: isSpouseEnabled ? formData.spouse_birthday : "",
          member_email: formData.member_email,
          spouse_email: isSpouseEnabled ? formData.spouse_email : "",
          member_phone: formData.member_phone,
          spouse_phone: isSpouseEnabled ? formData.spouse_phone : "",
          member_club: formData.member_club,
          spouse_club: isSpouseEnabled ? formData.spouse_club : "",
          anniversary_date: formData.anniversary_date,
        }),
      });

      if (response.ok) {
        onSave(formData);
        onClose();
      } else {
        console.error("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const toggleEdit = () => {
    setIsEditable(!isEditable); // Toggle editability
  };

  const logIDs = () => {
    console.log("Member ID:", formData.member_id);
    console.log("Spouse ID:", formData.spouse_id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[90vw] max-w-[900px] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Column 1 */}
            <div>
              <h2 className="text-xl font-bold mb-4">{`Member's Details`}</h2>
              {/* Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  <p>{`Member's Name`}</p>
                </label>
                <input
                  type="text"
                  name="member_name"
                  value={formData.member_name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                  disabled={!isEditable} // Disable based on editability state
                />
              </div>
              {/* Date of Birth */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="member_birthday"
                  value={formData.member_birthday}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  disabled={!isEditable} // Disable based on editability state
                />
              </div>
              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="member_email"
                  value={formData.member_email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                  disabled={!isEditable} // Disable based on editability state
                />
              </div>
              {/* Phone Number */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="member_phone"
                  value={formData.member_phone}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  disabled={!isEditable} // Disable based on editability state
                />
              </div>
              {/* Club Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  <p>{`Member's Club`}</p>
                </label>
                <input
                  type="text"
                  name="member_club"
                  value={formData.member_club}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                  disabled={!isEditable} // Disable based on editability state
                />
              </div>
              {/* Anniversary Date */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Anniversary Date
                </label>
                <input
                  type="date"
                  name="anniversary_date"
                  value={formData.anniversary_date}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  disabled={!isEditable} // Disable based on editability state
                />
              </div>
            </div>

            {/* Column 2 */}
            <div>
              <h2 className="text-xl font-bold mb-4">{`Spouse's Details`}</h2>
              {/* Checkbox to enable/disable spouse details */}
              <div className="mb-4">

              </div>
              {/* Spouse Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Spouse Name
                </label>
                <input
                  type="text"
                  name="spouse_name"
                  value={formData.spouse_name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  disabled={!isSpouseEnabled || !isEditable} // Disable if spouse is not enabled or form is not editable
                />
              </div>
              {/* Spouse DOB */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  <p>{`Spouse Date of Birth`}</p>
                </label>
                <input
                  type="date"
                  name="spouse_birthday"
                  value={formData.spouse_birthday}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  disabled={!isSpouseEnabled || !isEditable} // Disable if spouse is not enabled or form is not editable
                />
              </div>
              {/* Spouse Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  <p>{`Spouse Email`}</p>
                </label>
                <input
                  type="email"
                  name="spouse_email"
                  value={formData.spouse_email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  disabled={!isSpouseEnabled || !isEditable} // Disable if spouse is not enabled or form is not editable
                />
              </div>
              {/* Spouse Phone Number */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  <p>{`Spouse Phone Number`}</p>
                </label>
                <input
                  type="tel"
                  name="spouse_phone"
                  value={formData.spouse_phone}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  disabled={!isSpouseEnabled || !isEditable} // Disable if spouse is not enabled or form is not editable
                />
              </div>
              {/* Club Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Spouse Club
                </label>
                <input
                  type="text"
                  name="spouse_club"
                  value={formData.spouse_club}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  disabled={!isSpouseEnabled || !isEditable} // Disable if spouse is not enabled or form is not editable
                />
              </div>
            </div>
          </div>
          {/* Buttons */}
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
            >
              Back to Home
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={!isEditable} // Disable save button if form is not editable
            >
              Save
            </button>
          </div>
        </form>

        {/* Additional Buttons */}
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={toggleEdit}
            className={`px-4 py-2 rounded mr-2 ${
              isEditable ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            {isEditable ? "Editing Enabled" : "Enable Editing"}
          </button>
          <button
            type="button"
            onClick={logIDs}
            className="bg-purple-500 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}