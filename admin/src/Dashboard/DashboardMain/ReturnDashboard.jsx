import React from 'react'
import DashboardOverview from './DashboardOverview'
import ActivityOverview from './ActivityOverview'
import RecentActivity from './RecentActivity'
import QuickActions from './QuickActions'
import AdminProfileMain from './AdminProfileMain'

const ReturnDashboard = () => {
  return (
    <div>
        <DashboardOverview />
        <ActivityOverview />
        <RecentActivity />
        <QuickActions />
        <AdminProfileMain />
    </div>
  )
}

export default ReturnDashboard