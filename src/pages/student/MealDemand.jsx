import { useEffect, useState } from "react";

import { getAttendanceByMeal } from "../../services/mealService";

import MealDemandCard from "../../components/MealDemandCard";


function MealDemand({ menus }) {

  const [demand, setDemand] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  useEffect(() => {

    const fetchDemand = async () => {

      try {

        setLoading(true);
        setError("");

        const results = await Promise.all(

          menus.map(async (menu) => {

            const attendance =
              await getAttendanceByMeal(menu.id);


            const yesCount =
              attendance.filter(
                (item) => item.response === "YES"
              ).length;


            const noCount =
              attendance.filter(
                (item) => item.response === "NO"
              ).length;


            return {
              ...menu,
              yesCount,
              noCount,
              totalResponses: attendance.length,
            };

          })

        );


        setDemand(results);

      } catch (error) {

        console.error(
          "Error loading meal demand:",
          error
        );

        setError(
          "Failed to load meal demand"
        );

      } finally {

        setLoading(false);

      }

    };


    if (menus && menus.length > 0) {

      fetchDemand();

    } else {

      setDemand([]);

      setLoading(false);

    }

  }, [menus]);


  if (loading) {

    return (
      <div>

        <h2>
          Meal Demand
        </h2>

        <p>
          Loading demand...
        </p>

      </div>
    );

  }


  if (error) {

    return (
      <div>

        <h2>
          Meal Demand
        </h2>

        <p>
          {error}
        </p>

      </div>
    );

  }


  return (

    <div>

      <h2>
        Meal Demand
      </h2>


      {demand.length === 0 ? (

        <p>
          No meal demand available.
        </p>

      ) : (

        demand.map((meal) => (

          <MealDemandCard
            key={meal.id}
            meal={meal}
          />

        ))

      )}

    </div>

  );

}


export default MealDemand;