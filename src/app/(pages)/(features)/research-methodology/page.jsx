"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { deepSearch, paperChoose } from "@/app/Services/Methodology";
import ResearchGapsList from "@/app/Component/features/Research-Methodology/ResearchGapsList";

export default function ResearchSearchForm() {
  const [formData, setFormData] = useState({
    subject: "",
    specialization: "",
    database: "arxiv",
    keywords: "",
    researchIdea:"",
    api_key:process.env.NEXT_PUBLIC_OPEN_API_KEY

  });
  const [papers, setPapers] = useState(null);
  const [loading, setLoading] = useState(false);
  

  const handleChange = (e) => {
    if (e.target.name === 'keywords') {
      const dat = e.target.value.split(',');
      setFormData({ ...formData, [e.target.name]: dat });
      return;
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    setLoading(true);
    try {
      const response = await deepSearch(formData);
  //   console.log(response)
//         const params = new URLSearchParams(window.location.search);
//   if(response._id)params.set('id', response._id); // Set or update
//   const newUrl = `${window.location.pathname}?${params.toString()}`;
//   window.history.pushState({}, '', newUrl);
if(response.papers){
     await handleChoosePapers(response.papers)}
      else{
        toast.error("Error Searching Papers.")
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error("Error searching");
    }
  };
  const handleChoosePapers=async(data)=>{
    setLoading(true)
    try{
 const response = await paperChoose({papers:data,openapikey:process.env.NEXT_PUBLIC_OPEN_API_KEY});

 if(response.results){
          setPapers(response.results);
          toast.success("Papers fetched succesfully")
 }else{
    toast.error("Error fetching papers")
 }
    }
    catch(err){
      //  console.log(err)
       toast.error("Error fetching papers")

        return err.message
    }
    setLoading(false)

  }


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const subject = params.get('subject');
    const specialization = params.get('specialization');
    const keywords = params.get('keywords')?.split(',');
    const id=params.get("id")
 if(subject&&specialization&&keywords)
    setFormData({...formData,subject:subject,specialization:specialization,keywords:keywords.join(",")})
  
  }, []);



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mt-6 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-800 bg-clip-text text-transparent mb-4">
            Discover Research Like Never Before
          </h1>
          <p className="text-lg text-brand max-w-2xl mx-auto">
            The most advanced research platform powered by AI - bringing the world's knowledge to your fingertips
          </p>
        </div>

        {/* Search Card */}
         <div className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${loading ? "opacity-80 cursor-progress" : ""}`}>
      <div className="p-8">

        {/* Tab Toggle */}
       

        {/* Shared Input Fields (can vary between modes) */}
        
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Subject</label>
              <input
                type="text"
                name="subject"
                disabled={loading}
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. Computer Science"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Specialization</label>
              <input
                type="text"
                name="specialization"
                disabled={loading}
                value={formData.specialization}
                onChange={handleChange}
                placeholder="e.g. Machine Learning"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Keywords</label>
              <input
                type="text"
                name="keywords"
                disabled={loading}
                value={formData.keywords}
                onChange={handleChange}
                placeholder="Separate with commas (neural, network, ai)"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
             <div className="space-y-1 col-span-3">
              <label className="block text-sm font-medium text-gray-700">Research Idea</label>
              <textarea
                type="text"
                name="researchIdea"
                disabled={loading}
                value={formData.researchIdea}
                onChange={handleChange}
                placeholder="Write your idea briefly.."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-3">
            <button
              disabled={loading}
              onClick={  handleSearch }
              className="px-6 py-3 bg-gradient-to-r cursor-pointer from-orange-500 to-amber-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              { "Deep Search" }
            </button>
          </div>
        </div>

      </div>
    </div>

        {/* Loading State */}
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

        {/* Results */}
        {
            papers&&
            <ResearchGapsList data={papers} idea={formData.researchIdea}></ResearchGapsList>
        }

       
      </div>
    </div>
  );
}