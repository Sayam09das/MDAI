import React from 'react'
import DashboardOverview from './DashboardOverview'
import ActivityOverview from './ActivityOverview'
import RecentActivity from './RecentActivity'
import QuickActions from './QuickActions'
import AdminProfileMain from './AdminProfileMain'

const ReturnDashboard = () => {
    return (
        <div>
            <AdminProfileMain />
            <DashboardOverview />
            <ActivityOverview />
            <RecentActivity />
            <QuickActions />
        </div>
    )
}

export default ReturnDashboard