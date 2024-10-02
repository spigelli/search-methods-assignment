'use client';

import { Fragment, useState } from "react";
import { PopulateForm } from "./PopulateForm";
import { SearchForm } from "./SearchForm";
import { getGraphData, GraphData } from "./actions";
import { GraphCard } from "./GraphCard";

export function Playground() {
  const [graphData, setGraphData] = useState<GraphData | null>(null);

  return (
    <Fragment>
      <div className="flex w-full flex-col gap-6 md:w-1/3">
        <PopulateForm
          action={
            async () => {
              const newGraphData = await getGraphData();
              setGraphData(newGraphData);
            }
          }
        />
        <SearchForm />
      </div>
      <GraphCard graphData={graphData} />
    </Fragment>
  );
}
