'use client'; // Required for Client Components

import { createContext, useContext, useState } from 'react';

const TitleContext = createContext();

export const TitleProvider = ({ children }) => {
  const [papers, setPapers] = useState(null);


  return (
    <TitleContext.Provider value={{ papers,setPapers }}>
      {children}
    </TitleContext.Provider>
  );
};

// Hook to use context
export const useTitle = () => useContext(TitleContext);
