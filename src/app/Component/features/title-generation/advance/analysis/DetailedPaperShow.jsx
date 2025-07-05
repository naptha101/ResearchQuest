"use client"

import { generateAdvanceTitles } from '@/app/Services/Literation-Review';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import ResearchTitlesDisplay from './ShowAdvanceTitles';

const DetailedPaperShow = ({ papers }) => {

    const [data,setData]=useState(null)
    const [loading,setLoading]=useState(false);
 
    const handleGenereateTitles=async ()=>{
            setLoading(true)

        try{
             const params = new URLSearchParams(window.location.search);
    const specialization = params.get('specialization');
    const keywords = params.get('keywords')?.split(',');
         const data={
            papers:papers,
            specialization: specialization,
    keywords:keywords,
        api_key: process.env.NEXT_PUBLIC_OPEN_API_KEY
         }
//console.log(data)
  const response=await generateAdvanceTitles(data);
  if(response){
      console.log(response)
 setData(response.data)
    toast.success('Advance Titles Generated Successfully');
    setLoading(false)
  }
  else{
    toast.error('Failed to Generate Advance Titles');
    setLoading(false)
  }       
}     
        catch(err){
     console.log(err)
     toast.error("  Error generating titles ")
     setLoading(false)
        }
    }
  return (
    <div className="py-10 px-4 max-w-6xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 border-b-2 border-amber-500 pb-2">
        Research Paper Analysis
      </h2>

      {papers.map((paper, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {paper.title}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Authors:</span> {paper.authors}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            <span className="font-medium">Year:</span> {paper.year}
          </p>

          <div className="mb-4">
            <p className="font-semibold text-gray-700 mb-1">Methodology:</p>
            <p className="text-sm text-gray-700">{paper.analysis.methodology}</p>
          </div>

          <div className="mb-4">
            <p className="font-semibold text-gray-700 mb-1">Novelty:</p>
            <p className="text-sm text-gray-700">{paper.analysis.novelty}</p>
          </div>

          <div className="mb-4">
            <p className="font-semibold text-gray-700 mb-1">Identified Gaps:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              {paper.analysis.gaps.map((gap, i) => (
                <li key={i}>{gap}</li>
              ))}
            </ul>
          </div>

          {/* <a
            href={paper.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-amber-600 font-medium text-sm hover:underline"
          >
            View Full Paper ↗
          </a> */}
        </div>
      ))}



      <button onClick={()=>{handleGenereateTitles()}} className='w-[30vw] my-3 cursor-pointer shadow-2xl hover:scale-105 text-white py-4 text-2xl bg-gradient-to-r from-amber-400 rounded-2xl to-orange-400'>
  Generate Advance Titles

      </button>{

        !loading&&data&&
      <ResearchTitlesDisplay data={data}></ResearchTitlesDisplay>}
      {loading && (
          <div className="mt-16 flex flex-col items-center justify-center">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
              <div className="absolute inset-4 rounded-full border-4 border-orange-500 border-t-transparent animate-spin animation-delay-200"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Gathering Research</h3>
            <p className="text-gray-600 max-w-md text-center">
              Our AI is scanning thousands of papers to find the most relevant research for you...
            </p>
          </div>
        )}
    </div>
  );
};

export default DetailedPaperShow;
