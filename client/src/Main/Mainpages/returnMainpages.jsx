import React from 'react'
import StatsBar from './StatsBar'
import MainHeader from './MainHeader'
import Course from './Course'
import HowItWorks from './HowItWorks'
import LiveClassesSection from './LiveClassesSection'
import CategoriesSection from './CategoriesSection'
import Whychoose from './Whychoose'
import TeacherInvitation from './TeacherInvitation'
import StudentTestimonials from './StudentTestimonials'

const ReturnMainPages = () => {
  return (
    <>
      <MainHeader />
      <StatsBar />
      <Course />
      <HowItWorks />
      <LiveClassesSection />
      <CategoriesSection />
      <Whychoose />
      <TeacherInvitation />
      <StudentTestimonials />
    </>
  )
}

export default ReturnMainPages
