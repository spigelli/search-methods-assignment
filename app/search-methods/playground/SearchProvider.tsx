import { createContext, Dispatch, SetStateAction, use, useContext, useState } from "react";
import { SearchMethodId } from "./util";

type SearchingState = {
}


const SearchContext = createContext<{
  startTown: string | undefined;
  setStartTown: Dispatch<SetStateAction<string | undefined>>;
  endTown: string | undefined;
  setEndTown: Dispatch<SetStateAction<string | undefined>>;
  searchMethod: SearchMethodId | undefined;
  setSearchMethod: Dispatch<SetStateAction<SearchMethodId | undefined>>;
  isSearching: boolean;
  setIsSearching: Dispatch<SetStateAction<boolean>>;
} | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [startTown, setStartTown] = useState<string | undefined>(undefined);
  const [endTown, setEndTown] = useState<string | undefined>(undefined);
  const [searchMethod, setSearchMethod] = useState<SearchMethodId | undefined>(undefined);
  const [isSearching, setIsSearching] = useState(false);

  const value = {
    startTown,
    setStartTown,
    endTown,
    setEndTown,
    searchMethod,
    setSearchMethod,
    isSearching,
    setIsSearching,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}

