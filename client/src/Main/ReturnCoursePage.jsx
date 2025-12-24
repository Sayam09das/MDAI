import React from 'react'
import CourseHeader from './CoursePage/CourseHeader'
import CourseNavigationTabs from './CoursePage/CourseNavigationTabs'
import OverviewSection from './CoursePage/OverviewSection'

const returnCoursepage = () => {
    return (
        <div>
            <CourseHeader />
            <CourseNavigationTabs />
            <OverviewSection />

        </div>
    )
}

export default returnCoursepage
