import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiExternalLink, FiDownload, FiChevronDown, FiChevronUp, FiSearch, FiX } from 'react-icons/fi';
import { useTitle } from '@/app/Context/TitleContext';
import { useRouter, useSearchParams } from 'next/navigation';
import AdvanceAnalysis from './analysis/AdvanceAnalysis';
import { ArrowBigDown, ArrowBigLeft, ArrowBigRight } from 'lucide-react';
import { getPreviousResearch } from '@/app/Services/Literation-Review';

const ResearchShowcase = ({ data,setData,isAdvanced }) => {
  const [activePaper, setActivePaper] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'recency_score', direction: 'asc' });
  const [expandedKeywords, setExpandedKeywords] = useState(false);
  const [selectedPapers, setSelectedPapers] = useState([]);
  
  const {setPapers}=useTitle()
  const router=useRouter()
  const togglePaper = (id) => {
    setActivePaper(activePaper === id ? null : id);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleHistory=async(id)=>{
    try{
  
      const response = await getPreviousResearch(id);
    //console.log(response)
    if(response.data.level2.input.papers){
  //     response.data.level2.input.papers.map((ppr)=>{
    
  // setSelectedPapers(response.data.level2.input.papers)

  //   })
   setSelectedPapers(response.data.level2.input.papers)
  }
    }
    catch(err){
      console.log(err)
      toast.error("Error fetching old Research History.")
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
      if (prev.some(p => p.index === paper.index)) {
        return prev.filter(p => p.index !== paper.index);
      }
      // If we haven't reached max selection, add it
      if (prev.length < 3) {
        return [...prev, paper];
      }
      // Otherwise, don't change selection
      return prev;
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
      {selectedPapers.length > 0 && (
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
      )}

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
                  disabled={selectedPapers.length >= 3 && !isPaperSelected(index)}
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
        {/* <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>Search cost: {data.token_usage.total_cost} ({data.token_usage.input_tokens} input, {data.token_usage.output_tokens} output tokens)</p>
          <p className="mt-1">Data retrieved from {data.databases_used}</p>
        </div> */}
      </div>

{
selectedPapers.length>0&&
<div  id="advance">
{isAdvanced&&<AdvanceAnalysis papers={selectedPapers} keyword={null}  ></AdvanceAnalysis>}
{!isAdvanced&&<AdvanceAnalysis papers={selectedPapers} keyword={visibleKeywords}></AdvanceAnalysis>}
</div>
}

    </div>
  );
};

export default ResearchShowcase;