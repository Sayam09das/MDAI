// Holiday utilities for multiple countries

export const COUNTRIES = {
  US: { code: 'US', name: 'United States', locale: 'en-US' },
  UK: { code: 'UK', name: 'United Kingdom', locale: 'en-GB' },
  IN: { code: 'IN', name: 'India', locale: 'en-IN' },
  CA: { code: 'CA', name: 'Canada', locale: 'en-CA' },
  AU: { code: 'AU', name: 'Australia', locale: 'en-AU' },
  DE: { code: 'DE', name: 'Germany', locale: 'de-DE' },
  FR: { code: 'FR', name: 'France', locale: 'fr-FR' },
  JP: { code: 'JP', name: 'Japan', locale: 'ja-JP' },
};

// Holiday types
export const HOLIDAY_TYPES = {
  PUBLIC: 'public',
  OBSERVANCE: 'observance',
  RELIGIOUS: 'religious',
  SCHOOL: 'school',
};

// Multi-country holiday data (2024-2025)
export const HOLIDAYS = {
  US: [
    { name: "New Year's Day", date: '2024-01-01', type: HOLIDAY_TYPES.PUBLIC, description: "First day of the year" },
    { name: "Martin Luther King Jr. Day", date: '2024-01-15', type: HOLIDAY_TYPES.PUBLIC, description: "Third Monday of January" },
    { name: "Presidents' Day", date: '2024-02-19', type: HOLIDAY_TYPES.PUBLIC, description: "Third Monday of February" },
    { name: "Memorial Day", date: '2024-05-27', type: HOLIDAY_TYPES.PUBLIC, description: "Last Monday of May" },
    { name: "Independence Day", date: '2024-07-04', type: HOLIDAY_TYPES.PUBLIC, description: "National Independence Day" },
    { name: "Labor Day", date: '2024-09-02', type: HOLIDAY_TYPES.PUBLIC, description: "First Monday of September" },
    { name: "Columbus Day", date: '2024-10-14', type: HOLIDAY_TYPES.PUBLIC, description: "Second Monday of October" },
    { name: "Veterans Day", date: '2024-11-11', type: HOLIDAY_TYPES.PUBLIC, description: "Honoring military veterans" },
    { name: "Thanksgiving Day", date: '2024-11-28', type: HOLIDAY_TYPES.PUBLIC, description: "Fourth Thursday of November" },
    { name: "Christmas Day", date: '2024-12-25', type: HOLIDAY_TYPES.PUBLIC, description: "Christmas celebration" },
    // 2025
    { name: "New Year's Day", date: '2025-01-01', type: HOLIDAY_TYPES.PUBLIC, description: "First day of the year" },
    { name: "Martin Luther King Jr. Day", date: '2025-01-20', type: HOLIDAY_TYPES.PUBLIC, description: "Third Monday of January" },
    { name: "Presidents' Day", date: '2025-02-17', type: HOLIDAY_TYPES.PUBLIC, description: "Third Monday of February" },
    { name: "Memorial Day", date: '2025-05-26', type: HOLIDAY_TYPES.PUBLIC, description: "Last Monday of May" },
    { name: "Independence Day", date: '2025-07-04', type: HOLIDAY_TYPES.PUBLIC, description: "National Independence Day" },
    { name: "Labor Day", date: '2025-09-01', type: HOLIDAY_TYPES.PUBLIC, description: "First Monday of September" },
    { name: "Columbus Day", date: '2025-10-13', type: HOLIDAY_TYPES.PUBLIC, description: "Second Monday of October" },
    { name: "Veterans Day", date: '2025-11-11', type: HOLIDAY_TYPES.PUBLIC, description: "Honoring military veterans" },
    { name: "Thanksgiving Day", date: '2025-11-27', type: HOLIDAY_TYPES.PUBLIC, description: "Fourth Thursday of November" },
    { name: "Christmas Day", date: '2025-12-25', type: HOLIDAY_TYPES.PUBLIC, description: "Christmas celebration" },
  ],
  UK: [
    { name: "New Year's Day", date: '2024-01-01', type: HOLIDAY_TYPES.PUBLIC, description: "First day of the year" },
    { name: "Good Friday", date: '2024-03-29', type: HOLIDAY_TYPES.PUBLIC, description: "Friday before Easter" },
    { name: "Easter Monday", date: '2024-04-01', type: HOLIDAY_TYPES.PUBLIC, description: "Monday after Easter" },
    { name: "Early May Bank Holiday", date: '2024-05-06', type: HOLIDAY_TYPES.PUBLIC, description: "First Monday of May" },
    { name: "Spring Bank Holiday", date: '2024-05-27', type: HOLIDAY_TYPES.PUBLIC, description: "Last Monday of May" },
    { name: "Summer Bank Holiday", date: '2024-08-26', type: HOLIDAY_TYPES.PUBLIC, description: "Last Monday of August" },
    { name: "Christmas Day", date: '2024-12-25', type: HOLIDAY_TYPES.PUBLIC, description: "Christmas celebration" },
    { name: "Boxing Day", date: '2024-12-26', type: HOLIDAY_TYPES.PUBLIC, description: "Day after Christmas" },
    // 2025
    { name: "New Year's Day", date: '2025-01-01', type: HOLIDAY_TYPES.PUBLIC, description: "First day of the year" },
    { name: "Good Friday", date: '2025-04-18', type: HOLIDAY_TYPES.PUBLIC, description: "Friday before Easter" },
    { name: "Easter Monday", date: '2025-04-21', type: HOLIDAY_TYPES.PUBLIC, description: "Monday after Easter" },
    { name: "Early May Bank Holiday", date: '2025-05-05', type: HOLIDAY_TYPES.PUBLIC, description: "First Monday of May" },
    { name: "Spring Bank Holiday", date: '2025-05-26', type: HOLIDAY_TYPES.PUBLIC, description: "Last Monday of May" },
    { name: "Summer Bank Holiday", date: '2025-08-25', type: HOLIDAY_TYPES.PUBLIC, description: "Last Monday of August" },
    { name: "Christmas Day", date: '2025-12-25', type: HOLIDAY_TYPES.PUBLIC, description: "Christmas celebration" },
    { name: "Boxing Day", date: '2025-12-26', type: HOLIDAY_TYPES.PUBLIC, description: "Day after Christmas" },
  ],
  IN: [
    { name: "Republic Day", date: '2024-01-26', type: HOLIDAY_TYPES.PUBLIC, description: "Celebration of Indian Constitution" },
    { name: "Holi", date: '2024-03-25', type: HOLIDAY_TYPES.RELIGIOUS, description: "Festival of Colors" },
    { name: "Good Friday", date: '2024-03-29', type: HOLIDAY_TYPES.RELIGIOUS, description: "Friday before Easter" },
    { name: "Ram Navami", date: '2024-04-17', type: HOLIDAY_TYPES.RELIGIOUS, description: "Birth of Lord Rama" },
    { name: "Mahavir Jayanti", date: '2024-04-21', type: HOLIDAY_TYPES.RELIGIOUS, description: "Birth of Lord Mahavira" },
    { name: "Buddha Purnima", date: '2024-05-23', type: HOLIDAY_TYPES.RELIGIOUS, description: "Birth of Buddha" },
    { name: "Independence Day", date: '2024-08-15', type: HOLIDAY_TYPES.PUBLIC, description: "National Independence Day" },
    { name: "Ganesh Chaturthi", date: '2024-09-07', type: HOLIDAY_TYPES.RELIGIOUS, description: "Festival of Lord Ganesha" },
    { name: "Gandhi Jayanti", date: '2024-10-02', type: HOLIDAY_TYPES.PUBLIC, description: "Birth of Mahatma Gandhi" },
    { name: "Diwali", date: '2024-11-01', type: HOLIDAY_TYPES.RELIGIOUS, description: "Festival of Lights" },
    { name: "Christmas Day", date: '2024-12-25', type: HOLIDAY_TYPES.PUBLIC, description: "Christmas celebration" },
    // 2025
    { name: "Republic Day", date: '2025-01-26', type: HOLIDAY_TYPES.PUBLIC, description: "Celebration of Indian Constitution" },
    { name: "Holi", date: '2025-03-14', type: HOLIDAY_TYPES.RELIGIOUS, description: "Festival of Colors" },
    { name: "Good Friday", date: '2025-04-18', type: HOLIDAY_TYPES.RELIGIOUS, description: "Friday before Easter" },
    { name: "Independence Day", date: '2025-08-15', type: HOLIDAY_TYPES.PUBLIC, description: "National Independence Day" },
    { name: "Gandhi Jayanti", date: '2025-10-02', type: HOLIDAY_TYPES.PUBLIC, description: "Birth of Mahatma Gandhi" },
    { name: "Diwali", date: '2025-10-21', type: HOLIDAY_TYPES.RELIGIOUS, description: "Festival of Lights" },
    { name: "Christmas Day", date: '2025-12-25', type: HOLIDAY_TYPES.PUBLIC, description: "Christmas celebration" },
  ],
  CA: [
    { name: "New Year's Day", date: '2024-01-01', type: HOLIDAY_TYPES.PUBLIC, description: "First day of the year" },
    { name: "Family Day", date: '2024-02-19', type: HOLIDAY_TYPES.PUBLIC, description: "Third Monday of February" },
    { name: "Good Friday", date: '2024-03-29', type: HOLIDAY_TYPES.PUBLIC, description: "Friday before Easter" },
    { name: "Victoria Day", date: '2024-05-20', type: HOLIDAY_TYPES.PUBLIC, description: "Monday before May 25" },
    { name: "Canada Day", date: '2024-07-01', type: HOLIDAY_TYPES.PUBLIC, description: "National Holiday" },
    { name: "Civic Holiday", date: '2024-08-05', type: HOLIDAY_TYPES.PUBLIC, description: "First Monday of August" },
    { name: "Labor Day", date: '2024-09-02', type: HOLIDAY_TYPES.PUBLIC, description: "First Monday of September" },
    { name: "Thanksgiving", date: '2024-10-14', type: HOLIDAY_TYPES.PUBLIC, description: "Second Monday of October" },
    { name: "Remembrance Day", date: '2024-11-11', type: HOLIDAY_TYPES.PUBLIC, description: "Honoring veterans" },
    { name: "Christmas Day", date: '2024-12-25', type: HOLIDAY_TYPES.PUBLIC, description: "Christmas celebration" },
    // 2025
    { name: "New Year's Day", date: '2025-01-01', type: HOLIDAY_TYPES.PUBLIC, description: "First day of the year" },
    { name: "Family Day", date: '2025-02-17', type: HOLIDAY_TYPES.PUBLIC, description: "Third Monday of February" },
    { name: "Good Friday", date: '2025-04-18', type: HOLIDAY_TYPES.PUBLIC, description: "Friday before Easter" },
    { name: "Victoria Day", date: '2025-05-19', type: HOLIDAY_TYPES.PUBLIC, description: "Monday before May 25" },
    { name: "Canada Day", date: '2025-07-01', type: HOLIDAY_TYPES.PUBLIC, description: "National Holiday" },
    { name: "Civic Holiday", date: '2025-08-04', type: HOLIDAY_TYPES.PUBLIC, description: "First Monday of August" },
    { name: "Labor Day", date: '2025-09-01', type: HOLIDAY_TYPES.PUBLIC, description: "First Monday of September" },
    { name: "Thanksgiving", date: '2025-10-13', type: HOLIDAY_TYPES.PUBLIC, description: "Second Monday of October" },
    { name: "Remembrance Day", date: '2025-11-11', type: HOLIDAY_TYPES.PUBLIC, description: "Honoring veterans" },
    { name: "Christmas Day", date: '2025-12-25', type: HOLIDAY_TYPES.PUBLIC, description: "Christmas celebration" },
  ],
  AU: [
    { name: "New Year's Day", date: '2024-01-01', type: HOLIDAY_TYPES.PUBLIC, description: "First day of the year" },
    { name: "Australia Day", date: '2024-01-26', type: HOLIDAY_TYPES.PUBLIC, description: "National Holiday" },
    { name: "Good Friday", date: '2024-03-29', type: HOLIDAY_TYPES.PUBLIC, description: "Friday before Easter" },
    { name: "Easter Monday", date: '2024-04-01', type: HOLIDAY_TYPES.PUBLIC, description: "Monday after Easter" },
    { name: "ANZAC Day", date: '2024-04-25', type: HOLIDAY_TYPES.PUBLIC, description: "Australian and New Zealand Army Corps" },
    { name: "King's Birthday", date: '2024-06-10', type: HOLIDAY_TYPES.PUBLIC, description: "Second Monday of June" },
    { name: "Christmas Day", date: '2024-12-25', type: HOLIDAY_TYPES.PUBLIC, description: "Christmas celebration" },
    { name: "Boxing Day", date: '2024-12-26', type: HOLIDAY_TYPES.PUBLIC, description: "Day after Christmas" },
    // 2025
    { name: "New Year's Day", date: '2025-01-01', type: HOLIDAY_TYPES.PUBLIC, description: "First day of the year" },
    { name: "Australia Day", date: '2025-01-26', type: HOLIDAY_TYPES.PUBLIC, description: "National Holiday" },
    { name: "Good Friday", date: '2025-04-18', type: HOLIDAY_TYPES.PUBLIC, description: "Friday before Easter" },
    { name: "Easter Monday", date: '2025-04-21', type: HOLIDAY_TYPES.PUBLIC, description: "Monday after Easter" },
    { name: "ANZAC Day", date: '2025-04-25', type: HOLIDAY_TYPES.PUBLIC, description: "Australian and New Zealand Army Corps" },
    { name: "King's Birthday", date: '2025-06-09', type: HOLIDAY_TYPES.PUBLIC, description: "Second Monday of June" },
    { name: "Christmas Day", date: '2025-12-25', type: HOLIDAY_TYPES.PUBLIC, description: "Christmas celebration" },
    { name: "Boxing Day", date: '2025-12-26', type: HOLIDAY_TYPES.PUBLIC, description: "Day after Christmas" },
  ],
  DE: [
    { name: "New Year's Day", date: '2024-01-01', type: HOLIDAY_TYPES.PUBLIC, description: "First day of the year" },
    { name: "Good Friday", date: '2024-03-29', type: HOLIDAY_TYPES.PUBLIC, description: "Friday before Easter" },
    { name: "Easter Monday", date: '2024-04-01', type: HOLIDAY_TYPES.PUBLIC, description: "Monday after Easter" },
    { name: "Labor Day", date: '2024-05-01', type: HOLIDAY_TYPES.PUBLIC, description: "International Workers' Day" },
    { name: "German Unity Day", date: '2024-10-03', type: HOLIDAY_TYPES.PUBLIC, description: "National Day" },
    { name: "Christmas Day", date: '2024-12-25', type: HOLIDAY_TYPES.PUBLIC, description: "Christmas celebration" },
    { name: "Boxing Day", date: '2024-12-26', type: HOLIDAY_TYPES.PUBLIC, description: "Day after Christmas" },
    // 2025
    { name: "New Year's Day", date: '2025-01-01', type: HOLIDAY_TYPES.PUBLIC, description: "First day of the year" },
    { name: "Good Friday", date: '2025-04-18', type: HOLIDAY_TYPES.PUBLIC, description: "Friday before Easter" },
    { name: "Easter Monday", date: '2025-04-21', type: HOLIDAY_TYPES.PUBLIC, description: "Monday after Easter" },
    { name: "Labor Day", date: '2025-05-01', type: HOLIDAY_TYPES.PUBLIC, description: "International Workers' Day" },
    { name: "German Unity Day", date: '2025-10-03', type: HOLIDAY_TYPES.PUBLIC, description: "National Day" },
    { name: "Christmas Day", date: '2025-12-25', type: HOLIDAY_TYPES.PUBLIC, description: "Christmas celebration" },
    { name: "Boxing Day", date: '2025-12-26', type: HOLIDAY_TYPES.PUBLIC, description: "Day after Christmas" },
  ],
  FR: [
    { name: "New Year's Day", date: '2024-01-01', type: HOLIDAY_TYPES.PUBLIC, description: "First day of the year" },
    { name: "Good Friday", date: '2024-03-29', type: HOLIDAY_TYPES.RELIGIOUS, description: "Friday before Easter" },
    { name: "Easter Monday", date: '2024-04-01', type: HOLIDAY_TYPES.PUBLIC, description: "Monday after Easter" },
    { name: "Labor Day", date: '2024-05-01', type: HOLIDAY_TYPES.PUBLIC, description: "International Workers' Day" },
    { name: "Victory in Europe Day", date: '2024-05-08', type: HOLIDAY_TYPES.PUBLIC, description: "WWII Victory Day" },
    { name: "Ascension Day", date: '2024-05-09', type: HOLIDAY_TYPES.RELIGIOUS, description: "40 days after Easter" },
    { name: "Whit Monday", date: '2024-05-20', type: HOLIDAY_TYPES.RELIGIOUS, description: "50 days after Easter" },
    { name: "Bastille Day", date: '2024-07-14', type: HOLIDAY_TYPES.PUBLIC, description: "National Holiday" },
    { name: "Assumption of Mary", date: '2024-08-15', type: HOLIDAY_TYPES.RELIGIOUS, description: "Christian holiday" },
    { name: "All Saints' Day", date: '2024-11-01', type: HOLIDAY_TYPES.RELIGIOUS, description: "Christian holiday" },
    { name: "Armistice Day", date: '2024-11-11', type: HOLIDAY_TYPES.PUBLIC, description: "WWI Armistice" },
    { name: "Christmas Day", date: '2024-12-25', type: HOLIDAY_TYPES.PUBLIC, description: "Christmas celebration" },
    // 2025
    { name: "New Year's Day", date: '2025-01-01', type: HOLIDAY_TYPES.PUBLIC, description: "First day of the year" },
    { name: "Easter Monday", date: '2025-04-21', type: HOLIDAY_TYPES.PUBLIC, description: "Monday after Easter" },
    { name: "Labor Day", date: '2025-05-01', type: HOLIDAY_TYPES.PUBLIC, description: "International Workers' Day" },
    { name: "Victory in Europe Day", date: '2025-05-08', type: HOLIDAY_TYPES.PUBLIC, description: "WWII Victory Day" },
    { name: "Ascension Day", date: '2025-05-29', type: HOLIDAY_TYPES.RELIGIOUS, description: "40 days after Easter" },
    { name: "Whit Monday", date: '2025-06-09', type: HOLIDAY_TYPES.RELIGIOUS, description: "50 days after Easter" },
    { name: "Bastille Day", date: '2025-07-14', type: HOLIDAY_TYPES.PUBLIC, description: "National Holiday" },
    { name: "Assumption of Mary", date: '2025-08-15', type: HOLIDAY_TYPES.RELIGIOUS, description: "Christian holiday" },
    { name: "All Saints' Day", date: '2025-11-01', type: HOLIDAY_TYPES.RELIGIOUS, description: "Christian holiday" },
    { name: "Armistice Day", date: '2025-11-11', type: HOLIDAY_TYPES.PUBLIC, description: "WWI Armistice" },
    { name: "Christmas Day", date: '2025-12-25', type: HOLIDAY_TYPES.PUBLIC, description: "Christmas celebration" },
  ],
  JP: [
    { name: "New Year's Day", date: '2024-01-01', type: HOLIDAY_TYPES.PUBLIC, description: "First day of the year" },
    { name: "Coming of Age Day", date: '2024-01-08', type: HOLIDAY_TYPES.PUBLIC, description: "Second Monday of January" },
    { name: "National Foundation Day", date: '2024-02-12', type: HOLIDAY_TYPES.PUBLIC, description: "February 11" },
    { name: "Emperor's Birthday", date: '2024-02-23', type: HOLIDAY_TYPES.PUBLIC, description: "Emperor's birthday" },
    { name: "Showa Day", date: '2024-04-29', type: HOLIDAY_TYPES.PUBLIC, description: "Former Emperor's birthday" },
    { name: "Constitution Memorial Day", date: '2024-05-03', type: HOLIDAY_TYPES.PUBLIC, description: "Constitution day" },
    { name: "Greenery Day", date: '2024-05-04', type: HOLIDAY_TYPES.PUBLIC, description: "Nature appreciation" },
    { name: "Children's Day", date: '2024-05-05', type: HOLIDAY_TYPES.PUBLIC, description: "Boy's festival" },
    { name: "Marine Day", date: '2024-07-15', type: HOLIDAY_TYPES.PUBLIC, description: "Third Monday of July" },
    { name: "Mountain Day", date: '2024-08-12', type: HOLIDAY_TYPES.PUBLIC, description: "August 11" },
    { name: "Respect for the Aged Day", date: '2024-09-16', type: HOLIDAY_TYPES.PUBLIC, description: "Third Monday of September" },
    { name: "Autumnal Equinox Day", date: '2024-09-23', type: HOLIDAY_TYPES.PUBLIC, description: "Autumn equinox" },
    { name: "Sports Day", date: '2024-10-14', type: HOLIDAY_TYPES.PUBLIC, description: "Second Monday of October" },
    { name: "Culture Day", date: '2024-11-03', type: HOLIDAY_TYPES.PUBLIC, description: "Culture promotion" },
    { name: "Labor Thanksgiving Day", date: '2024-11-23', type: HOLIDAY_TYPES.PUBLIC, description: "Thanksgiving" },
    { name: "Christmas Day", date: '2024-12-25', type: HOLIDAY_TYPES.OBSERVANCE, description: "Christmas celebration" },
    // 2025
    { name: "New Year's Day", date: '2025-01-01', type: HOLIDAY_TYPES.PUBLIC, description: "First day of the year" },
    { name: "Coming of Age Day", date: '2025-01-13', type: HOLIDAY_TYPES.PUBLIC, description: "Second Monday of January" },
    { name: "National Foundation Day", date: '2025-02-11', type: HOLIDAY_TYPES.PUBLIC, description: "February 11" },
    { name: "Emperor's Birthday", date: '2025-02-24', type: HOLIDAY_TYPES.PUBLIC, description: "Emperor's birthday" },
    { name: "Showa Day", date: '2025-04-29', type: HOLIDAY_TYPES.PUBLIC, description: "Former Emperor's birthday" },
    { name: "Constitution Memorial Day", date: '2025-05-03', type: HOLIDAY_TYPES.PUBLIC, description: "Constitution day" },
    { name: "Greenery Day", date: '2025-05-04', type: HOLIDAY_TYPES.PUBLIC, description: "Nature appreciation" },
    { name: "Children's Day", date: '2025-05-05', type: HOLIDAY_TYPES.PUBLIC, description: "Boy's festival" },
    { name: "Marine Day", date: '2025-07-21', type: HOLIDAY_TYPES.PUBLIC, description: "Third Monday of July" },
    { name: "Mountain Day", date: '2025-08-11', type: HOLIDAY_TYPES.PUBLIC, description: "August 11" },
    { name: "Respect for the Aged Day", date: '2025-09-15', type: HOLIDAY_TYPES.PUBLIC, description: "Third Monday of September" },
    { name: "Autumnal Equinox Day", date: '2025-09-23', type: HOLIDAY_TYPES.PUBLIC, description: "Autumn equinox" },
    { name: "Sports Day", date: '2025-10-13', type: HOLIDAY_TYPES.PUBLIC, description: "Second Monday of October" },
    { name: "Culture Day", date: '2025-11-03', type: HOLIDAY_TYPES.PUBLIC, description: "Culture promotion" },
    { name: "Labor Thanksgiving Day", date: '2025-11-24', type: HOLIDAY_TYPES.PUBLIC, description: "Thanksgiving" },
    { name: "Christmas Day", date: '2025-12-25', type: HOLIDAY_TYPES.OBSERVANCE, description: "Christmas celebration" },
  ],
};

