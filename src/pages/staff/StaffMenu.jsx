import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import MenuForm from "../../components/MenuForm";

import MealDemand from "../student/MealDemand";

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
  // REAL-TIME FIREBASE LISTENER
  // =====================================================

  useEffect(() => {

    dispatch(setLoading(true));

    const unsubscribe = subscribeToMenus(
      (data) => {

        dispatch(setMenus(data));

        dispatch(setLoading(false));

      }
    );


    return () => {
      unsubscribe();
    };

  }, [dispatch]);


  // =====================================================
  // DELETE MENU
  // =====================================================

  const handleDelete = async (menuId) => {

    try {

      await deleteMenuFromFirebase(
        menuId
      );

      alert(
        "Menu deleted successfully!"
      );

    } catch (error) {

      console.error(
        "Error deleting menu:",
        error
      );

      alert(
        "Failed to delete menu"
      );

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
  // AFTER MENU UPDATE
  // =====================================================

  const handleMenuUpdated = () => {

    setEditingMenu(null);

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <h2>
        Loading menus...
      </h2>
    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (
      <h2>
        Error: {error}
      </h2>
    );

  }


  return (

    <div>

      {/* ================================================= */}
      {/* STAFF MENU MANAGEMENT */}
      {/* ================================================= */}

      <h1>
        Staff Menu Management
      </h1>


      {/* ================================================= */}
      {/* ADD / EDIT MENU FORM */}
      {/* ================================================= */}

      <MenuForm
        editingMenu={editingMenu}
        onCancelEdit={handleCancelEdit}
        onMenuUpdated={handleMenuUpdated}
      />


      <hr />


      {/* ================================================= */}
      {/* EXISTING MENUS */}
      {/* ================================================= */}

      <h2>
        Existing Menus
      </h2>


      {menus.length === 0 ? (

        <p>
          No menus available.
        </p>

      ) : (

        menus.map((menu) => (

          <div
            key={menu.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              margin: "15px 0",
            }}
          >

            <h3>
              {menu.mealType}
            </h3>


            <p>
              Date: {menu.date}
            </p>


            <p>
              Timing: {menu.timing}
            </p>


            <p>
              Items:{" "}

              {Array.isArray(menu.items)
                ? menu.items.join(", ")
                : menu.items}

            </p>


            {/* EDIT BUTTON */}

            <button
              onClick={() =>
                handleEdit(menu)
              }
            >
              Edit
            </button>


            {" "}


            {/* DELETE BUTTON */}

            <button
              onClick={() =>
                handleDelete(menu.id)
              }
            >
              Delete
            </button>

          </div>

        ))

      )}


      <hr />


      {/* ================================================= */}
      {/* MEAL DEMAND */}
      {/* ================================================= */}

      <MealDemand menus={menus} />


    </div>

  );

}


export default StaffMenu;