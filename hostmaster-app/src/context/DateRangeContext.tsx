// context/DateRangeContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";
import { addDays } from "date-fns";

type DateRange = {
  startDate: Date;
  endDate: Date;
};

const defaultRange: DateRange = {
  startDate: addDays(new Date(), -7),
  endDate: new Date(),
};

const DateRangeContext = createContext<{
  range: DateRange;
  setRange: (range: DateRange) => void;
}>({
  range: defaultRange,
  setRange: () => {},
});

export const DateRangeProvider = ({ children }: { children: ReactNode }) => {
  const [range, setRange] = useState<DateRange>(defaultRange);

  return (
    <DateRangeContext.Provider value={{ range, setRange }}>
      {children}
    </DateRangeContext.Provider>
  );
};

export const useDateRange = () => {
  const context = useContext(DateRangeContext);
  if (!context) {
    throw new Error("useDateRange must be used within a DateRangeProvider");
  }
  return context;
};
