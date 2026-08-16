function StatCard({ title, value, icon, bgColor, textColor }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition duration-200">

      <div className="flex items-start justify-between">

        {/* Text */}

        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            {value}
          </h2>
        </div>


        {/* Icon */}

        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${bgColor} ${textColor}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}

export default StatCard;