import { createContext, use, useContext } from "react";
import { SearchMethodId } from "./util";

type SearchingState = {
}

type SearchConfig = {
  startTown: string | undefined;
  endTown: string | undefined;
  searchMethod: SearchMethodId | undefined;
} & (
  | ( { isSearching: true } & SearchingState )
  | ( { isSearching: false } )
);

const SearchContext = createContext<SearchConfig>({
  startTown: undefined,
  endTown: undefined,
  searchMethod: undefined,
  isSearching: false,
});

export function SearchProvider({ children }: { children: React.ReactNode }) {
  return (
    <SearchContext.Provider value={{ startTown: undefined, endTown: undefined, searchMethod: undefined, isSearching: false }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}

