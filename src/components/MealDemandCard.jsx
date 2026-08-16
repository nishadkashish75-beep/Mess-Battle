function MealDemandCard({ meal }) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "20px",
        margin: "15px 0",
        borderRadius: "8px",
      }}
    >
      <h3>{meal.mealType}</h3>

      <p>
        <strong>Date:</strong> {meal.date}
      </p>

      <p>
        <strong>Timing:</strong> {meal.timing}
      </p>

      <hr />

      <p>
        <strong>Expected Demand:</strong>{" "}
        {meal.yesCount}
      </p>

      <p>
        <strong>YES:</strong>{" "}
        {meal.yesCount}
      </p>

      <p>
        <strong>NO:</strong>{" "}
        {meal.noCount}
      </p>

      <p>
        <strong>Total Responses:</strong>{" "}
        {meal.totalResponses}
      </p>
    </div>
  );
}

export default MealDemandCard;