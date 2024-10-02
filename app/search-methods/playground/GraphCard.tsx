import { GraphData } from './actions';

export function GraphCard({
  graphData
}: {
  graphData: GraphData | null;
}) {
  return (
  <div className="relative mt-4 flex h-full min-h-[50vh] flex-1 flex-col rounded-xl bg-muted/50 p-4 md:mt-0">
    <div className="mb-2 text-lg font-semibold">Search Results</div>
    <div className="flex-1 overflow-auto rounded-md border bg-background p-4">
      {graphData === null ? (
        <p className="text-muted-foreground">Run a search to see the results...</p>
      ) : (
        <div />
      )}
    </div>
  </div>
  );
}