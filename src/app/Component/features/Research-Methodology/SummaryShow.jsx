import { CheckCircle, Target, ListChecks, SlidersHorizontal, Lightbulb } from 'lucide-react';
import React from 'react';
import FlowChart from './FlowChart';

// This is the main component for displaying analysis and conclusion data.
// You can rename it as you see fit.
export default function Summary({analysisData,researchData,hypothesis,idea,overview}) {
  
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

    // Reusable List Item component
    const ListItem = ({ text }) => (
        <li className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
            <span className="text-slate-600">{text}</span>
        </li>
    );

    return (
        <div className="min-h-screen bg-slate-100 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Hypothesis Study & Conclusion</h1>
                    <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">A summary of the study's data analysis, validation, estimated results, and final conclusions.</p>
                </header>

                <div className="space-y-8">

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <SectionCard title="Data Analysis Methods" icon={<SlidersHorizontal className="h-7 w-7 text-purple-600" />}>
                            <ul className="space-y-4">
                                {analysisData.data_analysis_method.map((method, index) => (
                                    <ListItem key={index} text={method} />
                                ))}
                            </ul>
                        </SectionCard>
                        <SectionCard title="Data Validation Approaches" icon={<ListChecks className="h-7 w-7 text-cyan-600" />}>
                            <ul className="space-y-4">
                                {analysisData.data_validation_approaches.map((approach, index) => (
                                    <ListItem key={index} text={approach} />
                                ))}
                            </ul>
                        </SectionCard>
                    </div>
                    {/* Conclusion and Estimated Results */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <SectionCard title="Estimated Results" icon={<Lightbulb className="h-7 w-7 text-amber-600" />}>
                             <p className="text-slate-600 leading-relaxed">{analysisData.estimated_results}</p>
                        </SectionCard>
                        <SectionCard title="Conclusion & Hypothesis" icon={<Target className="h-7 w-7 text-blue-600" />}>
                            <p className="text-slate-600 leading-relaxed">{analysisData.conclusion_and_hypothesis_summary}</p>
                        </SectionCard>
                        
                    </div>

                    {/* Data Analysis and Validation */}
                
                </div>

                <footer className="text-center mt-16 pb-4">
                    <p className="text-sm text-slate-500">Generated on {new Date().toLocaleDateString()}</p>
                </footer>

            </div>

<FlowChart overview={overview} hypothesis={hypothesis} researchData={researchData} idea={idea} summary={analysisData}></FlowChart>
        </div>
    );
}
