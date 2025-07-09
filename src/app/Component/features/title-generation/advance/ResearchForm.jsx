"use client";
import { getLiteraturPosts, getPreviousResearch, getSimpleLiteraturePosts } from "@/app/Services/Literation-Review";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ResearchShowcase from "./ReseachShowCase";

export default function ResearchSearchForm() {
  const [formData, setFormData] = useState({
    subject: "",
    specialization: "",
    database: "arxiv",
    keywords: "",
    tokensToDebit: 1,
    description: "Research Area Identification"
  });
  const [papers, setPapers] = useState(null);
  const [loading, setLoading] = useState(false);
  
    const [isAdvanced, setIsAdvanced] = useState(true); // Toggle state

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
      const response = await getLiteraturPosts(formData);
     console.log(response)
        const params = new URLSearchParams(window.location.search);
  if(response._id)params.set('id', response._id); // Set or update
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.pushState({}, '', newUrl);
      setPapers(response.output.basePapers);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error("Error searching");
    }
  };

const handleHistory=async(id)=>{
  try{

    const response = await getPreviousResearch(id);
  //console.log(response)
  if(response.data.output){
    setPapers(response.data.output.basePapers);
  }
  }
  catch(err){
    console.log(err)
    toast.error("Error fetching old Research History.")
  }
}

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const subject = params.get('subject');
    const specialization = params.get('specialization');
    const keywords = params.get('keywords')?.split(',');
    const id=params.get("id")
 if(subject&&specialization&&keywords)
    setFormData({...formData,subject:subject,specialization:specialization,keywords:keywords.join(",")})
  if(id){
  handleHistory(id)
  }
  }, []);
  const handleSimpleSearch=async()=>{
    setLoading(true);
    try{
    const response = await getSimpleLiteraturePosts({
      subject: formData.subject,
      api_key:process.env.NEXT_PUBLIC_OPEN_API_KEY,
      database: "all",
    });
if(response.papers)
  setPapers(response)
else
toast.error("Can't find any papers")
  }
    catch(err){
      console.log(err)
      toast.error("Error doing simple search")
    }
    setLoading(false)
  }


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
        <div className="flex gap-2 justify-center mb-6">
          <button
            onClick={() => setIsAdvanced(false)}
            className={`px-6 py-2  rounded-l-lg border cursor-pointer border-gray-300 ${!isAdvanced ? 'bg-gradient-to-r rounded-t-2xl from-orange-500 to-amber-500 text-white font-semibold' : 'bg-gray-100 text-gray-700'}`}
            disabled={loading}
          >
            Simple Search
          </button>
          <button
            onClick={() => setIsAdvanced(true)}
            className={`px-6 py-2 rounded-r-lg border cursor-pointer border-gray-300 ${isAdvanced ? 'bg-gradient-to-r rounded-t-2xl from-orange-500 to-amber-500 text-white font-semibold' : 'bg-gray-100 text-gray-700'}`}
            disabled={loading}
          >
            Deep Search
          </button>
        </div>

        {/* Shared Input Fields (can vary between modes) */}
        {isAdvanced ? (
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
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-1 col-span-2">
              <label className="block text-sm font-medium text-gray-700">Subject</label>
              <input
                type="text"
                name="subject"
                disabled={loading}
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. Education"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-3">
            <button
              disabled={loading}
              onClick={isAdvanced ? handleSearch : handleSimpleSearch}
              className="px-6 py-3 bg-gradient-to-r cursor-pointer from-orange-500 to-amber-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              {isAdvanced ? "Deep Search" : "Simple Search"}
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
        {papers && (
          <div className="mt-16 animate-fade-in">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Research Results</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full"></div>
            </div>
            <ResearchShowcase data={papers}  setData={setPapers} isAdvanced={isAdvanced} />
          </div>
        )}
      </div>
    </div>
  );
}