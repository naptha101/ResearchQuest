import { getValidationSummary } from '@/app/Services/Methodology';
import { ArrowUpRight, Database, FlaskConical, TestTube, Layers, BarChart, Loader } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Summary from './SummaryShow';

// This is the main component. You can rename it as you see fit.
// It takes the research data as a prop.
export default function StatTool({researchData,hypothesis,idea,overview}) {
   

const [loading,setLoading]=useState(false)
 const [summary,setSummary]=useState(null)
    // Reusable Card component for section containers
    const SectionCard = ({ title, icon, children }) => (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
            <div className="p-6 flex items-center space-x-4 bg-slate-50/70 border-b border-slate-200/80">
                {icon}
                <h3 className="text-xl font-semibold text-slate-800 tracking-wider">{title}</h3>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    );

    // Reusable Pill component for list items
    const Pill = ({ text, color = 'sky' }) => {
        const colorClasses = {
            sky: 'bg-sky-100 text-sky-800 border-sky-200/80',
            amber: 'bg-amber-100 text-amber-800 border-amber-200/80',
            rose: 'bg-rose-100 text-rose-800 border-rose-200/80',
        };
        return (
            <span className={`inline-block text-sm font-medium px-4 py-2 rounded-full border ${colorClasses[color]}`}>
                {text}
            </span>
        );
    };


    const handleValidationSummary=async()=>{
        setLoading(true)
        try{
  const response=await getValidationSummary({
    ...hypothesis,
    statistical_tools:researchData.statistical_tools,
    research_idea:idea,
    research_type:overview.research_type,
    target_population:overview.study_design.target_population,
    openapikey:process.env.NEXT_PUBLIC_OPEN_API_KEY

  })

if(response.results){
    setSummary(response.results)
}else{
    toast.error("Error in processing request.")
}

        }
        catch(err){
console.log(err)
toast.error("Error in Generating Error.")
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-slate-100 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Research Statistic Tools</h1>
                    <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">A detailed breakdown of the methods, tools, and data sources for this study.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Data Platforms Section */}
                        <SectionCard title="Data Source Platforms" icon={<Database className="h-7 w-7 text-teal-600" />}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {researchData.data_platforms.map((platform) => (
                                    <a
                                        key={platform.name}
                                        href={platform.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group bg-white p-4 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-teal-500 transition-all duration-300"
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-slate-700">{platform.name}</span>
                                            <ArrowUpRight className="h-5 w-5 text-slate-400 group-hover:text-teal-600 transition-colors duration-300" />
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </SectionCard>

                        {/* Pilot Study Section */}
                        {researchData.pilot_study_required === "Yes" && (
                             <SectionCard title="Pilot Study Details" icon={<TestTube className="h-7 w-7 text-violet-600" />}>
                                <div className="space-y-6">
                                    {researchData.pilot_study_details.map((study, index) => (
                                        <div key={index} className="bg-slate-50/70 p-5 rounded-lg border border-slate-200/80">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="font-semibold text-lg text-violet-800">{study.method_or_tool}</h4>
                                                <span className="text-xs font-mono bg-violet-100 text-violet-700 px-2 py-1 rounded border border-violet-200/80">{study.type}</span>
                                            </div>
                                            <p className="text-slate-600 text-sm leading-relaxed">{study.purpose}</p>
                                        </div>
                                    ))}
                                </div>
                            </SectionCard>
                        )}
                    </div>
                    
                    {/* Sidebar Column */}
                    <div className="space-y-8">
                        {/* Research Methods Section */}
                        <SectionCard title="Research Methods" icon={<FlaskConical className="h-7 w-7 text-amber-600" />}>
                            <div className="flex flex-wrap gap-3">
                                {researchData.methods.map((method) => <Pill key={method} text={method} color="amber"/>)}
                            </div>
                        </SectionCard>

                        {/* Sampling Method Section */}
                        <SectionCard title="Sampling Method" icon={<Layers className="h-7 w-7 text-rose-600" />}>
                            <Pill text={researchData.sampling_method} color="rose" />
                        </SectionCard>

                        {/* Statistical Tools Section */}
                        <SectionCard title="Statistical Tools" icon={<BarChart className="h-7 w-7 text-sky-600" />}>
                            <div className="flex flex-wrap gap-3">
                                {researchData.statistical_tools.map((tool) => <Pill key={tool} text={tool} color="sky"/>)}
                            </div>
                        </SectionCard>
                    </div>
                </div>

                <footer className="text-center flex mt-16 pb-4">
                <button onClick={()=>{handleValidationSummary()}} className='bg-amber-300 font-bold px-4 py-2 rounded-xl hover:scale-105 shadow-2xl shadow-gray-200'>
                Generate Summary
                </button>
                {
                    loading&&
                    <Loader className='h-8 m-2 w-8 animate-spin '>

                    </Loader>
                }

                </footer>


            </div>
          {summary&&!loading&&
            <Summary analysisData={summary} researchData={researchData} hypothesis={hypothesis} idea={idea} overview={overview}   ></Summary>}
        </div>
    );
}
