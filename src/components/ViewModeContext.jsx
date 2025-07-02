import { createContext, useContext, useState } from "react";

const ViewModeContext = createContext();

export const ViewModeProvider = ({ children }) => {
    const [isMobileView, setIsMobileView] = useState(false);

    const toggleViewMode = () => setIsMobileView((prev) => !prev);

    return (
        <ViewModeContext.Provider value={{ isMobileView, toggleViewMode }}>
            {children}
        </ViewModeContext.Provider>
    );
};

export const useViewMode = () => useContext(ViewModeContext);