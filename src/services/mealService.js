import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  onSnapshot,
  doc,
  setDoc,
} from "firebase/firestore";

import { db } from "../firebase/config";


// =====================================================
// ADD MEAL
// =====================================================

export const addMealToFirebase = async (
  mealData
) => {
  try {
    const docRef = await addDoc(
      collection(db, "meals"),
      {
        ...mealData,
        createdAt: serverTimestamp(),
      }
    );

    return {
      id: docRef.id,
      ...mealData,
    };
  } catch (error) {
    console.error(
      "Error adding meal:",
      error
    );

    throw error;
  }
};


// =====================================================
// GET ALL MEALS
// =====================================================

export const getMealsFromFirebase =
  async () => {
    try {
      const snapshot = await getDocs(
        collection(db, "meals")
      );

      const meals =
        snapshot.docs.map((mealDoc) => {
          const data = mealDoc.data();

          return {
            id: mealDoc.id,
            ...data,

            createdAt:
              data.createdAt
                ? data.createdAt
                    .toDate()
                    .toISOString()
                : null,
          };
        });

      return meals;
    } catch (error) {
      console.error(
        "Error fetching meals:",
        error
      );

      throw error;
    }
  };


// =====================================================
// ADD / UPDATE MEAL ATTENDANCE
// =====================================================

export const addMealAttendance =
  async (attendanceData) => {
    try {

      let studentId =
        localStorage.getItem(
          "messStudentId"
        );

      // Create a simple student ID
      // if one doesn't exist
      if (!studentId) {
        studentId =
          "student_" +
          Date.now() +
          "_" +
          Math.random()
            .toString(36)
            .substring(2, 9);

        localStorage.setItem(
          "messStudentId",
          studentId
        );
      }


      // One student gets one response
      // for one particular meal
      const documentId =
        `${studentId}_${attendanceData.mealId}`;


      await setDoc(
        doc(
          db,
          "mealAttendance",
          documentId
        ),
        {
          ...attendanceData,

          studentId,

          updatedAt:
            serverTimestamp(),
        }
      );


      return {
        id: documentId,
        ...attendanceData,
        studentId,
      };

    } catch (error) {

      console.error(
        "Error saving meal attendance:",
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

      const snapshot =
        await getDocs(
          collection(
            db,
            "mealAttendance"
          )
        );


      return snapshot.docs.map(
        (attendanceDoc) => {
          const data =
            attendanceDoc.data();

          return {
            id: attendanceDoc.id,
            ...data,

            updatedAt:
              data.updatedAt
                ? data.updatedAt
                    .toDate()
                    .toISOString()
                : null,
          };
        }
      );

    } catch (error) {

      console.error(
        "Error fetching meal attendance:",
        error
      );

      throw error;
    }
  };


// =====================================================
// GET ATTENDANCE FOR PARTICULAR MEAL
// =====================================================

export const getAttendanceByMeal =
  async (mealId) => {

    try {

      const attendanceQuery =
        query(
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


      return snapshot.docs.map(
        (attendanceDoc) => {
          const data =
            attendanceDoc.data();

          return {
            id: attendanceDoc.id,
            ...data,

            updatedAt:
              data.updatedAt
                ? data.updatedAt
                    .toDate()
                    .toISOString()
                : null,
          };
        }
      );

    } catch (error) {

      console.error(
        "Error fetching attendance:",
        error
      );

      throw error;
    }
  };


// =====================================================
// REAL-TIME MEAL ATTENDANCE
// =====================================================

export const subscribeToMealAttendance = (
  mealId,
  callback
) => {

  const attendanceQuery =
    query(
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


  const unsubscribe =
    onSnapshot(

      attendanceQuery,

      (snapshot) => {

        const attendance =
          snapshot.docs.map(
            (attendanceDoc) => {
              const data =
                attendanceDoc.data();

              return {
                id: attendanceDoc.id,
                ...data,

                updatedAt:
                  data.updatedAt
                    ? data.updatedAt
                        .toDate()
                        .toISOString()
                    : null,
              };
            }
          );


        callback(attendance);
      },

      (error) => {

        console.error(
          "Real-time attendance error:",
          error
        );
      }
    );


  return unsubscribe;
};