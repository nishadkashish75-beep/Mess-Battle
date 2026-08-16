function MealDemandCard({
  meal,
  yesCount = 0,
  noCount = 0,
  totalResponses = 0,
}) {
  const expectedDemand = yesCount;

  return (
    <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition duration-300">

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-5 text-white">

        <div className="flex justify-between items-center">

          <div>
            <p className="text-sm opacity-90">
              Meal Demand
            </p>

            <h2 className="text-2xl font-bold">
              {meal.mealType}
            </h2>
          </div>

          <div className="text-4xl">
            {meal.mealType === "Breakfast"
              ? "🍳"
              : meal.mealType === "Lunch"
                ? "🍛"
                : "🍽️"}
          </div>

        </div>

      </div>


      {/* Meal information */}
      <div className="p-6">

        <div className="grid grid-cols-2 gap-4 mb-6">

          {/* Date */}
          <div className="bg-orange-50 rounded-2xl p-4">

            <p className="text-xs text-gray-500">
              Date
            </p>

            <p className="font-semibold text-gray-800 mt-1">
              {meal.date}
            </p>

          </div>


          {/* Timing */}
          <div className="bg-blue-50 rounded-2xl p-4">

            <p className="text-xs text-gray-500">
              Timing
            </p>

            <p className="font-semibold text-gray-800 mt-1">
              {meal.timing}
            </p>

          </div>

        </div>


        {/* Demand */}
        <div className="bg-gray-50 rounded-2xl p-5">

          <p className="text-sm font-semibold text-gray-600">
            Expected Demand
          </p>

          <p className="text-4xl font-bold text-orange-500 mt-1">
            {expectedDemand}
          </p>

          <div className="grid grid-cols-2 gap-3 mt-4">

            <div className="bg-green-50 rounded-xl p-3 text-center">

              <p className="text-xs text-gray-500">
                YES
              </p>

              <p className="text-xl font-bold text-green-600">
                {yesCount}
              </p>

            </div>


            <div className="bg-red-50 rounded-xl p-3 text-center">

              <p className="text-xs text-gray-500">
                NO
              </p>

              <p className="text-xl font-bold text-red-500">
                {noCount}
              </p>

            </div>

          </div>


          <div className="text-center mt-4">

            <p className="text-sm text-gray-500">
              Total Responses
            </p>

            <p className="text-lg font-bold text-gray-800">
              {totalResponses}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default MealDemandCard;