function MenuCard({
  menu,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition duration-300">

      {/* Top section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-5 text-white">

        <div className="flex items-center justify-between">

          <div>
            <p className="text-sm opacity-90">
              Today's Meal
            </p>

            <h3 className="text-2xl font-bold">
              {menu.mealType}
            </h3>
          </div>

          <div className="text-4xl">
            {menu.mealType === "Breakfast"
              ? "🍳"
              : menu.mealType === "Lunch"
                ? "🍛"
                : "🍽️"}
          </div>

        </div>

      </div>


      {/* Menu information */}
      <div className="p-5 space-y-4">

        {/* Date */}

        <div className="flex items-start gap-3">

          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-xl">
            📅
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Date
            </p>

            <p className="font-semibold text-gray-800">
              {menu.date}
            </p>
          </div>

        </div>


        {/* Timing */}

        <div className="flex items-start gap-3">

          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-xl">
            ⏰
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Timing
            </p>

            <p className="font-semibold text-gray-800">
              {menu.timing}
            </p>
          </div>

        </div>


        {/* Food Items */}

        <div className="flex items-start gap-3">

          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-xl">
            🍴
          </div>

          <div className="flex-1">

            <p className="text-xs text-gray-500 mb-1">
              Menu Items
            </p>

            <div className="flex flex-wrap gap-2">

              {Array.isArray(menu.items) &&
                menu.items.map(
                  (item, index) => (

                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                    >
                      {item}
                    </span>

                  )
                )}

            </div>

          </div>

        </div>


        {/* Buttons */}

        <div className="flex gap-3 pt-3 border-t border-gray-100">

          <button
            onClick={() => onEdit(menu)}
            className="flex-1 bg-blue-50 text-blue-600 font-semibold py-2.5 rounded-xl hover:bg-blue-100 transition"
          >
            ✏️ Edit
          </button>


          <button
            onClick={() => onDelete(menu.id)}
            className="flex-1 bg-red-50 text-red-600 font-semibold py-2.5 rounded-xl hover:bg-red-100 transition"
          >
            🗑️ Delete
          </button>

        </div>

      </div>

    </div>
  );
}

export default MenuCard;