export const reservationStatuses = [
  { value: "pending", labelKey: "reservations.statusOptions.pending" },
  { value: "confirmed", labelKey: "reservations.statusOptions.confirmed" },
  { value: "cancelled", labelKey: "reservations.statusOptions.cancelled" },
  { value: "checkedIn", labelKey: "reservations.statusOptions.checkedIn" },
  { value: "checkedOut", labelKey: "reservations.statusOptions.checkedOut" },
];

export const STATUS_COLORS: Record<string, string> = {
  pending: "rgba(253, 255, 122, 0.7)",
  confirmed: "rgba(106, 255, 106, 0.7)",
  cancelled: "rgba(255, 63, 63, 0.7)",
  checkedIn: "rgba(63, 210, 255, 0.7)",
  checkedOut  : "rgba(150, 150, 150, 0.7)",
};