"use client"

import { useEffect, useState } from "react";
import EditModal from "./dashboard/components/EditModal";
import { formatDate } from "../app/utils/dateFormatter";

export default function Home() {
  const [data, setData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function getData() {
    try {
      const response = await fetch("/api/data/allUsers", {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSave = (updatedUser) => {
    console.log("Updated User:", updatedUser);
    setIsModalOpen(false);
  };
  useEffect(() => {
    getData();
  }, []);
  console.log(data);

  return (
    <>
      <div className="p-8">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-2 border-b">Name</th>
              <th className="py-2 px-2 border-b">DOB</th>
              <th className="py-2 px-2 border-b">Email</th>
              <th className="py-2 px-2 border-b">Phone number</th>
              <th className="py-2 px-2 border-b">Club</th>
              <th className="py-2 px-2 border-b">Anniversary</th>
              <th className="py-2 px-2 border-b">Spouse Name</th>
              <th className="py-2 px-2 border-b">Spouse DOB</th>
              <th className="py-2 px-2 border-b">Spouse email</th>
              <th className="py-2 px-2 border-b">Spouse phone</th>
              <th className="py-2 px-2 border-b">Spouse Club</th>
              <th className="py-2 px-2 border-b"> </th>
              <th className="py-2 px-2 border-b"> </th>
            </tr>
          </thead>
          <tbody>
            {data.map((data) => (
              <tr key={data.member_id} className="hover:bg-gray-50">
                <td className="py-2 px-2 border-b">{data.member_name}</td>
                <td className="py-2 px-2 border-b">
                  {formatDate(data.member_birthday)}
                </td>
                <td className="py-2 px-2 border-b">{data.member_email}</td>
                <td className="py-2 px-2 border-b">{data.member_phone}</td>
                <td className="py-2 px-2 border-b">{data.member_club}</td>
                <td className="py-2 px-2 border-b">
                  {formatDate(data.anniversary_date)}
                </td>
                <td className="py-2 px-2 border-b">{data.spouse_name}</td>
                <td className="py-2 px-2 border-b">
                  {formatDate(data.spouse_birthday)}
                </td>
                <td className="py-2 px-2 border-b">{data.spouse_email}</td>
                <td className="py-2 px-2 border-b">{data.spouse_phone}</td>
                <td className="py-2 px-2 border-b">{data.spouse_club}</td>
                <td>
                  {" "}
                  <button onClick={() => handleEdit(data)}>
                    <svg
                      className="w-6 h-6 text-gray-800 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" />
                      <path d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" />
                    </svg>
                  </button>
                </td>
                <td>
                  {" "}
                  <button onClick={() => handleButtonClick(data.member_id)}>
                    <svg
                      className="w-[27px] h-[27px] text-gray-800 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isModalOpen && (
          <EditModal
            user={selectedUser}
            onSave={handleSave}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </>
  );
}
