// src/context/ClientRefreshContext.jsx

import React, { createContext, useState, useContext } from 'react';

// 1. Create the Context
const ClientRefreshContext = createContext();

// 2. Create the Provider Component
export const ClientRefreshProvider = ({ children }) => {
    // This state is the key that forces components to re-fetch data
    const [clientRefreshKey, setClientRefreshKey] = useState(0);

    // This function is called when a client is successfully added
    const triggerClientRefresh = () => {
        setClientRefreshKey(prevKey => prevKey + 1);
        console.log('Client refresh triggered:', clientRefreshKey + 1);
    };

    return (
        <ClientRefreshContext.Provider value={{ clientRefreshKey, triggerClientRefresh }}>
            {children}
        </ClientRefreshContext.Provider>
    );
};

// 3. Custom Hook for easy consumption
export const useClientRefresh = () => {
    return useContext(ClientRefreshContext);
};