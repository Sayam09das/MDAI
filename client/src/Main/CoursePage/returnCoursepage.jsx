import React from 'react'
import CourseHeader from './CourseHeader'
import CourseNavigationTabs from './CourseNavigationTabs'
import OverviewSection from './OverviewSection'

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
