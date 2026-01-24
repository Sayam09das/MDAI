import React from 'react'
import StudentAnalytics from './StudentAnalytics'
import StudentMetricsOverview from './StudentMetricsOverview'
import StudentActivityAnalytics from './StudentActivityAnalytics'

const ReturnDashboardUser = () => {
  return (
    <div>
        <StudentAnalytics />
        <StudentMetricsOverview />
        <StudentActivityAnalytics />
    </div>
  )
}

export default ReturnDashboardUser