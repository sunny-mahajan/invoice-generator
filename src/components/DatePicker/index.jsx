import React, { useEffect, useState } from "react";
import "./style.css";
import { CalanderIcon, LeftArrowIcon, RightArrowIcon } from "../../utils/icons";

const DatePicker = ({
  containerClass,
  title,
  name,
  isDisable = false,
  value,
  lableClass,
  inputClass,
  onChange,
  isDatePickerOpen,
  customDatePickerRef,
  invoiceCreatedDate,
  isDueDate = false,
}) => {
  const parseDateFromString = (dateString) => {
    if (!dateString) return null;

    if (value instanceof Date && !isNaN(value)) {
      return value;
    }

    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day); // month is 0-indexed
  };

  const today = new Date();
  const [currentDate, setCurrentDate] = useState(
    value ? parseDateFromString(value) : today
  );
  const [selectedDate, setSelectedDate] = useState(
    value ? parseDateFromString(value) : null
  );
  const [isOpen, setIsOpen] = useState(false);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0)?.getDate();
  const startDay = (year, month) => new Date(year, month, 1)?.getDay();

  const formatDateToISO = (date) => {
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (value) {
      const parsedDate = parseDateFromString(value);
      setCurrentDate(parsedDate);
      setSelectedDate(parsedDate);
    }
    // eslint-disable-next-line
  }, []);

  const formatDate = (date) => {
    return date
      .toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
      .replace(/ /g, " "); // Replaces spaces if necessary
  };

  // const prevMonth = () => {
  //   const prevDate = new Date(
  //     currentDate.getFullYear(),
  //     currentDate.getMonth() - 1,
  //     1
  //   );
  //   if (value) {
  //     const defaultDate = parseDateFromString(value);
  //     if (
  //       defaultDate?.getMonth() === prevDate.getMonth() &&
  //       defaultDate?.getFullYear() === prevDate.getFullYear()
  //     ) {
  //       setSelectedDate(parseDateFromString(value));
  //     } else {
  //       setSelectedDate(prevDate);
  //     }
  //   } else {
  //     setSelectedDate(prevDate);
  //   }

  //   setCurrentDate(prevDate);

  //   if (
  //     prevDate.getMonth() === today.getMonth() &&
  //     prevDate.getFullYear() === today.getFullYear()
  //   ) {
  //     value
  //       ? setSelectedDate(parseDateFromString(value))
  //       : setCurrentDate(today);
  //   }
  // };

  const prevMonth = () => {
    const prevDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );

    // Prevent navigation to months before the current month
    if (
      prevDate.getFullYear() < today.getFullYear() ||
      (prevDate.getFullYear() === today.getFullYear() &&
        prevDate.getMonth() < today.getMonth())
    ) {
      return; // Do nothing if the previous month is before the current month
    }

    if (value) {
      const defaultDate = parseDateFromString(value);
      if (
        defaultDate?.getMonth() === prevDate.getMonth() &&
        defaultDate?.getFullYear() === prevDate.getFullYear()
      ) {
        setSelectedDate(parseDateFromString(value));
      } else {
        setSelectedDate(prevDate);
      }
    } else {
      setSelectedDate(prevDate);
    }

    setCurrentDate(prevDate);

    if (
      prevDate.getMonth() === today.getMonth() &&
      prevDate.getFullYear() === today.getFullYear()
    ) {
      value
        ? setSelectedDate(parseDateFromString(value))
        : setCurrentDate(today);
    }
  };

  const nextMonth = () => {
    const nextDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );

    if (value) {
      const defaultDate = parseDateFromString(value);
      if (
        defaultDate?.getMonth() === nextDate.getMonth() &&
        defaultDate?.getFullYear() === nextDate.getFullYear()
      ) {
        setSelectedDate(parseDateFromString(value));
      } else {
        setSelectedDate(nextDate);
      }
    } else {
      setSelectedDate(nextDate);
    }

    setCurrentDate(nextDate);

    if (
      nextDate.getMonth() === today.getMonth() &&
      nextDate.getFullYear() === today.getFullYear()
    ) {
      value
        ? setSelectedDate(parseDateFromString(value))
        : setCurrentDate(today);
    }
  };

  const Calendar = () => {
    return (
      <div className="date-picker">
        <div className="header">
          <div onClick={prevMonth} className="nav-arrow">
            <LeftArrowIcon w="7" h="13" />
          </div>
          <h2 className="current-month">
            {currentDate.toLocaleString("default", {
              month: "short",
              year: "numeric",
            })}
          </h2>
          <div onClick={nextMonth} className="nav-arrow">
            <RightArrowIcon w="7" h="13" />
          </div>
        </div>

        <div className="calendar-grid">{renderCalendar()}</div>
      </div>
    );
  };

  // const renderCalendar = () => {
  //   const year = currentDate.getFullYear();
  //   const month = currentDate.getMonth();
  //   const totalDays = daysInMonth(year, month);
  //   const startingDay = startDay(year, month);
  //   const days = [];

  //   // Previous month's days
  //   const prevMonthDays = daysInMonth(year, month - 1);
  //   for (let i = startingDay - 1; i >= 0; i--) {
  //     days.push(
  //       <div key={`prev-${i}`} className="day adjacent-month">
  //         {prevMonthDays - i}
  //       </div>
  //     );
  //   }

  //   // Current month's days
  //   for (let i = 1; i <= totalDays; i++) {
  //     const isSelected = selectedDate
  //       ? i === selectedDate?.getDate()
  //       : i === currentDate?.getDate();
  //     days.push(
  //       <div
  //         key={i}
  //         className={`day ${isSelected ? "selected" : ""}`}
  //         onClick={() => {
  //           const selectedDateObj = new Date(year, month, i, 12, 0, 0); // i is correct here
  //           setSelectedDate(selectedDateObj);

  //           onChange &&
  //             onChange({ name, value: formatDateToISO(selectedDateObj) }); // Return the date in YYYY-MM-DD format
  //           setIsOpen(false);
  //         }}
  //       >
  //         {i}
  //       </div>
  //     );
  //   }

  //   // Next month's days
  //   const remainingDays = 42 - days.length;
  //   for (let i = 1; i <= remainingDays; i++) {
  //     days.push(
  //       <div key={`next-${i}`} className="day adjacent-month">
  //         {i}
  //       </div>
  //     );
  //   }

  //   return days;
  // };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const startingDay = startDay(year, month);
    const days = [];

    const todayDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    // Previous month's days
    const prevMonthDays = daysInMonth(year, month - 1);
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push(
        <div key={`prev-${i}`} className="day adjacent-month">
          {prevMonthDays - i}
        </div>
      );
    }

    // Current month's days
    for (let i = 1; i <= totalDays; i++) {
      const dateObj = new Date(year, month, i, 12, 0, 0); // Create a date object for the current day
      console.log(dateObj, "dateObj", todayDate);
      const isSelected = selectedDate
        ? i === selectedDate?.getDate()
        : i === currentDate?.getDate();
      console.log(isDueDate, invoiceCreatedDate);
      const dateStore = isDueDate ? invoiceCreatedDate : todayDate;
      const isPastDate = dateObj < dateStore; // Check if the date is in the past

      days.push(
        <div
          key={i}
          className={`day ${isSelected ? "selected" : ""} ${
            isPastDate ? "disabled" : ""
          }`} // Add a disabled class if it's a past date
          onClick={() => {
            if (!isPastDate) {
              setSelectedDate(dateObj);
              onChange && onChange({ name, value: formatDateToISO(dateObj) });
              setIsOpen(false);
            }
          }}
        >
          {i}
        </div>
      );
    }

    // Next month's days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(
        <div key={`next-${i}`} className="day adjacent-month">
          {i}
        </div>
      );
    }

    return days;
  };

  return (
    <div className={`input-container ${containerClass ? containerClass : ""}`}>
      {title && (
        <div className="invoice-title-container">
          <label className={`input-title ${lableClass ? lableClass : ""}`}>
            {title}
          </label>
        </div>
      )}

      <div
        className={`input-field ${inputClass ? inputClass : ""}`}
        style={{ filter: isDisable && "brightness(0.8)" }}
        onClick={() => (isDisable ? null : setIsOpen(!isOpen))}
      >
        <span style={{ filter: isDisable && "brightness(0.5)" }}>
          {" "}
          {formatDate(selectedDate || currentDate)}
        </span>{" "}
        <span
          style={{
            cursor: "pointer",
          }}
        >
          <CalanderIcon />
        </span>
      </div>

      {isDatePickerOpen && (
        <span className="date-picker-container" ref={customDatePickerRef}>
          <Calendar />
        </span>
      )}
    </div>
  );
};

export default DatePicker;
