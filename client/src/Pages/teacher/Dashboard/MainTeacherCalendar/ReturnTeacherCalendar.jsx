import React from 'react';
import { CalendarProvider } from '../../../../context/CalendarContext';
import TeacherCalendar from './TeacherCalendar';

const ReturnTeacherCalendar = () => {
  return (
    <CalendarProvider>
      <TeacherCalendar />
    </CalendarProvider>
  );
};

export default ReturnTeacherCalendar;
