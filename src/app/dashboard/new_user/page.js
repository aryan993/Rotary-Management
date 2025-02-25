"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

export default function Home() {
  const [mfile, setMfile] = useState(null);
  const [sfile, setSfile] = useState(null);

  const [member, setMember] = useState({
    user_type: "member",
    phone_number: null,
    email: null,
    club: null,
    birthday: null,
    anniversary: null,
    name: null,
    image: null,
  });

  const [spouse, setSpouse] = useState({
    user_type: "spouse",
    phone_number: null,
    email: null,
    club: null,
    birthday: null,
    name: null,
    image: null,
  });

  const handleImageUpload = (e, setUser) => {
    const mfile = e.target.files[0];
    setMfile(event.target.files[0]);
    if (mfile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(mfile);
    }
  };
  const handleImageUploads = (e, setUser) => {
    const sfile = e.target.files[0];
    setSfile(event.target.files[0]);
    if (sfile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(sfile);
    }
  };

  const uploadImage = async (file, id) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("id", id);

    const response = await fetch("/api/images/id/upload", {
      method: "POST",
      body: formData,
    });
    return response.ok;
  };
  let data;
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("member_user_type", member.user_type);
    formDataToSend.append("member_phone_number", member.phone_number);
    formDataToSend.append("member_email", member.email);
    formDataToSend.append("member_club", member.club);
    formDataToSend.append("member_birthday", member.birthday);
    formDataToSend.append("member_anniversary", member.anniversary);
    formDataToSend.append("member_name", member.name);
    formDataToSend.append("spouse_user_type", spouse.user_type);
    formDataToSend.append("spouse_phone_number", spouse.phone_number);
    formDataToSend.append("spouse_email", spouse.email);
    formDataToSend.append("spouse_club", spouse.club);
    formDataToSend.append("spouse_birthday", spouse.birthday);
    formDataToSend.append("spouse_name", spouse.name);

    const response = await fetch("/api/data/create", {
      method: "POST",
      body: formDataToSend,
    });
    if (response.ok) {
      data = await response.json();
      console.log("Member ID:", data.memberId, "Spouse ID:", data.spouseId);
      alert("Users registered successfully!");
    } else {
      alert("Failed to register users.");
    }

    if (mfile) {
      await uploadImage(mfile, data.memberId);
    }
    if (sfile) {
      await uploadImage(sfile, data.spouseId);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">
        Register Member and Spouse
      </h2>

      <div className="grid grid-cols-2 gap-6">
        {/* Member Column */}
        <div>
          <h3 className="text-xl font-bold mb-4">Member Details</h3>
          <label className="block text-sm font-medium mb-2">Photo</label>
          <div className="mb-4">
            {member.image ? (
              <img
                src={member.image}
                alt="Member"
                className="w-24 h-24 rounded-full cursor-pointer"
                onClick={() =>
                  document.getElementById("memberImageInput").click()
                }
              />
            ) : (
              <button
                type="button"
                className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-300"
                onClick={() =>
                  document.getElementById("memberImageInput").click()
                }
              >
                Upload
              </button>
            )}
            <input
              id="memberImageInput"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleImageUpload(e, setMember)}
            />
          </div>

          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            value={member.name}
            onChange={(e) => setMember({ ...member, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />

          <label className="block text-sm font-medium mt-4 mb-2">Email</label>
          <input
            type="email"
            value={member.email}
            onChange={(e) => setMember({ ...member, email: e.target.value })}
            className="w-full p-2 border rounded"
            
          />

          <label className="block text-sm font-medium mt-4 mb-2">
            Phone Number
          </label>
          <input
            type="text"
            value={member.phone_number}
            onChange={(e) =>
              setMember({ ...member, phone_number: e.target.value })
            }
            className="w-full p-2 border rounded"
            
          />

          <label className="block text-sm font-medium mt-4 mb-2">
            Birthday
          </label>
          <input
            type="date"
            value={member.birthday}
            onChange={(e) => setMember({ ...member, birthday: e.target.value })}
            className="w-full p-2 border rounded"
            
          />

          <label className="block text-sm font-medium mt-4 mb-2">Club</label>
          <input
            type="text"
            value={member.club}
            onChange={(e) => setMember({ ...member, club: e.target.value })}
            className="w-full p-2 border rounded"
            
          />
          <label className="block text-sm font-medium mt-4 mb-2">
            Anniversary
          </label>
          <input
            type="date"
            value={member.anniversary}
            onChange={(e) =>
              setMember({ ...member, anniversary: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Spouse Column */}
        <div>
          <h3 className="text-xl font-bold mb-4">Spouse Details</h3>
          <label className="block text-sm font-medium mb-2">Photo</label>
          <div className="mb-4">
            {spouse.image ? (
              <img
                src={spouse.image}
                alt="Spouse"
                className="w-24 h-24 rounded-full cursor-pointer"
                onClick={() =>
                  document.getElementById("spouseImageInput").click()
                }
              />
            ) : (
              <button
                type="button"
                className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-300"
                onClick={() =>
                  document.getElementById("spouseImageInput").click()
                }
              >
                Upload
              </button>
            )}
            <input
              id="spouseImageInput"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleImageUploads(e, setSpouse)}
            />
          </div>

          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            value={spouse.name}
            onChange={(e) => setSpouse({ ...spouse, name: e.target.value })}
            className="w-full p-2 border rounded"
            
          />

          <label className="block text-sm font-medium mt-4 mb-2">Email</label>
          <input
            type="email"
            value={spouse.email}
            onChange={(e) => setSpouse({ ...spouse, email: e.target.value })}
            className="w-full p-2 border rounded"
            
          />

          <label className="block text-sm font-medium mt-4 mb-2">
            Phone Number
          </label>
          <input
            type="text"
            value={spouse.phone_number}
            onChange={(e) =>
              setSpouse({ ...spouse, phone_number: e.target.value })
            }
            className="w-full p-2 border rounded"
            
          />

          <label className="block text-sm font-medium mt-4 mb-2">
            Birthday
          </label>
          <input
            type="date"
            value={spouse.birthday}
            onChange={(e) => setSpouse({ ...spouse, birthday: e.target.value })}
            className="w-full p-2 border rounded"
            
          />

          <label className="block text-sm font-medium mt-4 mb-2">Club</label>
          <input
            type="text"
            value={spouse.club}
            onChange={(e) => setSpouse({ ...spouse, club: e.target.value })}
            className="w-full p-2 border rounded"
            
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full mt-6 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Register
      </button>
    </form>
  );
}