// Get holidays for a specific country and month
export const getHolidaysForMonth = (countryCode, year, month) => {
  const holidays = HOLIDAYS[countryCode] || HOLIDAYS.US;
  const monthStr = String(month + 1).padStart(2, '0');
  return holidays.filter(h => h.date.startsWith(`${year}-${monthStr}`));
};

// Get all holidays for a country in a year
export const getYearHolidays = (countryCode, year) => {
  const holidays = HOLIDAYS[countryCode] || HOLIDAYS.US;
  return holidays.filter(h => h.date.startsWith(`${year}`));
};

// Check if a specific date is a holiday
export const isHoliday = (date, countryCode) => {
  const dateStr = date.toISOString().split('T')[0];
  const holidays = HOLIDAYS[countryCode] || HOLIDAYS.US;
  return holidays.find(h => h.date === dateStr);
};

// Get holiday color based on type
export const getHolidayColor = (type) => {
  switch (type) {
    case HOLIDAY_TYPES.PUBLIC:
      return 'bg-red-100 text-red-700 border-red-200';
    case HOLIDAY_TYPES.RELIGIOUS:
      return 'bg-purple-100 text-purple-700 border-purple-200';
    case HOLIDAY_TYPES.OBSERVANCE:
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case HOLIDAY_TYPES.SCHOOL:
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export default {
  COUNTRIES,
  HOLIDAY_TYPES,
  HOLIDAYS,
  getHolidaysForMonth,
  getYearHolidays,
  isHoliday,
  getHolidayColor,
};

