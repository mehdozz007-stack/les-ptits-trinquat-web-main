import React, { createContext, useCallback, useState } from 'react';

interface TombolaRefreshContextType {
    refreshKey: number;
    triggerRefresh: () => void;
}

export const TombolaRefreshContext = createContext<TombolaRefreshContextType | undefined>(undefined);

interface TombolaRefreshProviderProps {
    children: React.ReactNode;
}

export function TombolaRefreshProvider({ children }: TombolaRefreshProviderProps) {
    const [refreshKey, setRefreshKey] = useState(0);

    const triggerRefresh = useCallback(() => {
        console.log('🔄 Global refresh triggered');
        setRefreshKey(prev => prev + 1);
    }, []);

    return (
        <TombolaRefreshContext.Provider value={{ refreshKey, triggerRefresh }}>
            {children}
        </TombolaRefreshContext.Provider>
    );
}

export function useGlobalRefresh() {
    const context = React.useContext(TombolaRefreshContext);
    if (!context) {
        throw new Error('useGlobalRefresh must be used within TombolaRefreshProvider');
    }
    return context;
}
