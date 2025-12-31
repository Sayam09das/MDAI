import React from 'react'
import ContactHero from './ContactHero'
import ContactInfo from './ContactInfo'
import ContactForm from './ContactForm'
import SupportCategories from './SupportCategories'
import MapSection from './MapSection'
import ContactFAQ from './ContactFAQ'
import SocialLinks from './SocialLinks'

const ReturnContactpage = () => {
    return (
        <div>
            <ContactHero />
            <ContactInfo />
            <ContactForm />
            <SupportCategories />
            <MapSection />
            <ContactFAQ />
            <SocialLinks />
        </div>
    )
}

export default ReturnContactpage