// components/ProjectTimelineChart.js
import { Milestone, ChevronDown, ArrowRight, CheckCircle } from 'lucide-react';
import React from 'react';

// Helper component for each step in the flowchart
const FlowchartStep = ({ description, stepNumber }) => (
  <div className="flex flex-col items-center text-center">
    <div className="relative flex h-24 w-40 items-center justify-center rounded-lg border-2 border-gray-300 bg-white p-3 shadow-sm">
      <span className="absolute -top-3 rounded-full bg-indigo-500 px-2 py-0.5 text-xs font-semibold text-white">
        STEP {stepNumber}
      </span>
      <p className="text-sm text-gray-700">{description}</p>
    </div>
  </div>
);

// Helper component for the connector between steps
const HorizontalConnector = () => (
  <div className="flex flex-shrink-0 items-center justify-center w-12">
    <ArrowRight className="h-6 w-6 text-gray-400" />
  </div>
);

// Helper component for the connector between phases
const VerticalConnector = () => (
    <div className="flex h-16 w-full items-center justify-center">
        <ChevronDown className="h-8 w-8 text-gray-400" />
    </div>
);


// Main component to render the entire flowchart
const ProjectTimelineChart = ({ chartData }) => {
  if (!chartData || !chartData.Phases) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg bg-gray-100">
        <p className="text-gray-500">No chart data provided.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 font-sans">
      {/* Chart Title */}
      <div className="text-center mb-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">
          {chartData.Chart_Title}
        </h1>
        <p className="mt-3 text-lg text-gray-600">A hierarchical flowchart of the project plan.</p>
      </div>

      {/* Flowchart Container */}
      <div className="flex flex-col items-center">
        {chartData.Phases.map((phase, phaseIndex) => (
          <React.Fragment key={phase.Name}>
            {/* Phase Card */}
            <div className="z-10 flex items-center gap-x-4 rounded-xl bg-indigo-600 px-6 py-4 text-white shadow-lg">
              <Milestone className="h-8 w-8 flex-shrink-0" />
              <h3 className="text-xl font-bold">{phase.Name}</h3>
            </div>

            {/* Render steps only if they exist */}
            {phase.Steps && phase.Steps.length > 0 && (
              <>
                {/* Vertical connector from Phase to Steps */}
                <VerticalConnector />

                {/* Steps Container */}
                <div className="flex flex-wrap items-center justify-center gap-y-4">
                  {phase.Steps.map((step, stepIndex) => {
                    const stepKey = Object.keys(step)[0];
                    const stepNumber = stepKey.split('_')[1];
                    const stepDescription = step[stepKey];
                    return (
                      <React.Fragment key={stepKey}>
                        <FlowchartStep
                          stepNumber={stepNumber}
                          description={stepDescription}
                        />
                        {/* Horizontal connector between steps */}
                        {stepIndex < phase.Steps.length - 1 && (
                          <HorizontalConnector />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </>
            )}

            {/* Vertical connector between Phases */}
            {phaseIndex < chartData.Phases.length - 1 && (
                <VerticalConnector />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProjectTimelineChart;
