import "../styles/EmptyState.css";

const EmptyState = ({
  title = "No Data Found",
}) => {
  return (
    <div className="empty-state">

      <h2>{title}</h2>

    </div>
  );
};

export default EmptyState;