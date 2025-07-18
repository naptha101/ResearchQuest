import { researchDesign } from "@/app/Services/Methodology"
import { DicesIcon, Loader } from "lucide-react"
import { useState } from "react"
import ResearchDesignDetails from "./ResearchDesignDetails "

const ResearchOverview = ({ data,idea,papers }) => {
  const { hypothesis, objective, scope } = data
  const [loading,setLoading]=useState(false)
  const [design,setDesign]=useState(null)
  const handleResearchDesign=async()=>{
setLoading(true)
    try{

    const response = await researchDesign({
    ...data,
    papers:papers,
    research_idea:idea,
    openapikey:process.env.NEXT_PUBLIC_OPEN_API_KEY
    })
    if(response.results){
        setDesign(response.results)

    }
 else{
       toast.error("Can't proceed with your request.")

 }

}
catch(err){
    console.log(err)
    toast.error("Error in procedding with your request.")


}
setLoading(false)

  }


  return (
    <section className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <h2 className="text-3xl font-bold text-center text-gray-800">
        📚 Research Summary
      </h2>

      <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-blue-700 mb-2">🧠 Hypothesis</h3>
          <p className="text-gray-800 leading-relaxed">{hypothesis}</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-green-700 mb-2">🎯 Objective</h3>
          <p className="text-gray-800 leading-relaxed">{objective}</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-purple-700 mb-2">📌 Scope</h3>
          <p className="text-gray-800 leading-relaxed">{scope}</p>
        </div>
      </div>

      <div className="w-full py-2 flex items-center justify-center">

<button onClick={()=>{handleResearchDesign()}} className="p-2 gap-2 rounded-xl bg-gradient-to-l flex items-center from-yellow-400 to-yellow-500 text-xl text-white"> 
    Research Design Mapping  
    {
    !loading?(
    <DicesIcon className="h-10 w-10 text-white"></DicesIcon>):
    (<Loader className="h-10 w-10 text-white animate-spin"></Loader>)
    }
</button>

      </div>

      {
        !loading&&design&&<ResearchDesignDetails
        data={design}
        hypothesis={data}
         idea={idea}
         
        ></ResearchDesignDetails>
      }
    </section>
  )
}

export default ResearchOverview
