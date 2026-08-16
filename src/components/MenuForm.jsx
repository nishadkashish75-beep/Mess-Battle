import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import {
  addMenu,
  updateMenu,
} from "../features/menu/menuSlice";

import {
  addMenuToFirebase,
  updateMenuInFirebase,
} from "../services/menuService";


function MenuForm({
  editingMenu,
  onCancelEdit,
  onMenuUpdated,
}) {

  const dispatch = useDispatch();

  const [date, setDate] = useState("");
  const [mealType, setMealType] = useState("Breakfast");
  const [items, setItems] = useState("");
  const [timing, setTiming] = useState("");

  const [submitting, setSubmitting] =
    useState(false);


  // =====================================================
  // LOAD MENU DATA WHEN EDITING
  // =====================================================

  useEffect(() => {

    if (editingMenu) {

      setDate(editingMenu.date || "");

      setMealType(
        editingMenu.mealType || "Breakfast"
      );

      setItems(
        Array.isArray(editingMenu.items)
          ? editingMenu.items.join(", ")
          : editingMenu.items || ""
      );

      setTiming(
        editingMenu.timing || ""
      );

    } else {

      setDate("");
      setMealType("Breakfast");
      setItems("");
      setTiming("");

    }

  }, [editingMenu]);


  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    const menuData = {

      date,

      mealType,

      items: items
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== ""),

      timing,

    };


    if (menuData.items.length === 0) {

      alert("Please enter at least one food item.");

      return;

    }


    try {

      setSubmitting(true);


      // =================================================
      // UPDATE EXISTING MENU
      // =================================================

      if (editingMenu) {

        const updatedMenu =
          await updateMenuInFirebase(
            editingMenu.id,
            menuData
          );


        dispatch(
          updateMenu(updatedMenu)
        );


        alert(
          "Menu updated successfully!"
        );


        if (onMenuUpdated) {

          onMenuUpdated();

        }

      }


      // =================================================
      // ADD NEW MENU
      // =================================================

      else {

        const newMenu =
          await addMenuToFirebase(
            menuData
          );


        dispatch(
          addMenu(newMenu)
        );


        alert(
          "Menu added successfully!"
        );

      }


      // Clear form

      setDate("");
      setMealType("Breakfast");
      setItems("");
      setTiming("");


    } catch (error) {

      console.error(
        "Menu operation error:",
        error
      );

      alert(
        editingMenu
          ? "Failed to update menu."
          : "Failed to add menu."
      );

    } finally {

      setSubmitting(false);

    }

  };


  return (

    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >

      {/* ================================================= */}
      {/* DATE */}
      {/* ================================================= */}

      <div>

        <label
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Meal Date
        </label>

        <input
          type="date"
          value={date}
          onChange={(e) =>
            setDate(e.target.value)
          }
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
        />

      </div>


      {/* ================================================= */}
      {/* MEAL TYPE */}
      {/* ================================================= */}

      <div>

        <label
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Meal Type
        </label>

        <select
          value={mealType}
          onChange={(e) =>
            setMealType(e.target.value)
          }
          className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition bg-white"
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

      </div>


      {/* ================================================= */}
      {/* FOOD ITEMS */}
      {/* ================================================= */}

      <div>

        <label
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Food Items
        </label>

        <input
          type="text"
          placeholder="Rajma, Rice, Roti"
          value={items}
          onChange={(e) =>
            setItems(e.target.value)
          }
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
        />

        <p className="text-xs text-gray-500 mt-2">
          Separate multiple items with commas.
        </p>

      </div>


      {/* ================================================= */}
      {/* TIMING */}
      {/* ================================================= */}

      <div>

        <label
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Meal Timing
        </label>

        <input
          type="text"
          placeholder="1:00 PM - 2:00 PM"
          value={timing}
          onChange={(e) =>
            setTiming(e.target.value)
          }
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
        />

      </div>


      {/* ================================================= */}
      {/* BUTTONS */}
      {/* ================================================= */}

      <div className="flex flex-col sm:flex-row gap-3 pt-2">

        <button
          type="submit"
          disabled={submitting}
          className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-orange-600 hover:to-red-600 transition shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
        >

          {submitting
            ? "Saving..."
            : editingMenu
              ? "Update Menu"
              : "Add Menu"}

        </button>


        {editingMenu && (

          <button
            type="button"
            onClick={onCancelEdit}
            className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition"
          >
            Cancel
          </button>

        )}

      </div>

    </form>

  );

}


export default MenuForm;