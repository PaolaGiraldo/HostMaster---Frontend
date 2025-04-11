import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Reservation } from "../../interfaces/reservationInterface"; // Ajusta tu ruta
import { Room } from "../../interfaces/roomInterface";
import { useAccommodations } from "../../hooks/useAccommodations";
import { useTranslation } from "react-i18next";

interface ReservationCalendarProps {
  reservations: Reservation[];
  rooms: Room[];
}

const ReservationCalendar: React.FC<ReservationCalendarProps> = ({
  reservations,
  rooms,
}) => {
  const { t } = useTranslation();
  const { data: accommodations = [] } = useAccommodations();

  const accommodationColors: { [id: number]: string } = {};
  const [selectedAccommodationId, setSelectedAccommodationId] = useState<
    number | null
  >(null);

  accommodations?.forEach((acc) => {
    if (acc.id !== undefined) {
      accommodationColors[acc.id] = generateColorFromId(acc.id);
    }
  });

  // Convertimos las reservas al formato que FullCalendar espera
  const events = reservations.map((res) => {
    const room = rooms.find((r) => r.id === res.room_id);
    const accommodationId = room?.accommodation_id;

    return {
      id: String(res.id),
      title: `Reserva - Habitación ${room?.number ?? "?"}`,
      start: res.start_date,
      end: res.end_date,
      backgroundColor: generateColorFromId(accommodationId ?? 0), // Color dinámico
      textColor: "#fff",
      borderColor: "transparent",
      extendedProps: {
        roomNumber: room?.number,
        ...res,
      },
    };
  });
  const filteredEvents = selectedAccommodationId
    ? events.filter(
        (e) => e.extendedProps.accommodation_id === selectedAccommodationId
      )
    : events;

  const handleSelect = (id: number) => {
    setSelectedAccommodationId((prev) => (prev === id ? null : id));
  };
  return (
    <>
      <div className="calendar-wrapper">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={filteredEvents}
          height="auto"
          eventContent={(arg) => {
            return {
              html: `
                <div class="fc-event-custom">
                  <i class="bi bi-person-fill me-1"></i> 
                  ${arg.event.title}
                </div>
              `,
            };
          }}
        />
        <div className="mb-3"></div>
        <div className="mb-3 d-flex flex-wrap gap-3 align-items-center">
          <strong>🗂️ {t("accommodations.legend")}:</strong>
          {accommodations?.map((acc) => (
            <div
              key={acc.id}
              className="d-flex align-items-center"
              style={{ cursor: "pointer" }}
              onClick={() => handleSelect(acc.id ?? 0)} // Para filtrar (opcional)
            >
              <span
                style={{
                  backgroundColor: accommodationColors[acc.id ?? 0],
                  width: "16px",
                  height: "16px",
                  display: "inline-block",
                  borderRadius: "3px",
                  marginRight: "8px",
                }}
              />
              <span>{acc.name}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  function generateColorFromId(id: number): string {
    const hue = (id * 137.508) % 360;
    return `hsl(${hue}, 60%, 60%)`;
  }
};

export default ReservationCalendar;
