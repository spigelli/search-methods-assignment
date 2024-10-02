'use client';

import { Fragment, useState } from "react";
import { PopulateForm } from "./PopulateForm";
import { SearchForm } from "./SearchForm";
import { getGraphData, GraphData } from "./actions";
import { GraphCard } from "./GraphCard";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select";

export function Playground() {
  const [graphData, setGraphData] = useState<GraphData | null>(null);

  return (
    <div className="relative h-full w-full">
      <div className="absolute top-[65px] left-0 p-4 z-10">
        <Card className="w-[350px] dark:bg-slate-400/5 bg-slate-50/5 backdrop-blur-[3px] shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle>Configure search graph</CardTitle>
            <CardDescription>Edit start and end towns and routing algorithm.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <PopulateForm
              action={
                async () => {
                  const newGraphData = await getGraphData();
                  setGraphData(newGraphData);
                }
              }
            />
            <SearchForm />
          </CardContent>
        </Card>
      </div>
      <div className="absolute z-0 left-0 h-full w-screen">
        <GraphCard graphData={graphData} />
      </div>
    </div>
  );
}
