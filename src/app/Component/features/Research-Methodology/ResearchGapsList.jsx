'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp, ExternalLink, Loader } from 'lucide-react'
import { toast } from 'react-toastify'
import { researchScopeGeneration } from '@/app/Services/Methodology'
import ResearchOverview from './ResearchOverview'

const ResearchGapsList = ({ data,idea }) => {
  const [expanded, setExpanded] = useState(null)
  const [loading,setLoading]=useState(false)
  const [scope,setScope]=useState(null)
 const handleScopeGeneration=async()=>{
    setLoading(true)
    try{
        const response =await researchScopeGeneration({
            papers:data,
            openapikey:process.env.NEXT_PUBLIC_OPEN_API_KEY
        })
        //console.log(response)
     
  if(response.results){
    setScope(response.results)
toast.success("Scope Generated Successfully")  
}else{
    toast.error("Failed to generate scope")
}
        

    }
    catch(err){
        console.log(err);
        toast.error("Error generating scope.");
    }
    setLoading(false)
 }
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 text-center">Top 5 Literature Reviews based on your Keywords and Research Idea by reading 1 million+ Papers on Web and found Similarity.</h2>

      {data.map((item, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 shadow-xl rounded-2xl p-6 transition-all duration-300"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center text-sm text-blue-600 hover:underline"
              >
                View Full Paper <ExternalLink size={16} className="ml-1" />
              </a>
            </div>

            <button
              onClick={() => setExpanded(expanded === index ? null : index)}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              {expanded === index ? <ChevronUp /> : <ChevronDown />}
            </button>
          </div>

          {expanded === index && (
            <div className="mt-5 space-y-4">
              {item.research_gaps_and_resources.map((gapItem, idx) => (
                <div
                  key={idx}
                  className="border border-gray-100 rounded-xl p-4 bg-gray-50"
                >
                  <p className="font-semibold text-gray-700">
                    🔍 Gap {idx + 1}:
                    <span className="font-normal text-gray-600 ml-1">
                      {gapItem.gap}
                    </span>
                  </p>
                  <p className="mt-2 text-gray-700">
                    🛠️ <span className="font-medium text-gray-800">Suggested Resource:</span> {gapItem.resource}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}


      <div className='w-full py-2 flex items-center justify-center'>

        <button disabled={loading} onClick={()=>handleScopeGeneration()} className='p-2 flex items-center bg-gradient-to-bl from-yellow-400 to-yellow-500 text-white text-xl rounded-xl'>
           <span> {loading?"Generating":"Generate"} Scope Objectives</span>
           {loading&&<Loader className='h-10 w-20 text-white animate-spin'></Loader>}

        </button>
      </div>

      {!loading&&scope&&<ResearchOverview data={scope} idea={idea} papers={data}></ResearchOverview>
      }



    </div>
  )
}

export default ResearchGapsList
