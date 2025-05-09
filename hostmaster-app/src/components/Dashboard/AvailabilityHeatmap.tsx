import { useDateRange } from "../../context/DateRangeContext";
import { useBookedRooms } from "../../hooks/useBookedRooms";
import { format, addDays } from "date-fns";

const AvailabilityHeatmap = ({
  accommodationId,
}: {
  accommodationId: number;
}) => {
  const {
    range: { startDate, endDate },
  } = useDateRange();

  const { data: rooms, isLoading } = useBookedRooms(
    startDate,
    endDate,
    accommodationId
  );

  const days: Date[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const uniqueRooms = Array.from(
    new Map(rooms?.map((room) => [room.number, room])).values()
  );

  if (isLoading) return <p>Cargando mapa de disponibilidad...</p>;

  return (
    <div className="heatmap">
      <div className="heatmap-header">
        <div className="heatmap-cell header-room">Habitación</div>
        {days.map((day) => (
          <div key={day.toISOString()} className="heatmap-cell header-date">
            {format(day, "dd MMM")}
          </div>
        ))}
      </div>
      {uniqueRooms.map((room) => (
        <div key={room.id} className="heatmap-row">
          <div className="heatmap-cell room-label">{room.number}</div>
          {days.map((day) => {
            const match = rooms?.find(
              (r) =>
                r.number === room.number &&
                format(new Date(day), "yyyy-MM-dd") ===
                  format(new Date(startDate), "yyyy-MM-dd") &&
                !r.isAvailable
            );

            return (
              <div
                key={day.toISOString() + room.id}
                className={`heatmap-cell ${
                  match ? "unavailable" : "available"
                }`}
                title={`Habitación ${room.number} - ${format(
                  day,
                  "dd MMM yyyy"
                )}: ${match ? "Ocupada" : "Disponible"}`}
              />
            );
          })}
        </div>
      ))}
      <div className="heatmap-legend mt-3 d-flex gap-3">
        <div className="d-flex align-items-center gap-2">
          <div className="legend-box available"></div>
          <span>Disponible</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="legend-box unavailable"></div>
          <span>Ocupada</span>
        </div>
      </div>
    </div>
  );
};
export default AvailabilityHeatmap;
