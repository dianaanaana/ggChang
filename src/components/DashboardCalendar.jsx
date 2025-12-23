// src/components/DashboardCalendar.jsx
import { Box } from '@mui/material';
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function CalendarEvent({ event }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {event.imageUrl && (
        <Box
          component="img"
          src={event.imageUrl}
          sx={{
            width: "100%",
            height: 40,
            objectFit: "cover",
            borderRadius: 1,
            mb: 0.5,
          }}
        />
      )}
      <Box component="span" sx={{ fontSize: '0.75rem' }}>
        {event.title}
      </Box>
    </Box>
  );
}

export default function DashboardCalendar({ events, onSelectSlot }) {
  return (
    <Box sx={{ mt: 4, p: 2 }}>
      <Box sx={{ mb: 2, fontWeight: 'bold', fontSize: '1.25rem' }}>
        Calendar
      </Box>
      <Box sx={{ height: 600 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={onSelectSlot}
          views={["month"]}
          components={{
            event: CalendarEvent,
          }}
          style={{ height: "100%" }}
        />
      </Box>
    </Box>
  );
}
