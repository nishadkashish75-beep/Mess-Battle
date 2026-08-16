import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import MenuForm from "../../components/MenuForm";

import {
  setMenus,
  setLoading,
  setError,
} from "../../features/menu/menuSlice";

import {
  getMenusFromFirebase,
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

  const [editingMenu, setEditingMenu] = useState(null);


  // =========================
  // FETCH MENUS
  // =========================

  const fetchMenus = async () => {

    try {

      dispatch(setLoading(true));

      const data = await getMenusFromFirebase();

      dispatch(setMenus(data));

    } catch (error) {

      dispatch(
        setError(error.message)
      );

    } finally {

      dispatch(setLoading(false));

    }

  };


  // Fetch menus when page loads
  useEffect(() => {

    fetchMenus();

  }, []);


  // =========================
  // DELETE MENU
  // =========================

  const handleDelete = async (menuId) => {

    try {

      await deleteMenuFromFirebase(menuId);

      alert("Menu deleted successfully!");

      // Refresh list
      await fetchMenus();

    } catch (error) {

      console.error(
        "Error deleting menu:",
        error
      );

      alert("Failed to delete menu");

    }

  };


  // =========================
  // EDIT MENU
  // =========================

  const handleEdit = (menu) => {

    setEditingMenu(menu);

  };


  // =========================
  // CANCEL EDIT
  // =========================

  const handleCancelEdit = () => {

    setEditingMenu(null);

  };


  // =========================
  // AFTER UPDATE
  // =========================

  const handleMenuUpdated = async () => {

    // Get updated data from Firebase
    await fetchMenus();

    // Exit edit mode
    setEditingMenu(null);

  };


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <h2>
        Loading menus...
      </h2>
    );

  }


  // =========================
  // ERROR
  // =========================

  if (error) {

    return (
      <h2>
        Error: {error}
      </h2>
    );

  }


  return (

    <div>

      <h1>
        Staff Menu Management
      </h1>


      {/* ========================= */}
      {/* ADD / EDIT FORM */}
      {/* ========================= */}

      <MenuForm
        editingMenu={editingMenu}
        onCancelEdit={handleCancelEdit}
        onMenuUpdated={handleMenuUpdated}
      />


      <hr />


      {/* ========================= */}
      {/* EXISTING MENUS */}
      {/* ========================= */}

      <h2>
        Existing Menus
      </h2>


      {menus.length === 0 ? (

        <p>
          No menus available.
        </p>

      ) : (

        menus.map((menu) => (

          <div key={menu.id}>

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


            {/* EDIT */}

            <button
              onClick={() =>
                handleEdit(menu)
              }
            >
              Edit
            </button>


            {" "}


            {/* DELETE */}

            <button
              onClick={() =>
                handleDelete(menu.id)
              }
            >
              Delete
            </button>


            <hr />

          </div>

        ))

      )}

    </div>

  );

}


export default StaffMenu;