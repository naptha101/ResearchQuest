"use client";
import { useState } from "react";
import { FileText, Hash, CheckCircle } from "lucide-react";

export default function ResearchResults({ data }) {
  const [selectedResult, setSelectedResult] = useState(null);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-200">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-md">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Research Results</h1>
        <p className="text-slate-500">Generated with AI-powered analysis</p>
      </div>

      {/* Stats Bar */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Hash className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="text-sm text-slate-500">Papers Generated</div>
            <div className="font-medium text-slate-800">{data.results.length}</div>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {data.results.map((result) => (
          <div
            key={result.paper_no}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300"
          >
            <div className="flex items-start gap-4 justify-between">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-700 font-bold">
                  {result.paper_no}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blue-800 mb-2">{result.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{result.title_explanation}</p>
                </div>
              </div>
              <button
                className={`px-4 py-2 text-sm rounded-md font-medium ${
                  selectedResult?.paper_no === result.paper_no
                    ? "bg-green-100 text-green-700 border border-green-400"
                    : "bg-blue-50 text-blue-600 border border-blue-300 hover:bg-blue-100"
                }`}
                onClick={() => setSelectedResult(result)}
              >
                {selectedResult?.paper_no === result.paper_no ? "Selected" : "Select"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Descriptive Selected Result */}
      {selectedResult && (
        <div className="mt-10 p-6 border border-green-300 rounded-xl bg-green-50 shadow-inner">
          <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5" /> Finalized Research Title
          </h3>
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-700 font-bold">
              {selectedResult.paper_no}
            </div>
            <div>
              <h4 className="text-md font-bold text-green-800">{selectedResult.title}</h4>
              <p className="text-green-700 mt-1">{selectedResult.title_explanation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-slate-500">
        <p>ResearchQuest • AI-Powered Research Assistant</p>
      </div>
    </div>
  );
}
