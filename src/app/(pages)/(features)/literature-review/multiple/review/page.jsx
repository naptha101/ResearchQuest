"use client"
import { consolidatedReport, finalReview, generateCitation, generateContext, generateTitle, summarizeReview } from '@/app/Services/Literature_Review'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState, useRef } from 'react'
import { toast } from 'react-toastify'
import { FileText, Quote, BookOpen, CheckCircle, AlertCircle, BookAIcon, ChevronRight,ChevronDown, ChevronUp,  Users, Target, Lightbulb, Search, Loader, Sparkles, RefreshCw, Download } from 'lucide-react'
import { PaperCard } from '@/app/Component/features/Literature-Review/multiple/PaperCard'
import { ReviewTable } from '@/app/Component/features/Literature-Review/multiple/ReviewTable'
import { title } from 'process'
import { generateCompleteReviewDoc } from '@/app/Services/GenerateMultipleReviewDoc'


const ProgressBar = ({ completed, total }) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6 overflow-hidden">
      <div
        className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  )
}

const StatusBadge = ({ status, count }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'loading': return 'bg-blue-100 text-blue-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(status)} flex items-center gap-1`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white bg-opacity-80 text-xs">
        {count}
      </span>
    </span>
  )
}


const Page = () => {
  const params = useSearchParams()
  const [papers, setPapers] = useState([])
  const [completedPapers, setCompletedPapers] = useState(0)
  const [loadingPapers, setLoadingPapers] = useState(0)
  const [errorPapers, setErrorPapers] = useState(0)
  const [paperData, setPaperData] = useState([])
  const [loadingCosolidated,setLoadingConsolidated]=useState(false)
  const [consolidatedReview,setConsolidated]=useState(null)
  const [summariesArray,setSummaries]=useState([])
  
  // State to manage the download button's loading status
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const initializePapers = () => {
      const paperParam = params.get("paper")
      const namesParam = params.get("names")
      
      if (paperParam && namesParam) {
        const baseUrl = paperParam.split('/').slice(0, -1).join('/') + '/'
        const paperNames = namesParam.split(',')
        
        const paperList = paperNames.map(name => ({
          name: name.trim(),
          url: baseUrl + name.trim()
        }))
        
        setPapers(paperList)
        setPaperData(paperList.map(() => ({})))
        setLoadingPapers(paperList.length)
      }
    }
    
    initializePapers()
  }, [params])

  // This is the original function, left untouched as it is passed to the ReviewTable component.
  const handleConsolidatedReview=async()=>{
    try{
      console.log(paperData)
      const cleanedData = paperData.map(item => {
        const { result } = item;
        const { DataSourceOfMethodology, RelationshipWithStudy, StatisticalTools, ...restResult } = result;
        return { ...item, result: restResult };
      });
      const response=await consolidatedReport(cleanedData)
      if(response.results){
        setConsolidated(response.results)
        setLoadingConsolidated(false)
        if(paperData&&summariesArray.length>0){
          console.log(summariesArray)
          generateCompleteReviewDoc(paperData,summariesArray,response.results)
        }
      }
    }
    catch(err){
      console.log(err);
      setLoadingConsolidated(false)
      toast.error("Error in generating Consolidated Review.")
    }
  }
  
  // This is the original function, left untouched.
  const summarizePaper = async () => {
    try {
      const summaryPromises=  paperData.map(async (dat,index)=>{
        const response = await summarizeReview({
          summarized_json: {
            individual_title: dat.title,
            literature_review: dat.result,
            citation: dat.citation
          },
          openapikey: process.env.NEXT_PUBLIC_OPEN_API_KEY
        })
        if (response.results) {
          const summary=response.results
          return summary
        } else {
          toast.error(`Error Dowloading doc file`)
          return null
        }
      })
      const summaryArray = (await Promise.all(summaryPromises))
      
      setSummaries(paperData.map((dat,ind)=>{
        return {
          title:dat.title,
          summary:summaryArray[ind],
        }
      }))
      await handleConsolidatedReview()
    } catch (err) {
      console.error(err)
      toast.error(`Error Downloading doc file.`)
    }
  }
  
  // This is the original function, left untouched.
  const handleDocGeneration=async()=>{
    try{
      await summarizePaper()
      console.log(summariesArray,consolidatedReview)
      if(paperData&&summariesArray.length>0&&consolidatedReview){
        console.log(summariesArray)
        generateCompleteReviewDoc(paperData,summariesArray,consolidatedReview)
      }
    }
    catch(err){
      console.error(err)
      toast.error("Error generating document.")
    }
  }

  // This is the new, improved download handler for the main button.
  // It is self-contained and manages its own state for a smooth user experience.
  const handleDownloadRequest = async () => {
      // Prevent download if papers are not yet processed.
      if (!allComplete) {
          toast.warn("Please wait until all papers are processed.");
          return;
      }

      setIsDownloading(true);
      toast.info("Preparing your document. This may take a moment...", { autoClose: 5000 });

      try {
          // Step 1: Generate Individual Summaries for all papers
          const summaryPromises = paperData.map(data =>
               summarizeReview({
                  summarized_json: {
                      individual_title: data.title,
                      literature_review: data.result,
                      citation: data.citation
                  },
                  openapikey: process.env.NEXT_PUBLIC_OPEN_API_KEY
              })
          );
          const summaryResponses = await Promise.all(summaryPromises);
          const summaries = summaryResponses.map((res, index) => {
              if (!res || !res.results) {
                  throw new Error(`Failed to summarize: ${paperData[index].title || `Paper ${index + 1}`}`);
              }
              return { title: paperData[index].title, summary: res.results };
          });

          // Step 2: Clean data and generate the Consolidated Report
          const cleanedData = paperData.map(item => {
              const { result } = item;
              const {
                  DataSourceOfMethodology,
                  RelationshipWithStudy,
                  StatisticalTools,
                  ...restResult
              } = result;
              return { ...item, result: restResult };
          });
          const consolidatedResponse = await consolidatedReport(cleanedData);
          if (!consolidatedResponse || !consolidatedResponse.results) {
              throw new Error("Failed to generate the consolidated report.");
          }
          const finalConsolidatedData = consolidatedResponse.results;

          // Step 3: Generate and trigger the final DOCX file download
          await generateCompleteReviewDoc(paperData, summaries, finalConsolidatedData);
          toast.success("Document downloaded successfully!");

      } catch (error) {
          console.error("Download failed:", error);
          toast.error(error.message || "An error occurred during document generation.");
      } finally {
          setIsDownloading(false);
      }
  };

  const handlePaperComplete = (index) => {
    setCompletedPapers(prev => prev + 1)
    setLoadingPapers(prev => prev - 1)
  }

  const handlePaperError = (index) => {
    setErrorPapers(prev => prev + 1)
    setLoadingPapers(prev => prev - 1)
  }

  const updatePaperData = (index, data) => {
    setPaperData(prev => {
      const newData = [...prev]
      newData[index] = { ...newData[index], ...data }
      return newData
    })
  }

  const totalPapers = papers.length
  const allComplete = completedPapers === totalPapers && totalPapers > 0
  const anyErrors = errorPapers > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mt-12 mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Literature Review Generator
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Generating comprehensive analysis for multiple research papers
          </p>
        </div>
        
        {/* Progress Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <span className="hidden sm:inline-flex w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Generation Progress
            </h2>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
              <StatusBadge status="completed" count={completedPapers} />
              <StatusBadge status="loading" count={loadingPapers} />
              <StatusBadge status="error" count={errorPapers} />
            </div>
          </div>
          <ProgressBar completed={completedPapers} total={totalPapers} />
          <div className='flex items-center justify-between '>
            <p className="text-sm text-gray-500 mt-2">
              Processing {totalPapers} paper(s) - {completedPapers} completed, {loadingPapers} in progress
            </p>
            {
              completedPapers!=totalPapers&&
              <Loader className="text-md text-gray-500 mt-2 animate-spin  "></Loader>
            }
          </div>
        </div>
        
        {/* Review Table */}
        <ReviewTable papers={papers} paperData={paperData} handleConsolidatedReview={handleConsolidatedReview} consolidatedReview={consolidatedReview} loadingConsolidated={loadingCosolidated} />
      
       {papers.length > 0 && (
         <div className="mt-8 flex justify-center animate-slide-up">
           <button
             onClick={handleDownloadRequest}
             disabled={!allComplete || isDownloading}
             className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
           >
             <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
             <div className="relative flex items-center gap-3">
               {isDownloading ? (
                   <>
                       <Loader className="w-5 h-5 animate-spin" />
                       <span>Generating...</span>
                   </>
               ) : (
                   <>
                       <Download className="w-5 h-5" />
                       <span>Download Review Docx</span>
                   </>
               )}
             </div>
           </button>
         </div>
       )}

        {/* Papers List */}
        <div className="space-y-8 mt-8">
          {papers.map((paper, index) => (
            <PaperCard
              key={index}
              paper={paper}
              index={index}
              onComplete={() => handlePaperComplete(index)}
              onError={() => handlePaperError(index)}
              updatePaperData={(data) => updatePaperData(index, data)}
            />
          ))}
        </div>
        
        {/* Completion Message */}
        {allComplete && !anyErrors && (
          <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-green-100">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">All Papers Processed Successfully!</h3>
            </div>
            <p className="text-gray-700">
              You can now download the complete literature review document.
            </p>
          </div>
        )}
        
        {/* Error Message */}
        {anyErrors && (
          <div className="mt-8 bg-red-50 rounded-xl p-6 border border-red-200 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-red-100">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-red-800">Some Papers Failed to Process</h3>
            </div>
            <p className="text-red-700 mb-4">
              {errorPapers} paper(s) failed to process completely. You can try refreshing the page to retry.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Failed Papers
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Page