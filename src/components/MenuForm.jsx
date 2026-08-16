import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { addMenu } from "../features/menu/menuSlice";

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


  // =========================
  // LOAD EDITING MENU DATA
  // =========================

  useEffect(() => {

    if (editingMenu) {

      setDate(
        editingMenu.date || ""
      );

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

    }

  }, [editingMenu]);


  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();


    const menuData = {

      date: date,

      mealType: mealType,

      items: items
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== ""),

      timing: timing,

    };


    try {

      // =========================
      // UPDATE EXISTING MENU
      // =========================

      if (editingMenu) {

        await updateMenuInFirebase(
          editingMenu.id,
          menuData
        );

        alert(
          "Menu updated successfully!"
        );

        // IMPORTANT:
        // Fetch updated menu list
        await onMenuUpdated();

      }


      // =========================
      // ADD NEW MENU
      // =========================

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

        // Clear form

        setDate("");
        setMealType("Breakfast");
        setItems("");
        setTiming("");

      }

    } catch (error) {

      console.error(
        "Operation error:",
        error
      );

      alert(
        "Operation failed"
      );

    }

  };


  return (

    <form onSubmit={handleSubmit}>

      <h2>

        {editingMenu
          ? "Edit Menu"
          : "Add New Menu"}

      </h2>


      {/* DATE */}

      <div>

        <label>
          Date:
        </label>

        <input
          type="date"
          value={date}
          onChange={(e) =>
            setDate(e.target.value)
          }
          required
        />

      </div>


      <br />


      {/* MEAL TYPE */}

      <div>

        <label>
          Meal Type:
        </label>

        <select
          value={mealType}
          onChange={(e) =>
            setMealType(e.target.value)
          }
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


      <br />


      {/* ITEMS */}

      <div>

        <label>
          Items:
        </label>

        <input
          type="text"
          placeholder="Rajma, Rice, Roti"
          value={items}
          onChange={(e) =>
            setItems(e.target.value)
          }
          required
        />

      </div>


      <br />


      {/* TIMING */}

      <div>

        <label>
          Timing:
        </label>

        <input
          type="text"
          placeholder="1:00 PM - 2:00 PM"
          value={timing}
          onChange={(e) =>
            setTiming(e.target.value)
          }
          required
        />

      </div>


      <br />


      {/* SUBMIT */}

      <button type="submit">

        {editingMenu
          ? "Update Menu"
          : "Add Menu"}

      </button>


      {/* CANCEL */}

      {editingMenu && (

        <button
          type="button"
          onClick={onCancelEdit}
        >
          Cancel
        </button>

      )}

    </form>

  );

}


export default MenuForm;