import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiExternalLink, FiDownload, FiChevronDown, FiChevronUp, FiSearch, FiX } from 'react-icons/fi';
import { useRouter, useSearchParams } from 'next/navigation';

import { getPreviousResearch } from '@/app/Services/Literation-Review';
import { finalReview, generateCitation, generateContext, generateTitle } from '@/app/Services/Literature_Review';
import { toast } from 'react-toastify';
import ProgressBar from './ProgressBar';
import { GenerateIdea } from '@/app/Services/Idea-Generation';
import IdeasGrid from './IdeasGrid';

const PaperShow = ({ data,setData,isAdvanced }) => {
  const [activePaper, setActivePaper] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'recency_score', direction: 'asc' });
  const [expandedKeywords, setExpandedKeywords] = useState(false);
  const [selectedPapers, setSelectedPapers] = useState([]);
  const [lrInputs,setLrInputs]=useState([]);
  const [reviews,setReviews]=useState([]);
  const [Ideas,setIdeas]=useState(null)
  const router=useRouter()

const [generationProgress, setGenerationProgress] = useState(0);
const [isGenerating, setIsGenerating] = useState(false);
const progressSteps = ['Initializing', 'Fetching Papers', 'Analyzing Content', 'Generating Review', 'Finalizing'];
const progressMessages = [
  'Starting the literature review generation process...',
  'Retrieving selected paper details...',
  'Analyzing paper contents and extracting key information...',
  'Generating comprehensive literature review...',
  'Finalizing and formatting your review...',
  'Literature review generated successfully!'
];

  const togglePaper = (id) => {
    setActivePaper(activePaper === id ? null : id);
  };
const handleLiteraturReview = async () => {
  try {
    setIsGenerating(true);
    setGenerationProgress(1); // Initializing
    
    // Process papers sequentially to avoid race conditions
    const newInputs = [];
    
    for (const val of selectedPapers) {
      setGenerationProgress(2); // Fetching Papers
      const [respTitle, respContext, respCitation] = await Promise.all([
        generateTitle(val.link),
        generateContext(val.link),
        generateCitation(val.link)
      ]);

      if (respTitle.results && respContext.results && respCitation.results) {
        setGenerationProgress(3); // Analyzing Content
        newInputs.push({
          titleLR: respTitle.results.title,
          graphragLR: respContext.results,
          citationLR: respCitation.results,
          openapikey: process.env.NEXT_PUBLIC_OPEN_API_KEY
        });
      } else {
        toast.error("Error in Generating Literature Review");
        setIsGenerating(false);
        return;
      }
    }

    setLrInputs(newInputs);
    setGenerationProgress(4); // Generating Review
    await handleReviewGen();
    setGenerationProgress(5); // Finalizing
    
    // Small delay before hiding progress bar
    setTimeout(() => {
      setIsGenerating(false);
      setGenerationProgress(0);
    }, 1500);

  } catch (err) {
    console.error(err);
    toast.error("Failed to generate literature review");
    setIsGenerating(false);
    setGenerationProgress(0);
  }
};
const handleReviewGen=async()=>{
    try{
    
        const newReviews=[]
        for(const val of lrInputs){
        const resp=await finalReview(val)
                   // console.log(resp)

        if(resp.results){
            newReviews.push(resp)
           // console.log(resp)
        }else{
            toast.error("Error in Generating Literature Review");
        }
    }
    setReviews(newReviews)

}
    catch(err){
        console.error(err);
        toast.error("Failed to generate review");

    }
}
 const handleIdeaGeneration=async()=>{
  
  try{
const response=await GenerateIdea({
  combinedLR:reviews,
  openapikey:process.env.NEXT_PUBLIC_OPEN_API_KEY
})
if(response.results.Research_Ideas){
  setIdeas(response.results.Research_Ideas)
}else{
  toast.error("Can't generate ideas.")
}

}
  catch(err){
console.log(err)
toast.error("Error in generating Ideas.")
  }
 }


