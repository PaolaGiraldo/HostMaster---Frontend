import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Reservation } from "../../interfaces/reservationInterface"; // Ajusta tu ruta
import { Room } from "../../interfaces/roomInterface";
import { useAccommodations } from "../../hooks/useAccommodations";
import { useTranslation } from "react-i18next";
import { FaHotel } from "react-icons/fa";

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

  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  accommodations?.forEach((acc) => {
    if (acc.id !== undefined) {
      accommodationColors[acc.id] = generateColorFromId(acc.id);
    }
  });

  // Convertimos las reservas al formato que FullCalendar espera
  const events = reservations.map((res) => {
    const room = rooms.find((r) => r.id === res.room_id);
    const accommodation = accommodations?.find(
      (a) => a.id === res.accommodation_id
    );

    return {
      id: String(res.id),
      title: `${t("reservation")} - ${t("room")} ${room?.number ?? "?"}`,
      start: res.start_date,
      end: res.end_date,
      backgroundColor: generateColorFromId(accommodation?.id ?? 0), // Color dinámico
      textColor: "#fff",
      borderColor: "transparent",
      extendedProps: {
        roomNumber: room?.number,
        accommodationName: accommodation?.name,
        guest_name: res.user_username,
        notes: res.observations,
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
          eventClick={(info) => {
            setSelectedEvent(info.event.extendedProps);
            setShowModal(true);
          }}
        />
        <div className="mb-3"></div>
        <div className="mb-3 d-flex flex-wrap gap-3 align-items-center">
          {accommodations?.map((acc) => (
            <button
              key={acc.id}
              onClick={() => handleSelect(acc.id ?? 0)}
              className={`btn btn-sm d-flex align-items-center gap-2 ${
                selectedAccommodationId === acc.id
                  ? "btn-primary"
                  : "btn-outline-primary"
              }`}
              style={{
                borderRadius: "20px",
                opacity:
                  selectedAccommodationId && selectedAccommodationId !== acc.id
                    ? 0.6
                    : 1,
              }}
            >
              <FaHotel color={accommodationColors[acc.id ?? 0] || "#1a2a6c"} />
              {acc.name}
            </button>
          ))}
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles de la reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <>
              <p>
                <strong>{t("accommodation")} :</strong>{" "}
                {selectedEvent.accommodationName}
              </p>
              <p>
                <strong>{t("room")}:</strong> {selectedEvent.roomNumber}
              </p>
              <p>
                <strong>{t("customer")}:</strong> {selectedEvent.guest_name}
              </p>
              <p>
                <strong>{t("starDate")}:</strong> {selectedEvent.start_date}
              </p>
              <p>
                <strong>{t("endDate")}:</strong> {selectedEvent.end_date}
              </p>
              <p>
                <strong>{t("observations")} :</strong>{" "}
                {selectedEvent.notes || "Sin notas"}
              </p>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );

  function generateColorFromId(id: number): string {
    const hue = (id * 137.508) % 360;
    return `hsl(${hue}, 60%, 60%)`;
  }
};

export default ReservationCalendar;
