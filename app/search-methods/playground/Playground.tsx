'use client';

import { Fragment } from "react";
import { PopulateForm } from "./PopulateForm";
import { SearchForm } from "./SearchForm";
import { getCityTree } from "./actions";

export function Playground() {
  return (
    <Fragment>
      <div className="flex w-full flex-col gap-6 md:w-1/3">
        <PopulateForm
          action={
            async () => {
              await getCityTree();
              console.log('Populate Tree');
            }
          }
        />
        <SearchForm />
      </div>
      <div className="relative mt-4 flex h-full min-h-[50vh] flex-1 flex-col rounded-xl bg-muted/50 p-4 md:mt-0">
        <div className="mb-2 text-lg font-semibold">Search Results</div>
        <div className="flex-1 overflow-auto rounded-md border bg-background p-4">
          <p className="text-muted-foreground">Run a search to see the results...</p>
        </div>
      </div>
    </Fragment>
  );
}
