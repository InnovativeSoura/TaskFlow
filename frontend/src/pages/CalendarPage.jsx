import { useMemo, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import MainLayout from "../layouts/MainLayout";

import { useTasks } from "../context/TaskContext";

import EventModal from "../components/calendar/EventModal";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/Calendar.css";

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const { tasks } = useTasks();

  const [selectedEvent, setSelectedEvent] = useState(null);

  const events = useMemo(() => {
    return tasks
      .filter((task) => task.dueDate)
      .map((task) => ({
        id: task._id,
        title: task.title,
        start: new Date(task.dueDate),
        end: new Date(task.dueDate),
        allDay: true,
        status: task.status,
        priority: task.priority,
        description: task.description,
      }));
  }, [tasks]);

  return (
    <MainLayout>
      <div className="calendar-page">

        <div className="calendar-header">

          <h1>Calendar</h1>

          <p>
            View project deadlines, milestones and
            scheduled work.
          </p>

        </div>

        <div className="calendar-container">

          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            selectable
            popup
            style={{
              height: "80vh",
            }}
            onSelectEvent={(event) =>
              setSelectedEvent(event)
            }
          />

        </div>

        {selectedEvent && (
          <EventModal
            event={selectedEvent}
            onClose={() =>
              setSelectedEvent(null)
            }
          />
        )}

      </div>
    </MainLayout>
  );
};

export default CalendarPage;