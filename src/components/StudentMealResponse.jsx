import { useState } from "react";
import { useDispatch } from "react-redux";

import { setAttendance } from "../features/meals/mealSlice";

import { addMealAttendance } from "../services/mealService";


function StudentMealResponse({ meal }) {

  const dispatch = useDispatch();

  const [response, setResponse] = useState("");

  const [loading, setLoading] = useState(false);


  // =====================================================
  // HANDLE YES / NO
  // =====================================================

  const handleResponse = async (selectedResponse) => {

    try {

      setLoading(true);

      const attendanceData = {

        mealId: meal.id,

        studentId: "student-demo",

        response: selectedResponse,

        mealType: meal.mealType,

        date: meal.date,

      };


      const savedAttendance =
        await addMealAttendance(
          attendanceData
        );


      // Store response in Redux
      dispatch(
        setAttendance({
          mealId: meal.id,
          response: selectedResponse,
        })
      );


      setResponse(selectedResponse);


      alert(
        `Meal response saved: ${selectedResponse}`
      );


      console.log(
        "Saved attendance:",
        savedAttendance
      );

    } catch (error) {

      console.error(
        "Error saving meal response:",
        error
      );

      alert(
        "Failed to save meal response"
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div>

      <h2>
        {meal.mealType}
      </h2>


      <p>
        Date: {meal.date}
      </p>


      <p>
        Timing: {meal.timing}
      </p>


      <p>
        Items:{" "}

        {Array.isArray(meal.items)
          ? meal.items.join(", ")
          : meal.items}

      </p>


      <h3>
        Will you attend this meal?
      </h3>


      {/* YES BUTTON */}

      <button
        type="button"
        onClick={() =>
          handleResponse("YES")
        }
        disabled={loading}
      >

        YES

      </button>


      {" "}


      {/* NO BUTTON */}

      <button
        type="button"
        onClick={() =>
          handleResponse("NO")
        }
        disabled={loading}
      >

        NO

      </button>


      {/* CURRENT RESPONSE */}

      {response && (

        <p>

          Your response:

          {" "}

          <strong>
            {response}
          </strong>

        </p>

      )}

    </div>

  );

}


export default StudentMealResponse;