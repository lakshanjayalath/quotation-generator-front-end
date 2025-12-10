// src/context/QuotationRefreshContext.jsx

import React, { createContext, useContext, useState, useCallback } from 'react';

// 1. Create the Context object
const QuotationRefreshContext = createContext();

// 2. Custom hook to easily consume the context
export const useQuotationRefresh = () => useContext(QuotationRefreshContext);

// 3. Provider component to wrap your application parts
export const QuotationRefreshProvider = ({ children }) => {
    // The state variable that acts as the refresh signal (key)
    const [quotationRefreshKey, setQuotationRefreshKey] = useState(0);

    // Function to increment the key, which forces any component watching it to re-run useEffect
    const triggerQuotationRefresh = useCallback(() => {
        // Increment the key by 1
        setQuotationRefreshKey(prevKey => prevKey + 1);
    }, []);

    // The value exposed to consumers
    const value = { 
        quotationRefreshKey, 
        triggerQuotationRefresh 
    };

    return (
        <QuotationRefreshContext.Provider value={value}>
            {children}
        </QuotationRefreshContext.Provider>
    );
};