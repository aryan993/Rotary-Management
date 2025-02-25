"use client"

import { useEffect, useState } from "react";
import EditModal from "../../dashboard/components/EditModal";
import { formatDate } from "../../utils/dateFormatter";

export default function Home() {
  const [data, setData] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedPartnerId, setSelectedPartnerId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState("birthday"); // 'birthday' or 'anniversary'

  // Get current date and one month later date in YYYY-MM-DD format
  const getCurrentDate = () => new Date().toISOString().split("T")[0];
  const getNextMonthDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().split("T")[0];
  };

  const [fromDate, setFromDate] = useState(getCurrentDate);
  const [toDate, setToDate] = useState(getNextMonthDate);

  const handleEdit = (user) => {
    setSelectedUserId(user.user_id);
    setSelectedPartnerId(user.partner_id);
    setIsModalOpen(true);
  };

  const handleSave = (updatedUser) => {
    console.log("Updated User:", updatedUser);
    setIsModalOpen(false);
  };

  const handleButtonClick = (e, user) => {
    e.stopPropagation(); // Stop event propagation
    console.log("Button clicked for user:", user);
    // Add your button click logic here
  };

  useEffect(() => {
    const fetchFilteredData = async () => {
      try {
        const response = await fetch(
          `/api/data/viewUsers?filterType=${filterType}&startDate=${fromDate}&endDate=${toDate}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch filtered data");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching filtered data:", error);
      }
    };
  
    fetchFilteredData();
  }, [filterType, fromDate, toDate]); // Dependencies added
  
  console.log(data)

  return (
    <>
      <div className="p-8">
        <div className="mb-4">
          <label className="mr-4">
            <input
              type="radio"
              value="birthday"
              checked={filterType === "birthday"}
              onChange={(e) => setFilterType(e.target.value)}
            />
            Birthday
          </label>
          <label>
            <input
              type="radio"
              value="anniversary"
              checked={filterType === "anniversary"}
              onChange={(e) => setFilterType(e.target.value)}
            />
            Anniversary
          </label>
        </div>
        <div className="mb-4">
          <label className="mr-4">
            From:
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="ml-2 p-1 border border-gray-300"
            />
          </label>
          <label>
            To:
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="ml-2 p-1 border border-gray-300"
            />
          </label>
        </div>
        <table className="min-w-full bg-white border border-gray-300 table-fixed">
          <thead>
            <tr>
              <th className="py-2 px-2 border-b border-gray-300 w-1/24">ID</th>
              <th className="py-2 px-2 border-b border-gray-300 w-2/12">
                Name
              </th>
              <th className="py-2 px-2 border-b border-gray-300 w-1/12">
                Role
              </th>
              <th className="py-2 px-2 border-b border-gray-300 w-2/12">
                Email
              </th>
              <th className="py-2 px-2 border-b border-gray-300 w-1/12">
                Phone number
              </th>
              <th className="py-2 px-2 border-b border-gray-300 w-1/12">
                Club
              </th>
              {filterType === "birthday" && (
                <>
                  <th className="py-2 px-2 border-b border-gray-300 w-1/12">
                    DOB
                  </th>
                  <th className="py-2 px-2 border-b border-gray-300 w-1/12">
                    I.DOW
                  </th>
                  <th className="py-2 px-2 border-b border-gray-300 w-1/12">
                    B Poster
                  </th>
                </>
              )}
              {filterType === "anniversary" && (
                <>
                  <th className="py-2 px-2 border-b border-gray-300 w-1/12">
                    Anniversary
                  </th>
                  <th className="py-2 px-2 border-b border-gray-300 w-1/12">
                    I.DOW
                  </th>
                  <th className="py-2 px-2 border-b border-gray-300 w-1/12">
                    Ann Poster
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((data) => (
              <tr
                key={data.user_id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleEdit(data)}
              >
                <td className="py-2 px-2 border-b border-gray-300 w-1/24">
                  {data.user_id}
                </td>
                <td className="py-2 px-2 border-b border-gray-300 w-2/12">
                  {data.name}
                </td>
                <td className="py-2 px-2 border-b border-gray-300 w-1/12">
                  {data.user_type}
                </td>
                <td className="py-2 px-2 border-b border-gray-300 w-2/12">
                  {data.email}
                </td>
                <td className="py-2 px-2 border-b border-gray-300 w-1/12">
                  {data.phone_number}
                </td>
                <td className="py-2 px-2 border-b border-gray-300 w-1/12">
                  {data.club}
                </td>
                {filterType === "birthday" && (
                  <>
                    <td className="py-2 px-2 border-b border-gray-300 w-1/12">
                      {formatDate(data.Birthday)}
                    </td>
                    <td className="py-2 px-2 border-b border-gray-300 w-1/12">
                      <button
                        type="button"
                        onClick={(e) => handleButtonClick(e, data)}
                      >
                        <svg
                          className="w-6 h-6 text-gray-800 dark:text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"
                          />
                        </svg>
                      </button>
                    </td>
                    <td className="py-2 px-2 border-b border-gray-300 w-1/12">
                      <button
                        type="button"
                        onClick={(e) => handleButtonClick(e, data)}
                      >
                        <svg
                          className="w-6 h-6 text-gray-800 dark:text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 5v9m-5 0H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2M8 9l4-5 4 5m1 8h.01"
                          />
                        </svg>
                      </button>
                    </td>
                  </>
                )}
                {filterType === "anniversary" && (
                  <>
                    <td className="py-2 px-2 border-b border-gray-300 w-1/12">
                      {formatDate(data.anniversary_date)}
                    </td>
                    <td className="py-2 px-2 border-b border-gray-300 w-1/12">
                      <button
                        type="button"
                        onClick={(e) => handleButtonClick(e, data)}
                      >
                        <svg
                          className="w-6 h-6 text-gray-800 dark:text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"
                          />
                        </svg>
                      </button>
                    </td>
                    <td className="py-2 px-2 border-b border-gray-300 w-1/12">
                      <button
                        type="button"
                        onClick={(e) => handleButtonClick(e, data)}
                      >
                        <svg
                          className="w-6 h-6 text-gray-800 dark:text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 5v9m-5 0H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2M8 9l4-5 4 5m1 8h.01"
                          />
                        </svg>
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {isModalOpen && (
          <EditModal
            user_id={selectedUserId}
            partner_id={selectedPartnerId}
            onSave={handleSave}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </>
  );
}
