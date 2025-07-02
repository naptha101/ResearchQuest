import { paperReviewAnalysis } from '@/app/Services/Literation-Review';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import DetailedPaperShow from './DetailedPaperShow';
import { Loader2 } from 'lucide-react';

const AdvanceAnalysis = ({ papers }) => {

  const [researchPapers,setReseachPapers]=useState(null)
  const [loading,setLoading]=useState(false)
  const HandlePaperAnalysis = async () => {
    try {
      setLoading(true)
      const response = await paperReviewAnalysis(papers);
      console.log(response)
      if(response.papers){
        setReseachPapers(response.papers)
      setLoading(false)
      }else{
        toast.error("No papers found")
        setLoading(false)
      }
    } catch (err) {
      console.log(err);
      toast.error("Unable to perform analysis");
      setLoading(false);
    }
  };


  return (
    <div className="py-8 px-4 max-w-full border-t-2 border-amber-500 flex flex-col gap-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Research Paper Insights
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {papers.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition duration-300"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {item.title}
            </h3>
            <p className="text-sm text-gray-500 mb-1">
              <span className="font-semibold">Authors:</span> {item.authors}
            </p>
            <p className="text-sm text-gray-500 mb-1">
              <span className="font-semibold">Published:</span> {item.published}
            </p>
            <p className="text-sm text-gray-500 mb-1">
              <span className="font-semibold">PDF:</span> {item.pdf_availability}
            </p>
            <p className="text-sm text-gray-500 mb-1">
              <span className="font-semibold">Source:</span> {item.source}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              <span className="font-semibold">Cosine Similarity:</span>{' '}
              {item.cosine_similarity.toFixed(2)}
            </p>
            <p className="text-sm text-gray-700 line-clamp-5 mb-3">
              {item.summary}
            </p>
            {/* <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-amber-600 hover:underline font-medium"
            >
              View PDF ↗
            </a> */}
          </div>
        ))}
      </div>

      <button onClick={()=>{HandlePaperAnalysis()}} className='bg-gradient-to-r rounded-xl p-3 text-xl text-white shadow-xl hover:scale-105 cursor-pointer from-amber-400 to-orange-500'>
        Paper Review Analysis
      </button>

      {researchPapers&&!loading&&<DetailedPaperShow papers={researchPapers}>

      </DetailedPaperShow>}
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

export default AdvanceAnalysis;
