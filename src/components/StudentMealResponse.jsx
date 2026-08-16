import { useEffect, useState } from "react";

import {
  addMealAttendance,
  getAttendanceByMeal,
} from "../services/mealService";


function StudentMealResponse({ meal }) {

  const [response, setResponse] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // =====================================================
  // GET CURRENT STUDENT RESPONSE
  // =====================================================

  useEffect(() => {

    const loadResponse = async () => {

      try {

        const studentId =
          localStorage.getItem(
            "messStudentId"
          );

        if (!studentId) {
          return;
        }

        const attendance =
          await getAttendanceByMeal(
            meal.id
          );

        const myResponse =
          attendance.find(
            (item) =>
              item.studentId === studentId
          );

        if (myResponse) {

          setResponse(
            myResponse.response
          );

        }

      } catch (error) {

        console.error(
          "Error loading response:",
          error
        );

      }
    };


    loadResponse();

  }, [meal.id]);


  // =====================================================
  // HANDLE YES / NO
  // =====================================================

  const handleResponse = async (
    selectedResponse
  ) => {

    if (loading) {
      return;
    }

    try {

      setLoading(true);


      const attendanceData = {

        mealId: meal.id,

        mealType: meal.mealType,

        date: meal.date,

        timing: meal.timing,

        response: selectedResponse,

      };


      await addMealAttendance(
        attendanceData
      );


      setResponse(
        selectedResponse
      );


    } catch (error) {

      console.error(
        "Error saving response:",
        error
      );

      alert(
        "Unable to save your response."
      );

    } finally {

      setLoading(false);

    }
  };


  return (

    <div className="mt-5">

      {/* QUESTION */}

      <div className="text-center">

        <h3 className="text-lg font-bold text-slate-800">

          Will you attend this meal?

        </h3>


        <p className="text-sm text-slate-500 mt-1">

          Help the mess prepare the right
          amount of food.

        </p>

      </div>


      {/* BUTTONS */}

      <div className="flex justify-center gap-3 mt-4">

        <button

          onClick={() =>
            handleResponse("YES")
          }

          disabled={loading}

          className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
            response === "YES"

              ? "bg-green-600 text-white shadow-lg"

              : "bg-green-50 text-green-700 border border-green-200 hover:bg-green-600 hover:text-white"
          }`}

        >

          ✓ YES

        </button>


        <button

          onClick={() =>
            handleResponse("NO")
          }

          disabled={loading}

          className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
            response === "NO"

              ? "bg-red-600 text-white shadow-lg"

              : "bg-red-50 text-red-700 border border-red-200 hover:bg-red-600 hover:text-white"
          }`}

        >

          ✕ NO

        </button>

      </div>


      {/* RESPONSE */}

      {response && (

        <div
          className={`mt-4 text-center rounded-xl px-4 py-3 ${
            response === "YES"

              ? "bg-green-50 text-green-700"

              : "bg-red-50 text-red-700"
          }`}
        >

          <p className="text-xs uppercase tracking-wide">

            Your response

          </p>


          <p className="font-bold text-lg mt-1">

            {response === "YES"

              ? "✓ Attending"

              : "✕ Not attending"}

          </p>

        </div>

      )}

    </div>

  );
}


export default StudentMealResponse;