const params=useSearchParams();
  useEffect(()=>{
    const id=params.get("id");
if(id)handleHistory(id)
  },[])
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedPapers = [...data.papers].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredPapers = sortedPapers.filter(paper => {
    const searchLower = searchTerm.toLowerCase();
    return (
      paper.title.toLowerCase().includes(searchLower) ||
      paper.authors.toLowerCase().includes(searchLower) ||
      paper.summary.toLowerCase().includes(searchLower) ||
      paper.keywords_used.some(kw => kw.toLowerCase().includes(searchLower))
    );
  });

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const visibleKeywords = expandedKeywords 
    ? data.keywords_used 
    : data.keywords_used.slice(0, 3);

  // Handle paper selection
  const togglePaperSelection = (paper) => {
    setSelectedPapers(prev => {
      // If paper is already selected, remove it
         if(prev.length>=5)return prev

      if (prev.some(p => p.index === paper.index)) {
        return prev.filter(p => p.index !== paper.index);
      }
        return [...prev, paper];
    });
  };
  const handleNext=()=>{
    if (selectedPapers.length === 0) return;
    
    router.push('/title-generation/advance/#advance')
  }

  // Scroll to selected paper
  const scrollToPaper = (index) => {
    const element = document.getElementById(`paper-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Check if a paper is selected
  const isPaperSelected = (index) => {
    return selectedPapers.some(p => p.index === index);
  };
const [openSelected,setSelected]=useState(true);

  return (
    <div className="min-h-screen mt-3 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 p-6 relative">
      {/* Floating selected papers container */}
      {/* {selectedPapers.length > 0 && (
        <div className={"fixed  top-1/2 transform -translate-y-1/2 w-64 bg-white rounded-xl shadow-lg p-4 z-10 max-h-[70vh] overflow-y-auto"+(openSelected?" right-6":" -right-50")}>
          <h3 className="font-semibold  text-indigo-800 mb-3 border-b pb-2">
             <span className='cursor-pointer'>{!openSelected?<ArrowBigLeft onClick={()=>{setSelected(!openSelected)}} height={40} width={40}></ArrowBigLeft>:<ArrowBigRight onClick={()=>{setSelected(!openSelected)}} height={40} width={40}></ArrowBigRight>}</span>   Selected Papers ({selectedPapers.length}/3)
          </h3>
          <ul className="space-y-2">
            {selectedPapers.map((paper) => (
              <li 
                key={paper.index}
                className="p-2 hover:bg-indigo-50 rounded-lg cursor-pointer transition-colors"
                onClick={() => scrollToPaper(paper.index)}
              >
                <div className="flex items-start">
                  <span className="text-xs font-medium bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center p-2 mr-2 mt-0.5">
                    {paper.index + 1}
                  </span>
                  <span className="text-sm text-gray-700 line-clamp-2">
                    {paper.title}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          {selectedPapers.length === 3 && (
            <p className="text-xs text-gray-500 mt-2 italic">Maximum 3 papers selected</p>
          )}
           {selectedPapers.length >0 && (
            <a  href='#advance' className="text-xs text-white bg-blue-500 p-2 mt-2 italic">Next</a>
          )}
        </div>
      )} */}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-indigo-900 mb-2">Research Paper Explorer</h1>
          <p className="text-lg text-indigo-700">
            Exploring {data.papers.length} papers 
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[250px]">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Keywords Used</h3>
              <div className="flex flex-wrap gap-2">
                {visibleKeywords.map((keyword, i) => (
                  <span 
                    key={i}
                    className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full"
                  >
                    {keyword.trim()}
                  </span>
                ))}
                {data.keywords_used.length > 3 && (
                  <button 
                    onClick={() => setExpandedKeywords(!expandedKeywords)}
                    className="text-indigo-600 text-sm flex items-center"
                  >
                    {expandedKeywords ? (
                      <>
                        Show less <FiChevronUp className="ml-1" />
                      </>
                    ) : (
                      <>
                        +{data.keywords_used.length - 3} more <FiChevronDown className="ml-1" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">Sort by:</span>
              <select
                className="border border-gray-200 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-indigo-500"
                value={sortConfig.key}
                onChange={(e) => requestSort(e.target.value)}
              >
                <option value="recency_score">Recency</option>
                <option value="cosine_similarity">Relevance</option>
                <option value="year">Year</option>
                <option value="title">Title</option>
              </select>
              <span className="text-sm text-gray-500">
                {sortConfig.direction === 'asc' ? 'Asc' : 'Desc'}
              </span>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            Showing {filteredPapers.length} of {data.papers.length} papers
          </p>
          <p className="text-sm text-gray-500">
            Search completed in {data.time_taken}
          </p>
        </div>

        {/* Papers List */}
        <div className="space-y-4">
          {filteredPapers.length > 0 ? (
            filteredPapers.map((paper, index) => (
              <motion.div
                key={index}
                id={`paper-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-md overflow-hidden relative"
              >
                {/* Selection checkbox */}
                <button
                  onClick={() => togglePaperSelection({ ...paper, index })}
                  className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isPaperSelected(index) 
                      ? 'bg-indigo-600 border-indigo-600 text-white' 
                      : 'bg-white border-gray-300 hover:border-indigo-400'
                  }`}
                  title={isPaperSelected(index) ? "Remove from selection" : "Add to selection"}
                >
                  {isPaperSelected(index) && (
                    <span className="text-xs font-bold">{selectedPapers.findIndex(p => p.index === index) + 1}</span>
                  )}
                </button>

                <div 
                  className="p-6 cursor-pointer hover:bg-indigo-50 transition-colors"
                  onClick={() => togglePaper(index)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-6">
                      <h2 className="text-xl font-semibold text-gray-800 mb-1">{paper.title}</h2>
                      <p className="text-sm text-indigo-600 mb-2">{paper.authors}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {paper.year}
                        </span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {paper.source}
                        </span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          Similarity: {(paper.cosine_similarity * 100).toFixed(1)}%
                        </span>
                        <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                          {paper.recency_score === 0 ? 'Very Recent' : `${paper.recency_score} years ago`}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 text-2xl text-gray-400">
                      {activePaper === index ? <FiChevronUp /> : <FiChevronDown />}
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {activePaper === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                        <p className="text-gray-700 mb-4">{paper.summary}</p>
                        
                        <div className="flex flex-wrap justify-between items-center gap-4">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>Published: {new Date(paper.published).toLocaleDateString()}</span>
                            <span>•</span>
                            <span className="text-green-600">{paper.pdf_availability}</span>
                          </div>
                          
                          <div className="flex gap-3">
                            <a
                              href={paper.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                              <FiExternalLink size={16} />
                              View Paper
                            </a>
                            {paper.link.includes('.pdf') && (
                              <a
                                href={paper.link}
                                download
                                className="flex items-center gap-1 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                              >
                                <FiDownload size={16} />
                                Download PDF
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <h3 className="text-xl font-medium text-gray-700 mb-2">No papers found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          )}
        </div>

        {/* Footer */}
       {selectedPapers.length>0&& <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
        
<button 
  onClick={() => handleLiteraturReview()} 
  disabled={isGenerating}
  className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
    isGenerating 
      ? 'bg-indigo-400 cursor-not-allowed' 
      : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl'
  } text-white flex items-center justify-center`}
>
  {isGenerating ? (
    <>
      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Generating...
    </>
  ) : (
    'Generate Literature Review'
  )}
</button>        



{ !isGenerating&&reviews.length>0&&
  <button onClick={()=>{handleIdeaGeneration()}} className='px-6 py-3 rounded-2xl font-medium transition-all duration-300 bg-orange-500 hover:bg-orange-700 shadow-lg test-white hover:shadow-xl '> Generate Research Idea</button>
}


</div>}
      </div>

{isGenerating && (
  <ProgressBar 
    steps={progressSteps} 
    currentStep={generationProgress} 
    progressMessages={progressMessages} 
  />
)}


{
  Ideas&&
  <IdeasGrid ideasData={Ideas}></IdeasGrid>
}

    </div>
  );
};

export default PaperShow;