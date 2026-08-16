function UserTable({ users, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">

      {/* Header */}

      <div className="p-5 border-b">
        <h2 className="text-xl font-semibold text-gray-800">
          All Users
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          {users.length} users found
        </p>
      </div>


      {/* Empty */}

      {users.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-500">
            No users found.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Name
                </th>

                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Email
                </th>

                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Role
                </th>

                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {users.map((user) => (

                <tr
                  key={user.id}
                  className="border-t hover:bg-gray-50"
                >

                  {/* Name */}

                  <td className="px-6 py-4 text-sm text-gray-700">
                    {user.name ||
                      user.fullName ||
                      user.username ||
                      "Unknown"}
                  </td>


                  {/* Email */}

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.email || "No email"}
                  </td>


                  {/* Role */}

                  <td className="px-6 py-4">

                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                      {user.role || "User"}
                    </span>

                  </td>


                  {/* Delete */}

                  <td className="px-6 py-4">

                    <button
                      onClick={() => onDelete(user.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>

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

export default UserTable;