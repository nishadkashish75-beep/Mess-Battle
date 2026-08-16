import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  onSnapshot,
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
        updatedAt: serverTimestamp(),
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

    const menus = snapshot.docs.map((menuDoc) => {
      const data = menuDoc.data();

      return {
        id: menuDoc.id,
        ...data,

        // Firebase Timestamp → normal string
        createdAt: data.createdAt
          ? data.createdAt.toDate().toISOString()
          : null,

        updatedAt: data.updatedAt
          ? data.updatedAt.toDate().toISOString()
          : null,
      };
    });

    return menus;
  } catch (error) {
    console.error(
      "Error fetching menus:",
      error
    );

    throw error;
  }
};


// =====================================================
// UPDATE MENU
// =====================================================

export const updateMenuInFirebase = async (
  menuId,
  menuData
) => {
  try {
    if (!menuId) {
      throw new Error("Menu ID is missing.");
    }

    const menuRef = doc(
      db,
      "menus",
      menuId
    );

    await updateDoc(
      menuRef,
      {
        ...menuData,
        updatedAt: serverTimestamp(),
      }
    );

    return {
      id: menuId,
      ...menuData,
    };
  } catch (error) {
    console.error(
      "Error updating menu:",
      error
    );

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
    if (!menuId) {
      throw new Error("Menu ID is missing.");
    }

    const menuRef = doc(
      db,
      "menus",
      menuId
    );

    await deleteDoc(menuRef);

    return menuId;
  } catch (error) {
    console.error(
      "Error deleting menu:",
      error
    );

    throw error;
  }
};


// =====================================================
// REAL-TIME MENU LISTENER
// =====================================================

export const subscribeToMenus = (
  callback
) => {
  const unsubscribe = onSnapshot(
    collection(db, "menus"),

    (snapshot) => {
      const menus = snapshot.docs.map(
        (menuDoc) => {
          const data = menuDoc.data();

          return {
            id: menuDoc.id,
            ...data,

            // Convert Firebase Timestamp
            // before sending to Redux
            createdAt: data.createdAt
              ? data.createdAt
                  .toDate()
                  .toISOString()
              : null,

            updatedAt: data.updatedAt
              ? data.updatedAt
                  .toDate()
                  .toISOString()
              : null,
          };
        }
      );

      callback(menus);
    },

    (error) => {
      console.error(
        "Real-time menu error:",
        error
      );
    }
  );

  return unsubscribe;
};