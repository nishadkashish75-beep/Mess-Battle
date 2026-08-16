import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import MenuForm from "../../components/MenuForm";

import {
  setMenus,
  setLoading,
  setError,
} from "../../features/menu/menuSlice";

import {
  subscribeToMenus,
  deleteMenuFromFirebase,
} from "../../services/menuService";


function StaffMenu() {

  const dispatch = useDispatch();

  const {
    menus,
    loading,
    error,
  } = useSelector(
    (state) => state.menu
  );

  const [editingMenu, setEditingMenu] =
    useState(null);


  // =====================================================
  // REAL-TIME MENU LISTENER
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
  // DELETE MENU
  // =====================================================

  const handleDelete = async (menuId) => {

    try {

      await deleteMenuFromFirebase(menuId);

      alert("Menu deleted successfully!");

    } catch (error) {

      console.error(
        "Error deleting menu:",
        error
      );

      alert("Failed to delete menu.");

    }
  };


  // =====================================================
  // EDIT MENU
  // =====================================================

  const handleEdit = (menu) => {

    setEditingMenu(menu);

  };


  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const handleCancelEdit = () => {

    setEditingMenu(null);

  };


  // =====================================================
  // AFTER UPDATE
  // =====================================================

  const handleMenuUpdated = () => {

    setEditingMenu(null);

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">

        <div className="text-center">

          <div className="text-4xl mb-3">
            🍽️
          </div>

          <h2 className="text-xl font-semibold text-gray-700">
            Loading menus...
          </h2>

        </div>

      </div>
    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">

        <div className="text-center">

          <h2 className="text-xl font-bold text-red-600">
            Something went wrong
          </h2>

          <p className="text-gray-600 mt-2">
            {error}
          </p>

        </div>

      </div>
    );

  }


  return (

    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">

        <div className="max-w-6xl mx-auto px-6 py-8">

          <p className="text-orange-100 text-sm font-medium">
            STAFF PANEL
          </p>

          <h1 className="text-3xl md:text-4xl font-bold mt-1">
            Menu Management 🍽️
          </h1>

          <p className="text-orange-100 mt-2">
            Add, update and manage daily mess menus.
          </p>

        </div>

      </div>


      <div className="max-w-6xl mx-auto px-6 py-8">


        {/* ================================================= */}
        {/* ADD / EDIT MENU */}
        {/* ================================================= */}

        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6 mb-8">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-2xl font-bold text-gray-800">

                {editingMenu
                  ? "Edit Menu"
                  : "Add New Menu"}

              </h2>

              <p className="text-gray-500 text-sm mt-1">

                {editingMenu
                  ? "Update the selected meal details."
                  : "Create a new breakfast, lunch or dinner menu."}

              </p>

            </div>

            <div className="text-4xl">
              🍴
            </div>

          </div>


          <MenuForm
            editingMenu={editingMenu}
            onCancelEdit={handleCancelEdit}
            onMenuUpdated={handleMenuUpdated}
          />

        </div>


        {/* ================================================= */}
        {/* EXISTING MENUS */}
        {/* ================================================= */}

        <div>

          <div className="flex items-center justify-between mb-5">

            <div>

              <h2 className="text-2xl font-bold text-gray-800">
                Existing Menus
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Manage the menus currently available.
              </p>

            </div>

            <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-xl font-semibold">

              {menus.length}{" "}
              {menus.length === 1
                ? "Menu"
                : "Menus"}

            </div>

          </div>


          {menus.length === 0 ? (

            <div className="bg-white rounded-2xl shadow-md p-10 text-center">

              <div className="text-5xl mb-4">
                🍽️
              </div>

              <h3 className="text-xl font-semibold text-gray-700">
                No menus available
              </h3>

              <p className="text-gray-500 mt-2">
                Add your first meal menu using the form above.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {menus.map((menu) => (

                <div
                  key={menu.id}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition"
                >

                  {/* CARD HEADER */}

                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-5">

                    <div className="flex items-center justify-between">

                      <h3 className="text-xl font-bold">
                        {menu.mealType}
                      </h3>

                      <span className="text-2xl">
                        {menu.mealType === "Breakfast"
                          ? "🌅"
                          : menu.mealType === "Lunch"
                          ? "☀️"
                          : "🌙"}
                      </span>

                    </div>

                    <p className="text-orange-100 text-sm mt-1">
                      {menu.date}
                    </p>

                  </div>


                  {/* CARD BODY */}

                  <div className="p-5">

                    {/* Timing */}

                    <div className="mb-4">

                      <p className="text-xs font-semibold text-gray-400 uppercase">
                        Timing
                      </p>

                      <p className="text-gray-700 font-medium mt-1">
                        🕐 {menu.timing}
                      </p>

                    </div>


                    {/* Food Items */}

                    <div>

                      <p className="text-xs font-semibold text-gray-400 uppercase">
                        Food Items
                      </p>

                      <div className="flex flex-wrap gap-2 mt-2">

                        {Array.isArray(menu.items)
                          ? menu.items.map(
                              (item, index) => (

                                <span
                                  key={index}
                                  className="bg-orange-50 text-orange-700 px-3 py-1 rounded-lg text-sm font-medium"
                                >
                                  {item}
                                </span>

                              )
                            )
                          : (

                            <span className="text-gray-700">
                              {menu.items}
                            </span>

                          )}

                      </div>

                    </div>


                    {/* ACTION BUTTONS */}

                    <div className="flex gap-3 mt-6">

                      <button
                        onClick={() =>
                          handleEdit(menu)
                        }
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl transition"
                      >
                        ✏️ Edit
                      </button>


                      <button
                        onClick={() =>
                          handleDelete(menu.id)
                        }
                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2.5 rounded-xl transition"
                      >
                        🗑️ Delete
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>

  );
}


export default StaffMenu;