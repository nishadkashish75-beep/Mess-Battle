import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/config";


// =====================================================
// ADD MEAL ATTENDANCE
// =====================================================

export const addMealAttendance = async (
  attendanceData
) => {

  try {

    const docRef = await addDoc(
      collection(db, "mealAttendance"),
      {
        ...attendanceData,
        createdAt: serverTimestamp(),
      }
    );


    return {
      id: docRef.id,
      ...attendanceData,
    };

  } catch (error) {

    console.error(
      "Error adding meal attendance:",
      error
    );

    throw error;
  }
};


// =====================================================
// GET ALL MEAL ATTENDANCE
// =====================================================

export const getMealAttendance =
  async () => {

    try {

      const snapshot = await getDocs(
        collection(
          db,
          "mealAttendance"
        )
      );


      const attendance =
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));


      return attendance;

    } catch (error) {

      console.error(
        "Error fetching meal attendance:",
        error
      );

      throw error;
    }
  };


// =====================================================
// GET ATTENDANCE FOR A PARTICULAR MEAL
// =====================================================

export const getAttendanceByMeal =
  async (mealId) => {

    try {

      const attendanceQuery = query(

        collection(
          db,
          "mealAttendance"
        ),

        where(
          "mealId",
          "==",
          mealId
        )

      );


      const snapshot =
        await getDocs(
          attendanceQuery
        );


      const attendance =
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));


      return attendance;

    } catch (error) {

      console.error(
        "Error fetching meal attendance:",
        error
      );

      throw error;
    }
  };