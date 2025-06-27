import Image from 'next/image';
import React from 'react'

const Hero = () => {
      const stats = {
    users: "10,000",
    papers: "50,000",
    citations: "200,000",
  };
  return (
   <section className="px-6 pt-20 pb-16 text-center bg-white">

    <div className='top-15 right-4  absolute hidden md:block  p-2  rotate-3 h-fit w-fit'>
<Image height={100} width={100} className='rounded-full h-60 w-96 border-1 border-orange-400 border-dashed' 
src={'/images/home/paper-images2.svg'}
alt="Paper Image"
></Image>
    </div>
      <div className='top-45 left-8 absolute hidden md:block  p-2 -rotate-5 h-fit w-fit'>
<Image height={100} width={100} className='rounded-full h-40 w-50 border-1 border-orange-400 border-dashed' 
src={'/images/home/research-bg.webp'}
alt="Paper Image"
></Image>
    </div>
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Superpower <br />
              <span className="text-orange-500">Your Research</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Supercharge every step—from brainstorming ideas to data analysis
              and crafting flawless papers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium shadow">
                Start Research Journey
              </button>
              <button className="border border-orange-500 text-orange-500 px-6 py-3 rounded-lg hover:bg-orange-100 font-medium shadow-sm transition">
                Watch Demo
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              <div className="text-center">
                <div className="text-3xl font-semibold text-orange-700">
                  {stats.users}+
                </div>
                <div className="text-gray-700">Active Researchers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-semibold text-orange-700">
                  {stats.papers}+
                </div>
                <div className="text-gray-700">Papers Generated</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-semibold text-orange-700">
                  {stats.citations}+
                </div>
                <div className="text-gray-700">Citations Created</div>
              </div>
            </div>
          </div>
        </section>
)
}

export default Hero