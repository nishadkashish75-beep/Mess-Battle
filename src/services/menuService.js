import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/config";


// =====================================================
// ADD MENU
// =====================================================

export const addMenuToFirebase = async (menuData) => {
  try {
    const docRef = await addDoc(
      collection(db, "menus"),
      {
        ...menuData,
        createdAt: serverTimestamp(),
      }
    );

    return {
      id: docRef.id,
      ...menuData,
    };

  } catch (error) {
    console.error("Error adding menu:", error);
    throw error;
  }
};


// =====================================================
// GET ALL MENUS
// =====================================================

export const getMenusFromFirebase = async () => {
  try {
    const snapshot = await getDocs(
      collection(db, "menus")
    );

    const menus = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return menus;

  } catch (error) {
    console.error("Error fetching menus:", error);
    throw error;
  }
};


export const updateMenuInFirebase = async (
  menuId,
  menuData
) => {
  try {
    const menuRef = doc(
      db,
      "menus",
      menuId
    );

    await updateDoc(
      menuRef,
      menuData
    );

  } catch (error) {
    console.error("Error updating menu:", error);
    throw error;
  }
};


// =====================================================
// DELETE MENU
// =====================================================

export const deleteMenuFromFirebase = async (
  menuId
) => {
  try {
    const menuRef = doc(
      db,
      "menus",
      menuId
    );

    await deleteDoc(menuRef);

  } catch (error) {
    console.error("Error deleting menu:", error);
    throw error;
  }
};


// =====================================================
// REAL-TIME MENU LISTENER
// =====================================================

export const subscribeToMenus = (callback) => {

  const unsubscribe = onSnapshot(

    collection(db, "menus"),

    (snapshot) => {

      const menus = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      callback(menus);
    },

    (error) => {

      console.error(
        "Error listening to menus:",
        error
      );

    }

  );

  return unsubscribe;
};