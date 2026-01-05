import React, { createContext, useContext, useState } from "react";

const DashboardRefreshContext = createContext();

export const DashboardRefreshProvider = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerDashboardRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <DashboardRefreshContext.Provider
      value={{ refreshKey, triggerDashboardRefresh }}
    >
      {children}
    </DashboardRefreshContext.Provider>
  );
};

export const useDashboardRefresh = () => useContext(DashboardRefreshContext);
