
import Head from "next/head";
import ResearchFeatures from "./Component/home/ResearchFeature";
import Hero from "./Component/home/Hero";
import Partners from "./Component/home/Partners";
import Features from "./Component/home/Features";
import CTA from "./Component/home/CTA";
import AboutUs from "./Component/home/AboutUs";

export default function Home() {
  



  return (
    <>
      <Head>
        <title>Research Quest - Superpower Your Research Process</title>
        <meta
          name="description"
          content="Transform your research journey with AI-powered tools for brainstorming, analysis, and academic writing."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen text-black bg-orange-50">
      
    <Hero></Hero>
    <AboutUs></AboutUs>
    <Partners></Partners>
    {/* <Features></Features>  */}
  
        <ResearchFeatures></ResearchFeatures>
          <CTA></CTA>
          <Features></Features>
      </div>
    </>
  );
}
