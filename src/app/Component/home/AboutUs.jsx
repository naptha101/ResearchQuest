import Image from 'next/image';
import React from 'react';

// A clean, modern placeholder for the company logo.
// You should replace this entire component with your actual logo image.
const CompanyLogoPlaceholder = () => (
  <div className="flex h-32 w-48 items-center justify-center rounded-full bg-stone-100">
    <Image height={80} width={150} alt='Anushram' src={"/images/home/anushram2.webp"}></Image>
  </div>
);

const AboutUs = () => {
  return (
    // Section container with a light beige background and ample padding
    <section className='w-full bg-gradient-to-br to-orange-50 via-amber-25 from-yellow-50  py-14 sm:py-20 '>
      <div className='container mx-auto max-w-full px-6 lg:px-8'>
        {/* The main card with a clean, white background and soft shadow */}
        <div className='overflow-hidden rounded-2xl bg-white shadow-lg'>
          
          <div className='grid grid-cols-1 md:grid-cols-3'>

            {/* --- 1. LOGO SECTION (Left Column on Desktop) --- */}
            <div className="flex items-center justify-center p-8 md:border-r md:border-stone-200">
              
              <CompanyLogoPlaceholder />
            </div>

            {/* --- 2. TEXT CONTENT SECTION (Right Column on Desktop) --- */}
            <div className="px-8 pb-8 pt-4 text-left md:col-span-2 md:py-8">
              <h2 className='mb-4 text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl'>
                Who are  <span className="bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">We ?</span>
              </h2>

              <p className='text-lg leading-relaxed text-slate-600'>
                Anushram Research Quest offers a suite of AI-powered services designed to streamline the research process from inception to publication. These services assist with identifying emerging research areas, generating titles, building literature reviews, and developing research methodologies. The platform can create complete research proposals, write thesis chapters, and even prepare journal-ready articles.
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;