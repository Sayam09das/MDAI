import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Info, MapPin } from 'lucide-react';
import { useCalendar } from '../../../../../context/CalendarContext';
import { COUNTRIES, HOLIDAY_TYPES, getHolidaysForMonth, getHolidayColor } from '../../../../../utils/holidays';

const HolidayList = ({ compact = false }) => {
  const { currentDate, selectedCountry, setSelectedCountry } = useCalendar();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const holidays = useMemo(() => {
    return getHolidaysForMonth(
      selectedCountry,
      currentDate.getFullYear(),
      currentDate.getMonth()
    );
  }, [selectedCountry, currentDate]);

  const holidayTypes = useMemo(() => {
    const types = new Set(holidays.map(h => h.type));
    return Array.from(types).map(type => {
      let holidayTypeValue;
      if (type === 'public') holidayTypeValue = HOLIDAY_TYPES.PUBLIC;
      else if (type === 'religious') holidayTypeValue = HOLIDAY_TYPES.RELIGIOUS;
      else if (type === 'observance') holidayTypeValue = HOLIDAY_TYPES.OBSERVANCE;
      else holidayTypeValue = HOLIDAY_TYPES.SCHOOL;
      
      return {
        type,
        count: holidays.filter(h => h.type === type).length,
        value: holidayTypeValue
      };
    });
  }, [holidays]);

  const getHolidayIcon = (type) => {
    switch (type) {
      case HOLIDAY_TYPES.PUBLIC:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
          </svg>
        );
      case HOLIDAY_TYPES.RELIGIOUS:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case HOLIDAY_TYPES.OBSERVANCE:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getBgClass = (colorClass) => {
    return colorClass.split(' ')[0].replace('text-', 'bg-');
  };

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors w-full"
          >
            <Globe className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700 flex-1 text-left">
              {COUNTRIES[selectedCountry]?.name || 'Select Country'}
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 z-10 overflow-hidden"
              >
                {Object.entries(COUNTRIES).map(([code, country]) => (
                  <button
                    key={code}
                    onClick={() => {
                      setSelectedCountry(code);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                      selectedCountry === code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    {selectedCountry === code && (
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                    {country.name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-1 max-h-48 overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {holidays.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-4"
              >
                <p className="text-sm text-gray-500">No holidays this month</p>
              </motion.div>
            ) : (
              holidays.map((holiday, index) => (
                <motion.div
                  key={holiday.date}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-start gap-2 p-2 rounded-lg ${getHolidayColor(holiday.type)}`}
                >
                  <span className="flex-shrink-0 mt-0.5">{getHolidayIcon(holiday.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{holiday.name}</p>
                    <p className="text-xs opacity-75">{formatDate(holiday.date)}</p>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Holidays</h3>
            <p className="text-xs text-gray-500">
              {COUNTRIES[selectedCountry]?.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm"
            >
              <span>{COUNTRIES[selectedCountry]?.code}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 z-10 min-w-[180px] overflow-hidden"
                >
                  {Object.entries(COUNTRIES).map(([code, country]) => (
                    <button
                      key={code}
                      onClick={() => {
                        setSelectedCountry(code);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                        selectedCountry === code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      {selectedCountry === code && (
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                      )}
                      {country.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setShowInfo(!showInfo)}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <Info className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 rounded-xl p-4 space-y-2"
          >
            <p className="text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">Holiday Types</p>
            {Object.entries(HOLIDAY_TYPES).map(([key, value]) => {
              const bgClass = getBgClass(getHolidayColor(value));
              return (
                <div key={key} className="flex items-center gap-2 text-xs">
                  <span className={`w-3 h-3 rounded-full ${bgClass}`} />
                  <span className="text-gray-600 capitalize">{key.toLowerCase()}</span>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {holidayTypes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {holidayTypes.map(({ type, count }) => (
            <span
              key={type}
              className={`px-2 py-1 rounded-lg text-xs font-medium ${getHolidayColor(type)}`}
            >
              {count} {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
          ))}
        </div>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {holidays.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">No holidays this month</p>
              <p className="text-xs text-gray-400">Select another country to view holidays</p>
            </motion.div>
          ) : (
            holidays.map((holiday, index) => (
              <motion.div
                key={holiday.date}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.03 }}
                className={`flex items-start gap-3 p-3 rounded-xl ${getHolidayColor(holiday.type)}`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getHolidayIcon(holiday.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{holiday.name}</p>
                  <p className="text-xs opacity-75 mt-0.5">{formatDate(holiday.date)}</p>
                  {holiday.description && (
                    <p className="text-xs opacity-60 mt-1 line-clamp-2">{holiday.description}</p>
                  )}
                </div>
                <MapPin className="w-4 h-4 opacity-50 flex-shrink-0" />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HolidayList;

