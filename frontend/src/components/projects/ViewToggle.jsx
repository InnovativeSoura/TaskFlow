import {
  FaThLarge,
  FaTable,
} from "react-icons/fa";

const ViewToggle = ({
  view,
  setView,
}) => {
  return (
    <div className="view-toggle">

      <button
        className={
          view === "table"
            ? "active"
            : ""
        }
        onClick={() =>
          setView("table")
        }
        title="Table View"
      >
        <FaTable />

        <span>Table</span>
      </button>

      <button
        className={
          view === "card"
            ? "active"
            : ""
        }
        onClick={() =>
          setView("card")
        }
        title="Card View"
      >
        <FaThLarge />

        <span>Cards</span>
      </button>

    </div>
  );
};

export default ViewToggle;