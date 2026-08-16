import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import StudentMealResponse from "../../components/StudentMealResponse";

import {
  setMenus,
  setLoading,
  setError,
} from "../../features/menu/menuSlice";

import {
  subscribeToMenus,
} from "../../services/menuService";


function StudentMenu() {

  const dispatch = useDispatch();

  const {
    menus,
    loading,
    error,
  } = useSelector(
    (state) => state.menu
  );


  // =====================================================
  // REAL-TIME FIREBASE MENUS
  // =====================================================

  useEffect(() => {

    dispatch(setLoading(true));

    const unsubscribe =
      subscribeToMenus((data) => {

        dispatch(setMenus(data));

        dispatch(setLoading(false));

      });


    return () => {
      unsubscribe();
    };

  }, [dispatch]);


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center">

        <div className="text-center">

          <div className="text-6xl mb-5 animate-pulse">
            🍽️
          </div>

          <h2 className="text-2xl font-bold text-gray-800">
            Loading today's menu...
          </h2>

          <p className="text-gray-500 mt-2">
            Please wait while we fetch the latest meals.
          </p>

        </div>

      </div>

    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (

      <div className="min-h-screen bg-red-50 flex items-center justify-center px-4">

        <div className="bg-white rounded-3xl shadow-lg p-8 text-center max-w-md">

          <div className="text-5xl mb-4">
            ⚠️
          </div>

          <h2 className="text-2xl font-bold text-red-600">
            Unable to load menu
          </h2>

          <p className="text-gray-600 mt-3">
            {error}
          </p>

          <p className="text-sm text-gray-400 mt-4">
            Please try refreshing the page.
          </p>

        </div>

      </div>

    );

  }


  // =====================================================
  // STUDENT MENU
  // =====================================================

  return (

    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 px-4 py-10">

      <div className="max-w-6xl mx-auto">


        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="text-center mb-10">

          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-2xl text-4xl mb-4">
            🍽️
          </div>

          <p className="text-orange-500 font-semibold uppercase tracking-widest text-sm">
            Student Dashboard
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2">
            Today's Menu
          </h1>

          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            Check today's meals and let the mess know whether
            you will be attending.
          </p>

        </div>


        {/* ================================================= */}
        {/* MENU COUNT */}
        {/* ================================================= */}

        <div className="flex justify-center mb-8">

          <div className="bg-white rounded-2xl shadow-sm border border-orange-100 px-6 py-3 flex items-center gap-3">

            <span className="text-2xl">
              🍴
            </span>

            <div>

              <p className="text-xs text-gray-500">
                Available Meals
              </p>

              <p className="text-xl font-bold text-orange-500">
                {menus.length}
              </p>

            </div>

          </div>

        </div>


        {/* ================================================= */}
        {/* NO MENUS */}
        {/* ================================================= */}

        {menus.length === 0 ? (

          <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-12 text-center">

            <div className="text-6xl mb-5">
              🍽️
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              No meals available
            </h2>

            <p className="text-gray-500 mt-2">
              The mess has not published any menus yet.
            </p>

          </div>

        ) : (

          /* ================================================= */
          /* MENU CARDS */
          /* ================================================= */

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {menus.map((menu) => (

              <div
                key={menu.id}
                className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition duration-300"
              >

                {/* Meal header */}

                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-5 text-white">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-sm opacity-90">
                        Today's Meal
                      </p>

                      <h2 className="text-2xl font-bold mt-1">
                        {menu.mealType}
                      </h2>

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


                {/* Meal details */}

                <div className="p-5">

                  {/* Date & timing */}

                  <div className="grid grid-cols-2 gap-3 mb-5">

                    <div className="bg-orange-50 rounded-2xl p-3">

                      <p className="text-xs text-gray-500">
                        Date
                      </p>

                      <p className="font-semibold text-gray-800 mt-1">
                        {menu.date}
                      </p>

                    </div>


                    <div className="bg-blue-50 rounded-2xl p-3">

                      <p className="text-xs text-gray-500">
                        Timing
                      </p>

                      <p className="font-semibold text-gray-800 mt-1">
                        {menu.timing}
                      </p>

                    </div>

                  </div>


                  {/* Food items */}

                  <div className="mb-6">

                    <p className="text-sm font-semibold text-gray-600 mb-2">
                      🍴 Today's Food
                    </p>

                    <div className="flex flex-wrap gap-2">

                      {Array.isArray(menu.items) &&
                        menu.items.map(
                          (item, index) => (

                            <span
                              key={index}
                              className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700"
                            >
                              {item}
                            </span>

                          )
                        )}

                    </div>

                  </div>


                  {/* Student response */}

                  <div className="border-t border-gray-100 pt-5">

                    <StudentMealResponse
                      meal={menu}
                    />

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  );

}


export default StudentMenu;