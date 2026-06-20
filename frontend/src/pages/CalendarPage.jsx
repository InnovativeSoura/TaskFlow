import {
  Calendar,
  momentLocalizer,
} from "react-big-calendar";

import moment from "moment";

const localizer =
  momentLocalizer(moment);

function CalendarPage() {
  const events = [
    {
      title:
        "Frontend Development",
      start: new Date(),
      end: new Date(),
    },
  ];

  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{
        height: 700,
      }}
    />
  );
}

export default CalendarPage;