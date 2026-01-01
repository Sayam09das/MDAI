import React from 'react'
import TeacherStats from './TeacherStats'
import CourseOverview from './CourseOverview'
import RecentActivity from './RecentActivity'
import LiveClassSchedule from './LiveClassSchedule'
import EarningsOverview from './EarningsOverview'
import EngagementChart from './EngagementChart'
import ProfileStatus from './ProfileStatus'

const ReturnDashboard = () => {
    return (
        <div>
            <ProfileStatus />
            <TeacherStats />
            <CourseOverview />
            <RecentActivity />
            <LiveClassSchedule />
            <EarningsOverview />
            <EngagementChart />
        </div>
    )
}

export default ReturnDashboard
