import React from 'react'
import CourseHeader from './CoursePage/CourseHeader'
import CourseActionCard from './CoursePage/CourseActionCard'
import CourseNavigationTabs from './CoursePage/CourseNavigationTabs'
import OverviewSection from './CoursePage/OverviewSection'

const ReturnCoursePage = () => {
    return (
        <div>
            <CourseHeader />
            <CourseNavigationTabs />
             {/* <CourseActionCard /> */}
             <OverviewSection />
        </div>
    )
}

export default ReturnCoursePage
