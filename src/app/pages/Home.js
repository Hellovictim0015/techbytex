import React from 'react'
import HeroSection from '../com/HeroSection'
import TechnologyPartners from '../newcom/TechnologyPartners'
import PartnersSection from '../newcom/PartnersSection'
import Brand from '../com/Brand'
import Services from '../com/Services'
import PortfolioSection from '../com/PortfolioSection'
import ContactSection from '../com/ContactSection'

function Homee() {
  return (
    <div>
        <HeroSection/>

        <Brand/>
    <TechnologyPartners/>
    <PartnersSection/>
    <Services/>
    <PortfolioSection/>
    <ContactSection/>
    </div>
  )
}

export default Homee