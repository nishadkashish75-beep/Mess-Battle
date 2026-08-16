import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/config";


// ADD MENU
export const addMenuToFirebase = async (menuData) => {
  try {
    const docRef = await addDoc(collection(db, "menus"), {
      ...menuData,
      createdAt: serverTimestamp(),
    });

    return {
      id: docRef.id,
      ...menuData,
    };
  } catch (error) {
    console.error("Error adding menu:", error);
    throw error;
  }
};


// GET ALL MENUS
export const getMenusFromFirebase = async () => {
  try {
    const snapshot = await getDocs(collection(db, "menus"));

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


// DELETE MENU
export const deleteMenuFromFirebase = async (menuId) => {
  try {
    await deleteDoc(doc(db, "menus", menuId));

    return menuId;
  } catch (error) {
    console.error("Error deleting menu:", error);
    throw error;
  }
};


// UPDATE MENU
export const updateMenuInFirebase = async (menuId, menuData) => {
  try {
    await updateDoc(
      doc(db, "menus", menuId),
      menuData
    );

    return {
      id: menuId,
      ...menuData,
    };
  } catch (error) {
    console.error("Error updating menu:", error);
    throw error;
  }
};