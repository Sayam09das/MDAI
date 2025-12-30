import React from 'react'
import CourseHeader from './CourseHeader'
import CourseNavigationTabs from './CourseNavigationTabs'
import OverviewSection from './OverviewSection'
import Curriculum from './Curriculum'
import LiveClassesSection from './LiveClassesSection'
import ResourcesMaterialsSection from './ResourcesMaterialsSection'
import InstructorTeacherProfile from './InstructorTeacherProfile'
import ReviewsRatings from './ReviewsRatings'
import CourseProgress from './CourseProgress'
import CourseFAQ from './CourseFAQ'
import RelatedCourses from './RelatedCourses'

const returnCoursepage = () => {
    return (
        <div>
            <CourseHeader />
            <CourseNavigationTabs />
            <OverviewSection />
            <Curriculum />
            <LiveClassesSection />
            <ResourcesMaterialsSection />
            <InstructorTeacherProfile />
            <ReviewsRatings />
            <CourseProgress />
            <CourseFAQ />
            <RelatedCourses />
        </div>
    )
}

export default returnCoursepage
