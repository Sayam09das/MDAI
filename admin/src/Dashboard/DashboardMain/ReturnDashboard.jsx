import React from 'react'
import DashboardOverview from './DashboardOverview'
import ActivityOverview from './ActivityOverview'
import RecentActivity from './RecentActivity'
import QuickActions from './QuickActions'

const ReturnDashboard = () => {
  return (
    <div>
        <DashboardOverview />
        <ActivityOverview />
        <RecentActivity />
        <QuickActions />
    </div>
  )
}

export default ReturnDashboard