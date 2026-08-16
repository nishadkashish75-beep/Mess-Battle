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
  // GET REAL-TIME MENUS FROM FIREBASE
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


  // =====================================================
  // STUDENT MENU
  // =====================================================

  return (

    <div>

      <h1>
        Today's Menu
      </h1>


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
              padding: "20px",
              margin: "15px 0",
            }}
          >

            <StudentMealResponse
              meal={menu}
            />

          </div>

        ))

      )}

    </div>

  );
}


export default StudentMenu;