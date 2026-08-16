import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

function ComplaintTable({
  complaints,
  onStatusUpdate,
}) {

  // =========================
  // UPDATE STATUS
  // =========================

  const handleStatusChange = async (id, newStatus) => {
    try {

      await updateDoc(
        doc(db, "complaints", id),
        {
          status: newStatus,
        }
      );

      onStatusUpdate(id, newStatus);

    } catch (error) {

      console.error(
        "Error updating status:",
        error
      );

      alert("Status update failed");

    }
  };


  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">

      {/* =========================
          TABLE HEADER
      ========================= */}

      <div className="p-5 border-b">

        <h2 className="text-xl font-semibold text-gray-800">
          All Complaints
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          {complaints.length} complaints found
        </p>

      </div>


      {/* =========================
          EMPTY STATE
      ========================= */}

      {complaints.length === 0 ? (

        <div className="p-8 text-center">

          <p className="text-gray-500">
            No complaints found.
          </p>

        </div>

      ) : (

        <div className="overflow-x-auto">

          <table className="w-full">

            {/* =========================
                TABLE HEAD
            ========================= */}

            <thead className="bg-gray-100">

              <tr>

                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  User
                </th>

                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Complaint
                </th>

                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>

                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Date
                </th>

              </tr>

            </thead>


            {/* =========================
                TABLE BODY
            ========================= */}

            <tbody>

              {complaints.map((complaint) => (

                <tr
                  key={complaint.id}
                  className="border-t hover:bg-gray-50"
                >

                  {/* USER */}

                  <td className="px-6 py-4 text-sm text-gray-700">

                    {complaint.userName ||
                      complaint.email ||
                      complaint.userId ||
                      "Unknown"}

                  </td>


                  {/* COMPLAINT */}

                  <td className="px-6 py-4 text-sm text-gray-700 max-w-md">

                    <p className="truncate">

                      {complaint.description ||
                        complaint.complaint ||
                        complaint.complaintText ||
                        "No description"}

                    </p>

                  </td>


                  {/* STATUS */}

                  <td className="px-6 py-4">

                    <select
                      value={
                        complaint.status ||
                        "Pending"
                      }
                      onChange={(e) =>
                        handleStatusChange(
                          complaint.id,
                          e.target.value
                        )
                      }
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >

                      <option value="Pending">
                        Pending
                      </option>

                      <option value="In Progress">
                        In Progress
                      </option>

                      <option value="Resolved">
                        Resolved
                      </option>

                    </select>

                  </td>


                  {/* DATE */}

                  <td className="px-6 py-4 text-sm text-gray-500">

                    {complaint.createdAt?.toDate
                      ? complaint.createdAt
                          .toDate()
                          .toLocaleDateString()
                      : "N/A"}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}

export default ComplaintTable;