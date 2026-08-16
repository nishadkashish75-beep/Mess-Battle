import { useState } from "react";

function Feedback() {
  const [meal, setMeal] = useState("Lunch");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      meal,
      rating,
      comment,
    });
  };

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-lg rounded-xl border p-6">
        <h1 className="mb-2 text-2xl font-bold">
          Meal Feedback
        </h1>

        <p className="mb-6 text-gray-500">
          Rate your meal and share your feedback.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Meal */}
          <div>
            <label className="mb-2 block font-medium">
              Select Meal
            </label>

            <select
              value={meal}
              onChange={(e) => setMeal(e.target.value)}
              className="w-full rounded-lg border p-3"
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="mb-2 block font-medium">
              Rating
            </label>

            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-3xl ${
                    star <= rating
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="mb-2 block font-medium">
              Your Feedback
            </label>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about the food..."
              rows="4"
              className="w-full rounded-lg border p-3"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-black px-4 py-3 text-white"
          >
            Submit Feedback
          </button>

        </form>
      </div>
    </div>
  );
}

export default Feedback;