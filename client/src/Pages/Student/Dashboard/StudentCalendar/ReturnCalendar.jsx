import React from 'react';
import { CalendarProvider } from '../../../../context/CalendarContext';
import StudentCalendar from './StudentCalendar';

const ReturnCalendar = () => {
  return (
    <CalendarProvider>
      <StudentCalendar />
    </CalendarProvider>
  );
};

export default ReturnCalendar;

