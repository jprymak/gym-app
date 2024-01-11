"use client";
import { createContext, useContext, useState } from "react";

type GlobalContextType = {
  isMobileNavOpen: boolean;
  toggleOpenMobileNav: () => void;
};

export const GlobalContext = createContext<GlobalContextType | null>(null);

export const ContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const toggleOpenMobileNav = () => {
    setIsMobileNavOpen((prev) => !prev);
  };

  return (
    <GlobalContext.Provider value={{ isMobileNavOpen, toggleOpenMobileNav }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error(
      "useGlobalContext must be used inside the GlobalContextProvider"
    );
  }

  return context;
};
