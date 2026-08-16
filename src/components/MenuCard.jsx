function MenuCard({
  menu,
  onEdit,
  onDelete,
}) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "15px",
        margin: "15px 0",
        borderRadius: "8px",
      }}
    >

      <h3>
        {menu.mealType}
      </h3>


      <p>
        <strong>Date:</strong>{" "}
        {menu.date}
      </p>


      <p>
        <strong>Timing:</strong>{" "}
        {menu.timing}
      </p>


      <p>
        <strong>Items:</strong>{" "}

        {Array.isArray(menu.items)
          ? menu.items.join(", ")
          : menu.items}
      </p>


      <button
        onClick={() => onEdit(menu)}
      >
        Edit
      </button>


      {" "}


      <button
        onClick={() => onDelete(menu.id)}
      >
        Delete
      </button>

    </div>
  );
}


export default MenuCard;