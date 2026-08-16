import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  setMeals,
  setLoading,
  setError,
} from "../../features/meals/mealSlice";

import {
  getMealsFromFirebase,
} from "../../services/mealService";

function MealDemand() {
  const dispatch = useDispatch();

  const {
    meals,
    loading,
    error,
  } = useSelector(
    (state) => state.meal
  );

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        dispatch(setLoading(true));

        const data =
          await getMealsFromFirebase();

        dispatch(setMeals(data));
      } catch (error) {
        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchMeals();
  }, [dispatch]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold">
          Loading meals...
        </h2>
      </div>
    );
  }


  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-red-600">
          Error: {error}
        </h2>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-orange-50 p-6">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">
          Meal Demand
        </h1>

        <p className="text-center text-gray-500 mb-8">
          View meals and monitor student demand.
        </p>


        {meals.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow">
            <p className="text-gray-500">
              No meals available.
            </p>
          </div>
        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {meals.map((meal) => (

              <div
                key={meal.id}
                className="bg-white rounded-2xl shadow-md p-6"
              >

                <h2 className="text-2xl font-bold text-orange-600">
                  {meal.mealType}
                </h2>

                <p className="mt-3">
                  <span className="font-semibold">
                    Date:
                  </span>{" "}
                  {meal.date}
                </p>

                <p>
                  <span className="font-semibold">
                    Timing:
                  </span>{" "}
                  {meal.timing}
                </p>

                {meal.items && (
                  <p className="mt-3">
                    <span className="font-semibold">
                      Items:
                    </span>{" "}
                    {Array.isArray(meal.items)
                      ? meal.items.join(", ")
                      : meal.items}
                  </p>
                )}

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default MealDemand;