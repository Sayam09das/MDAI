import React from 'react'
import AboutHeroSection from './AboutHeroSection'
import OurMission from './OurMission'
import WhatWeOffer from './WhatWeOffer'
import HowItWorks from './HowItWorks'
import WhoWeServe from './WhoWeServe'
import OurValues from './OurValues'
import OurTeam from './OurTeam'
import Stats from './Stats'
import AboutCTA from './AboutCTA'

const ReturnAboutpage = () => {
    return (
        <div>
            <AboutHeroSection />
            <OurMission />
            <WhatWeOffer />
            <HowItWorks />
            <WhoWeServe />
            <OurValues />
            <OurTeam />
            <Stats />
            <AboutCTA />
        </div>
    )
}

export default ReturnAboutpage