import React from 'react'
import DashboardOverview from './DashboardOverview'
import ActivityOverview from './ActivityOverview'
import RecentActivity from './RecentActivity'

const ReturnDashboard = () => {
  return (
    <div>
        <DashboardOverview />
        <ActivityOverview />
        <RecentActivity />
    </div>
  )
}

export default ReturnDashboard