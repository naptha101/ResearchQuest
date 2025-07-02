import { Clock, FileText, BarChart2, DollarSign, Hash } from 'lucide-react';

export default function ResearchResults({ data }) {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-3xl shadow-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl mb-4 shadow-md">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-orange-800 mb-2">Research Results</h1>
        <p className="text-orange-600">Generated with AI-powered analysis</p>
      </div>

      {/* Stats Bar */}
      <div className="bg-white rounded-xl p-4 mb-8 grid grid-cols-3 gap-4 shadow-sm">
    
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-lg">
            <Hash className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <div className="text-sm text-orange-600">Papers Generated</div>
            <div className="font-medium text-orange-800">{data.results.length}</div>
          </div>
        </div>
  
      </div>

      {/* Results List */}
      <div className="space-y-6">
        {data.results.map((result) => (
          <div key={result.paper_no} className="bg-white border border-orange-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-orange-800 font-bold">
                {result.paper_no}
              </div>
              <div>
                <h3 className="text-xl font-bold text-orange-800 mb-2">{result.title}</h3>
                <p className="text-orange-700/90">{result.title_explanation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-orange-800 mb-4 flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-amber-600" />
          Token Usage Details
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-orange-600 mb-1">Input Tokens</div>
            <div className="font-medium text-orange-800">{data.token_usage.input_tokens}</div>
          </div>
          <div>
            <div className="text-sm text-orange-600 mb-1">Output Tokens</div>
            <div className="font-medium text-orange-800">{data.token_usage.output_tokens}</div>
          </div>
          <div>
            <div className="text-sm text-orange-600 mb-1">Input Cost</div>
            <div className="font-medium text-orange-800">{data.token_usage.input_cost}</div>
          </div>
          <div>
            <div className="text-sm text-orange-600 mb-1">Output Cost</div>
            <div className="font-medium text-orange-800">{data.token_usage.output_cost}</div>
          </div>
        </div>
      </div> */}

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-orange-600/70">
        <p>ResearchQuest • AI-Powered Research Assistant</p>
      </div>
    </div>
  );
}