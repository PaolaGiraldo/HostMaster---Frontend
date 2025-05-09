// components/Report/DateRangeSelector.tsx
import { DateRange } from "react-date-range";
import { useDateRange } from "../../context/DateRangeContext";
import { useTranslation } from "react-i18next";

export const DateRangeSelector = () => {
  const { t } = useTranslation();
  const { range, setRange } = useDateRange();

  return (
    <div className="mb-4">
      <h6 className="mb-2">{t("reports.selectRange")}</h6>
      <DateRange
        editableDateInputs
        moveRangeOnFirstSelection={false}
        ranges={[
          {
            startDate: range.startDate,
            endDate: range.endDate,
            key: "selection",
          },
        ]}
        onChange={(item) =>
          setRange({
            startDate: item.selection.startDate!,
            endDate: item.selection.endDate!,
          })
        }
      />
    </div>
  );
};
