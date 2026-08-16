import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";

import { db } from "../../firebase/config";

function RegistrationRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let usersData = [];
    let staffData = [];

    const updateRequests = () => {
      const allRequests = [...usersData, ...staffData]
        .filter((item) => item.status === "pending")
        .sort((a, b) => {
          const dateA = a.createdAt?.seconds || 0;
          const dateB = b.createdAt?.seconds || 0;

          return dateB - dateA;
        });

      setRequests(allRequests);
      setLoading(false);
    };

    // USERS
    const unsubscribeUsers = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        usersData = snapshot.docs.map((document) => ({
          id: document.id,
          collectionName: "users",
          ...document.data(),
        }));

        updateRequests();
      },
      (error) => {
        console.error("Users request error:", error);
        setLoading(false);
      }
    );

    // STAFF
    const unsubscribeStaff = onSnapshot(
      collection(db, "staff"),
      (snapshot) => {
        staffData = snapshot.docs.map((document) => ({
          id: document.id,
          collectionName: "staff",
          ...document.data(),
        }));

        updateRequests();
      },
      (error) => {
        console.error("Staff request error:", error);
        setLoading(false);
      }
    );

    return () => {
      unsubscribeUsers();
      unsubscribeStaff();
    };
  }, []);

  // ACCEPT
  const handleAccept = async (request) => {
    try {
      await updateDoc(
        doc(db, request.collectionName, request.id),
        {
          status: "approved",
        }
      );

      alert(`${request.role || "User"} approved successfully!`);
    } catch (error) {
      console.error("Accept error:", error);
      alert("Unable to approve request.");
    }
  };

  // REJECT
  const handleReject = async (request) => {
    try {
      await updateDoc(
        doc(db, request.collectionName, request.id),
        {
          status: "rejected",
        }
      );

      alert(`${request.role || "User"} rejected.`);
    } catch (error) {
      console.error("Reject error:", error);
      alert("Unable to reject request.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-7">

          <h1 className="text-3xl font-bold text-gray-800">
            Registration Requests
          </h1>

          <p className="text-gray-500 mt-1">
            Manage new user and staff registrations
          </p>

        </div>

        {/* REQUEST COUNT */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6">

          <p className="text-gray-500 text-sm">
            Pending Requests
          </p>

          <p className="text-3xl font-bold text-blue-600 mt-2">
            {requests.length}
          </p>

        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">

          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading registration requests...
            </div>
          ) : requests.length === 0 ? (
            <div className="p-10 text-center">

              <div className="text-5xl mb-3">
                ✓
              </div>

              <h2 className="text-xl font-semibold text-gray-700">
                No Pending Requests
              </h2>

              <p className="text-gray-500 mt-1">
                There are no new registration requests.
              </p>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50 border-b">

                  <tr>

                    <th className="text-left p-4 text-sm font-semibold text-gray-600">
                      Name
                    </th>

                    <th className="text-left p-4 text-sm font-semibold text-gray-600">
                      Email
                    </th>

                    <th className="text-left p-4 text-sm font-semibold text-gray-600">
                      Role
                    </th>

                    <th className="text-left p-4 text-sm font-semibold text-gray-600">
                      Status
                    </th>

                    <th className="text-left p-4 text-sm font-semibold text-gray-600">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {requests.map((request) => (

                    <tr
                      key={`${request.collectionName}-${request.id}`}
                      className="border-b hover:bg-gray-50"
                    >

                      {/* NAME */}
                      <td className="p-4">

                        <p className="font-medium text-gray-800">
                          {request.name ||
                            request.fullName ||
                            "Unknown"}
                        </p>

                      </td>

                      {/* EMAIL */}
                      <td className="p-4 text-gray-600">

                        {request.email || "No email"}

                      </td>

                      {/* ROLE */}
                      <td className="p-4">

                        <span
                          className={`px-3 py-1 rounded-full text-sm capitalize ${
                            request.role === "staff"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {request.role || "user"}
                        </span>

                      </td>

                      {/* STATUS */}
                      <td className="p-4">

                        <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-700">
                          Pending
                        </span>

                      </td>

                      {/* ACTIONS */}
                      <td className="p-4">

                        <div className="flex gap-2">

                          <button
                            onClick={() =>
                              handleAccept(request)
                            }
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                          >
                            Accept
                          </button>

                          <button
                            onClick={() =>
                              handleReject(request)
                            }
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                          >
                            Reject
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default RegistrationRequests;