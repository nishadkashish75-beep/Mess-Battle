import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";

import { db } from "../../firebase/config";

import {
  addFeedback,
  setFeedbacks,
  setLoading,
  setError,
} from "../../features/feedback/feedbackSlice";

function Feedback() {
  const [meal, setMeal] = useState("Lunch");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const dispatch = useDispatch();

  const loading = useSelector(
    (state) => state.feedback.loading
  );

  const error = useSelector(
    (state) => state.feedback.error
  );

  const feedbacks = useSelector(
    (state) => state.feedback.feedbacks
  );

  // Real-time feedback listener
  useEffect(() => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const feedbackRef = collection(
      db,
      "feedback"
    );

    const unsubscribe = onSnapshot(
      feedbackRef,
      (snapshot) => {
        const feedbackList = snapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        );

        dispatch(setFeedbacks(feedbackList));
        dispatch(setLoading(false));
      },
      (error) => {
        console.error(
          "Error listening to feedback:",
          error
        );

        dispatch(setError(error.message));
        dispatch(setLoading(false));
      }
    );

    // Stop Firebase listener when page is closed
    return () => unsubscribe();
  }, [dispatch]);

  // Submit feedback
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      dispatch(
        setError("Please select a rating.")
      );
      return;
    }

    if (!comment.trim()) {
      dispatch(
        setError("Please write your feedback.")
      );
      return;
    }

    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const feedbackData = {
        meal,
        rating,
        comment: comment.trim(),
        createdAt: serverTimestamp(),
      };

      await addDoc(
        collection(db, "feedback"),
        feedbackData
      );

      /*
        We DON'T need dispatch(addFeedback()) here.

        Firebase onSnapshot() will detect the new
        document automatically and update Redux.
      */

      setRating(0);
      setComment("");
      setHoverRating(0);
    } catch (error) {
      console.error(
        "Error submitting feedback:",
        error
      );

      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Average rating
  const averageRating =
    feedbacks.length > 0
      ? (
          feedbacks.reduce(
            (total, feedback) =>
              total + Number(feedback.rating),
            0
          ) / feedbacks.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-10 sm:px-6 lg:px-8">

      <div className="mx-auto w-full max-w-3xl">

        {/* Header */}
        <div className="mb-8 text-center">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-3xl shadow-lg shadow-indigo-200">
            🍽️
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Meal Feedback
          </h1>

          <p className="mt-3 text-base text-gray-500 sm:text-lg">
            Tell us how your meal was today
          </p>

        </div>

        {/* Feedback Form */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/60 sm:p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-7"
          >

            {/* Meal */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Select your meal
              </label>

              <div className="relative">

                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl">
                  🍛
                </span>

                <select
                  value={meal}
                  onChange={(e) =>
                    setMeal(e.target.value)
                  }
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-12 py-3.5 text-gray-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                >
                  <option value="Breakfast">
                    Breakfast
                  </option>

                  <option value="Lunch">
                    Lunch
                  </option>

                  <option value="Dinner">
                    Dinner
                  </option>
                </select>

                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  ▼
                </span>

              </div>

            </div>

            {/* Rating */}
            <div>

              <label className="mb-3 block text-sm font-semibold text-gray-700">
                How was your meal?
              </label>

              <div className="flex justify-center gap-2 sm:gap-4">

                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setRating(star)
                      }
                      onMouseEnter={() =>
                        setHoverRating(star)
                      }
                      onMouseLeave={() =>
                        setHoverRating(0)
                      }
                      className={`text-4xl transition-all duration-150 hover:scale-125 sm:text-5xl ${
                        star <=
                        (hoverRating || rating)
                          ? "text-yellow-400 drop-shadow-sm"
                          : "text-gray-200"
                      }`}
                    >
                      ★
                    </button>
                  )
                )}

              </div>

              <p className="mt-3 text-center text-sm text-gray-500">
                {rating === 0
                  ? "Tap a star to rate your meal"
                  : `You rated this meal ${rating} out of 5`}
              </p>

            </div>

            {/* Comment */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Your feedback
              </label>

              <textarea
                value={comment}
                onChange={(e) =>
                  setComment(e.target.value)
                }
                placeholder="Tell us what you liked or what could be better..."
                rows={5}
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-4 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />

            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading
                ? "Submitting..."
                : "Submit Feedback"}

              {!loading && (
                <span className="text-xl transition-transform group-hover:translate-x-1">
                  →
                </span>
              )}
            </button>

          </form>

        </div>

        {/* Statistics */}
        <div className="mt-6 grid grid-cols-2 gap-4">

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-md shadow-gray-200/50">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-50 text-2xl">
                ⭐
              </div>

              <div>

                <p className="text-2xl font-bold text-gray-900">
                  {averageRating}
                </p>

                <p className="text-xs font-medium text-gray-500">
                  Average Rating
                </p>

              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-md shadow-gray-200/50">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-2xl">
                💬
              </div>

              <div>

                <p className="text-2xl font-bold text-gray-900">
                  {feedbacks.length}
                </p>

                <p className="text-xs font-medium text-gray-500">
                  Total Reviews
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* Recent Feedback */}
        <div className="mt-10">

          <div className="mb-5 flex items-end justify-between">

            <div>

              <h2 className="text-2xl font-bold text-gray-900">
                Recent Feedback
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                What students are saying
              </p>

            </div>

            <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600">
              {feedbacks.length}{" "}
              {feedbacks.length === 1
                ? "Review"
                : "Reviews"}
            </span>

          </div>

          {feedbacks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">

              <div className="mb-3 text-4xl">
                💬
              </div>

              <h3 className="font-semibold text-gray-800">
                No feedback yet
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Be the first student to share your
                experience!
              </p>

            </div>
          ) : (
            <div className="space-y-4">

              {feedbacks.map((feedback) => (
                <div
                  key={feedback.id}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-md shadow-gray-200/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 text-xl">
                        🍽️
                      </div>

                      <div>

                        <h3 className="font-bold text-gray-900">
                          {feedback.meal}
                        </h3>

                        <p className="text-xs text-gray-400">
                          Meal Review
                        </p>

                      </div>

                    </div>

                    <span className="rounded-lg bg-yellow-50 px-2.5 py-1.5 text-sm font-bold text-yellow-700">
                      ⭐ {feedback.rating}/5
                    </span>

                  </div>

                  <div className="mt-4 text-lg tracking-wide">

                    <span className="text-yellow-400">
                      {"★".repeat(
                        Number(feedback.rating)
                      )}
                    </span>

                    <span className="text-gray-200">
                      {"★".repeat(
                        5 -
                          Number(
                            feedback.rating
                          )
                      )}
                    </span>

                  </div>

                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    "{feedback.comment}"
                  </p>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default Feedback;