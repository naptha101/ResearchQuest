import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ steps, currentStep, progressMessages }) => {
  const [showProgress, setShowProgress] = useState(false);
  
  useEffect(() => {
    if (currentStep > 0) {
      setShowProgress(true);
    }
    if (currentStep === steps.length) {
      const timer = setTimeout(() => {
        setShowProgress(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, steps.length]);

  if (!showProgress) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4 z-50"
    >
      <div className="bg-white rounded-xl shadow-xl p-6 border border-indigo-100">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-indigo-800 mb-2">
            Generating Literature Review...
          </h3>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
              initial={{ width: '0%' }}
              animate={{
                width: `${(currentStep / steps.length) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            {steps.map((step, index) => (
              <span 
                key={index}
                className={`${index <= currentStep - 1 ? 'text-indigo-600 font-medium' : ''}`}
              >
                {step}
              </span>
            ))}
          </div>
        </div>
        
        {progressMessages[currentStep - 1] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start p-3 bg-indigo-50 rounded-lg"
          >
            <div className="animate-pulse flex space-x-2">
              <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
              <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
              <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
            </div>
            <p className="ml-3 text-sm text-indigo-800">
              {progressMessages[currentStep - 1]}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
export default ProgressBar