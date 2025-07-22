import React, { useState } from 'react';
import { Users, Database, Target, Lightbulb, BarChart3, MessageSquare, GitBranch, Loader } from 'lucide-react';
import { statsToolsSuggestions } from '@/app/Services/Methodology';
import StatTool from './StatsTools';

const ResearchDesignDetails = ({data,hypothesis,idea}) => {

    const [loading,setLoading]=useState(false);
   const [statsMethods,setStatsMethods]=useState(null)
  const getResearchTypeColor = (type) => {

    if(type.toLowerCase()===data.research_type.toLowerCase()){
                return 'bg-gradient-to-r from-slate-600 to-slate-700';

    }
    switch (type.toLowerCase()) {
      case 'mixed':
        return 'bg-gradient-to-r from-slate-200 to-slate-200';
      case 'qualitative':
        return 'bg-gradient-to-r from-slate-200 to-slate-200';
      case 'quantitative':
        return 'bg-gradient-to-r from-slate-200 to-slate-200';
      default:
        return 'bg-gradient-to-r from-slate-200 to-slate-200';
    }
  };

  const getResearchTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'mixed':
        return <GitBranch className="w-5 h-5" />;
      case 'qualitative':
        return <MessageSquare className="w-5 h-5" />;
      case 'quantitative':
        return <BarChart3 className="w-5 h-5" />;
      default:
        return <Lightbulb className="w-5 h-5" />;
    }
  };

  const getTools=async()=>{
setLoading(true);
    try{

    const response = await statsToolsSuggestions({
        ...hypothesis,
        data_source:data.study_design.data_source,
        target_population:data.study_design.target_population,
        research_type:data.research_type,
        openapikey:process.env.NEXT_PUBLIC_OPEN_API_KEY

    });
if(response.results){

    setStatsMethods(response.results);
}else{
        toast.error("Can't proceed with your request.")

}


}
catch(err){
    console.log(err);
    toast.error("Error in Getting Stats Tool suggestion.")
}
setLoading(false);
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-8 py-6 shadow-lg">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Lightbulb className="w-8 h-8" />
                Research Type
          </h1>
        </div>

        {/* Research Type Badge */}
        <div className="px-8 py-6 border-b border-slate-200/50 bg-slate-50/50">
          <div className="flex items-center gap-4">
            {
                ["Qualitative","Quantative","Mixed"].map((type)=>{

                    return (
                            <div className={`${getResearchTypeColor(type)} text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg`}>
              {getResearchTypeIcon(type)}
              <span className="font-semibold text-lg">{type} Method</span>
            </div>

                    )
                })
        
}
            {/* <div className="text-sm text-slate-600 bg-slate-200/50 px-4 py-2 rounded-full">
              Research Methodology
            </div> */}
          </div>
        </div>

        {/* Justification */}
        <div className="px-8 py-6 border-b border-slate-200/50">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-slate-600" />
            Research Type Justification
          </h2>
          <div className="bg-gradient-to-r from-slate-50/80 to-slate-100/80 p-6 rounded-xl border-l-4 border-slate-400 shadow-sm">
            <p className="text-slate-700 leading-relaxed">{data.justification}</p>
          </div>
        </div>

        {/* Study Design */}
        <div className="px-8 py-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <Database className="w-5 h-5 text-slate-600" />
            Research Design
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Data Source */}
            <div className="bg-gradient-to-br col-span-2 from-slate-50/60 to-slate-100/60 p-6 rounded-xl border border-slate-200/60 shadow-sm">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Database className="w-4 h-4 text-slate-600" />
Type of Study 
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">

                  <span className="bg-slate-200/70 text-xl text-slate-800 px-3 py-1 rounded-full  font-medium">
                    {data.study_design.data_source.type.toLowerCase()==="secondary"?"Secondary":"Primary"}
                  </span>
                </div>
                <div>
                  <span className="text-md font-medium text-slate-800 block mb-2">Methods:</span>
                  <div className="flex flex-wrap gap-2">
                    {data.study_design.data_source.method_or_source.map((method, index) => (
                      <span key={index} className="bg-white/90 border border-slate-200/70 text-slate-700 px-3 py-1 rounded-lg text-sm shadow-sm">
                        {method}
                      </span>
                    ))}
                  </div>

                 < h3 className="font-semibold mt-3 text-slate-800 mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-slate-600" />
                Target Population
              </h3>
              {/* <p className="text-slate-700 text-sm leading-relaxed">
                {data.study_design.target_population}
              </p> */}
               <div className="flex flex-wrap gap-2">
                    {data.study_design.target_population.map((method, index) => (
                      <span key={index} className="bg-white/90 border border-slate-200/70 text-slate-700 px-3 py-1 rounded-lg text-sm shadow-sm">
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Target Population */}
          
          </div>

          {/* Stakeholders and Tools */}
          <div className="mt-8">
            <h3 className="font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-600" />
              Stakeholders & Technologies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.study_design.stakeholders_and_tools.map((item, index) => (
                <div key={index} className="bg-gradient-to-r from-slate-50/70 to-slate-100/70 p-5 rounded-xl border border-slate-200/60 hover:shadow-md transition-all hover:bg-slate-50/80">
                  <div className="flex items-start gap-3">
                    <div className="bg-slate-200/60 p-2 rounded-lg">
                      <Users className="w-4 h-4 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-800 mb-2">{item.stakeholder}</h4>
                      <p className="text-sm text-slate-600 bg-white/80 px-3 py-2 rounded-lg border border-slate-200/50 shadow-sm">
                        {item.tool_or_technology}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


<div className=' w-full py-3 my-5 flex justify-center items-start '>
<button onClick={()=>getTools()} className=' px-2 py-1 gap-2 shadow-gray-500 shadow-md
 rounded-xl flex item-center justify-center bg-gradient-r from-white to-gray-50 text-black border-2 hover:scale-105 border-black '>
  <span>  Get Stats Tools Suggestions</span>
{loading&&<span><Loader className='h-8 w-8 animate-spin'></Loader></span>}
</button>
</div>

{
    !loading&&statsMethods&&<StatTool
    researchData={statsMethods}
    idea={idea}
    hypothesis={hypothesis}
    overview={data}
   
    ></StatTool>
}



    </div>
  );
};

export default ResearchDesignDetails;