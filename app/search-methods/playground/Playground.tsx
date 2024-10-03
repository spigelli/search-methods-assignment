'use client';

import { PopulateForm } from "./PopulateForm";
import { SearchForm } from "./SearchForm";
import { GraphCard } from "./GraphCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactFlowProvider } from "@xyflow/react";

export function Playground() {
  return (
    <ReactFlowProvider>
      <div className="relative size-full">
        <div className="absolute left-0 top-[65px] z-10 p-4">
          <Card className="w-[350px] bg-slate-50/5 shadow-2xl backdrop-blur-[3px] dark:bg-slate-400/5">
            <CardHeader className="pb-4">
              <CardTitle>Configure search graph</CardTitle>
              <CardDescription>Edit start and end towns and routing algorithm.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <PopulateForm />
              <SearchForm />
            </CardContent>
          </Card>
        </div>
        <div className="absolute left-0 z-0 h-full w-screen">
          <GraphCard />
        </div>
      </div>
    </ReactFlowProvider>
  );
}
