import React, { useEffect, useState, useRef } from "react";
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
  setIsDatePickerOpen,
  invoiceCreatedDate,
  isDueDate = false,
}) => {
  // Ensure the date is parsed correctly
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
  }, [value]);

  const formatDate = (date) => {
    return date
      .toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
      .replace(/ /g, " "); // Replaces spaces if necessary
  };

  const prevMonth = () => {
    const prevDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );

    if (
      prevDate.getFullYear() < today.getFullYear() ||
      (prevDate.getFullYear() === today.getFullYear() &&
        prevDate.getMonth() < today.getMonth())
    ) {
      return;
    }

    setCurrentDate(prevDate);
  };

  const nextMonth = () => {
    const nextDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );

    setCurrentDate(nextDate);
  };

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

    const prevMonthDays = daysInMonth(year, month - 1);
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push(
        <div key={`prev-${i}`} className="day adjacent-month">
          {prevMonthDays - i}
        </div>
      );
    }

    for (let i = 1; i <= totalDays; i++) {
      const dateObj = new Date(year, month, i, 12, 0, 0);
      const isSelected = selectedDate
        ? i === selectedDate?.getDate()
        : i === currentDate?.getDate();
      const dateStore = isDueDate ? new Date(invoiceCreatedDate) : todayDate;
      const isPastDate = dateObj < dateStore;

      days.push(
        <div
          key={i}
          className={`day ${isSelected ? "selected" : ""} ${
            isPastDate ? "disabled" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation(); // Prevent click from closing the calendar
            if (!isPastDate) {
              setSelectedDate(dateObj);
              onChange && onChange({ name, value: formatDateToISO(dateObj) });
              setIsDatePickerOpen(false);
            }
          }}
        >
          {i}
        </div>
      );
    }

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
        onClick={() => (isDisable ? null : setIsDatePickerOpen(!isDatePickerOpen))}
      >
        <span style={{ filter: isDisable && "brightness(0.5)" }}>
          {formatDate(selectedDate || currentDate)}
        </span>
        <span style={{ cursor: "pointer" }}>
          <CalanderIcon />
        </span>
      </div>

      {isDatePickerOpen && (
        <span className="date-picker-container">
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

            <div className="calendar-grid" onClick={(e) => e.stopPropagation()}>
              {renderCalendar()}
            </div>
          </div>
        </span>
      )}
    </div>
  );
};

export default DatePicker;
