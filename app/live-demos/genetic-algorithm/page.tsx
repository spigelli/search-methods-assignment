'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GeneticOptionsForm } from "./GeneticOptionsForm";
import { FitnessChart } from "./FitnessChart";
import { z } from "zod";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

const dataSchema = z.object({
  average_fitness_by_generation: z.array(z.number()),
  ending_schedule: z.array(z.object({
    activity: z.string(),
    enrollment: z.number(),
    facilitator: z.string(),
    room: z.string(),
    time: z.string(),
  })),
})

export default function GeneticAlgorithm() {
  const [data, setData] = useState<z.infer<typeof dataSchema> | undefined>(undefined);

  return (
    <section dir="ltr" className="container h-full py-6">
      <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_300px]">
        <div className="hidden flex-col space-y-4 sm:flex md:order-2">
          <GeneticOptionsForm
            onSubmit={async ({
              initialPopulationSize,
              minGenerations,
              fitnessImprovementRatio,
              mutationProbability,
            }) => {
              const urlParams = {
                'initial-population-size': `${initialPopulationSize}`,
                'min-generations': `${minGenerations}`,
                'fitness-improvement-ratio': `${fitnessImprovementRatio}`,
                'mutation-probability': `${mutationProbability}`,
              }

              const baseUrl = new URL("/api/genetic-algorithm", window.location.href);
              baseUrl.search = new URLSearchParams(urlParams).toString();
              const url = baseUrl.toString();

              const response = await fetch(url, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              });
              const json = await response.json();
              const data = dataSchema.parse(json);
              setData(data);
            }}
          />
        </div>
        <div className="md:order-1">
          <Card className="size-full">
            <CardHeader>
              <CardTitle>
                Response
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data !== undefined && (
                <FitnessChart
                  data={data.average_fitness_by_generation}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}