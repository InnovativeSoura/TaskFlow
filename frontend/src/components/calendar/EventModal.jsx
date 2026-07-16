import {
  FaTimes,
  FaSave,
} from "react-icons/fa";


const EventModal = ({
  open,
  event,
  onClose,
  onSave,
}) => {


  if (!open) return null;


  return (

    <div className="event-modal-overlay">

      <div className="event-modal">

        <button
          className="close-btn"
          onClick={onClose}
        >
          <FaTimes />
        </button>


        <h2>
          {event
            ? "Edit Event"
            : "Create Event"}
        </h2>


        <input
          type="text"
          placeholder="Event title"
          defaultValue={
            event?.title || ""
          }
        />


        <div className="modal-actions">

          <button
            onClick={onClose}
          >
            Cancel
          </button>


          <button
            onClick={onSave}
          >

            <FaSave />

            Save

          </button>

        </div>


      </div>

    </div>

  );
};


export default EventModal;