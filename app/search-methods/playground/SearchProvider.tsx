import { createContext, Dispatch, SetStateAction, use, useCallback, useContext, useState } from "react";
import { SearchMethodId } from "./util";
import { Edge, useEdgesState, useReactFlow, useUpdateNodeInternals } from "@xyflow/react";
import { CustomDefaultNode } from "./CustomDefaultNode";

type SearchContextType<T extends Edge> = {
  startTown: string | undefined;
  updateStartTown: (newStartTown: string | undefined) => void;
  endTown: string | undefined;
  updateEndTown: (newEndTown: string | undefined) => void;
  searchMethod: SearchMethodId | undefined;
  setSearchMethod: Dispatch<SetStateAction<SearchMethodId | undefined>>;
  isSearching: boolean;
  setIsSearching: Dispatch<SetStateAction<boolean>>;
  searchEdges: T[];
  setSearchEdges: Dispatch<SetStateAction<T[]>>;
};

const SearchContext = createContext<SearchContextType<Edge> | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [startTown, setStartTown] = useState<string | undefined>(undefined);
  const [endTown, setEndTown] = useState<string | undefined>(undefined);
  const [searchMethod, setSearchMethod] = useState<SearchMethodId | undefined>(undefined);
  const [isSearching, setIsSearching] = useState(false);
  const [searchEdges, setSearchEdges] = useEdgesState<Edge>([]);

  const { updateNodeData } = useReactFlow<CustomDefaultNode>();
  const updateNodeInternals = useUpdateNodeInternals();

  const updateStartTown = useCallback((newStartTown: string | undefined) => {
    if (startTown !== undefined) {
      updateNodeData(startTown, { isStart: false });
    }
    if (newStartTown !== undefined) {
      updateNodeData(newStartTown, { isStart: true });
    }
    setStartTown(newStartTown);
  }, [setStartTown, startTown, updateNodeData, updateNodeInternals]);

  const updateEndTown = useCallback((newEndTown: string | undefined) => {
    if (endTown !== undefined) {
      updateNodeData(endTown, { isEnd: false });
    }
    if (newEndTown !== undefined) {
      updateNodeData(newEndTown, { isEnd: true });
    }
    setEndTown(newEndTown);
  }, [setEndTown, endTown, updateNodeData, updateNodeInternals]);

  const value = {
    startTown,
    updateStartTown,
    endTown,
    updateEndTown,
    searchMethod,
    setSearchMethod,
    isSearching,
    setIsSearching,
    searchEdges,
    setSearchEdges,
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

