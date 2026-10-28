import React from 'react'
import HeroSection from '../com/HeroSection'
import TechnologyPartners from '../newcom/TechnologyPartners'
import PartnersSection from '../newcom/PartnersSection'
import Brand from '../com/Brand'
import Services from '../com/Services'
import PortfolioSection from '../com/PortfolioSection'
import ContactSection from '../com/ContactSection'
import { getVisiblePortfolio } from '../lib/portfolio'

async function Homee() {
  // Same projects as the /portfolio page (Admin → Portfolio).
  const projects = await getVisiblePortfolio()
  return (
    <div>
        <HeroSection/>

        <Brand/>
    <TechnologyPartners/>
    <PartnersSection/>
    <Services/>
    <PortfolioSection projects={projects}/>
    <ContactSection/>
    </div>
  )
}

export default Homee