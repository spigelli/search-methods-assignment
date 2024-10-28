'use client';

import { useState } from "react";
import { GeneticOptionsForm } from "./GeneticOptionsForm";
import { FitnessChart } from "./FitnessChart";
import { z } from "zod";
import { ScheduleTable } from "./ScheduleTable";
import { Card, CardContent } from "@/components/ui/card";

export const geneticAlgorithmDataSchema = z.object({
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
  const [data, setData] = useState<z.infer<typeof geneticAlgorithmDataSchema> | undefined>(undefined);

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
                'initial-population-size': `${initialPopulationSize[0]}`,
                'min-generations': `${minGenerations[0]}`,
                'fitness-improvement-ratio': `${fitnessImprovementRatio[0]}`,
                'mutation-probability': `${mutationProbability[0]}`,
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
              const data = geneticAlgorithmDataSchema.parse(json);
              setData(data);
            }}
          />
        </div>
        <div className="md:order-1">
          {data === undefined ? (
            <Card className="size-full">
            {/* Centered "Run to display" message */}
            <CardContent className="flex h-full items-center justify-center">
              Run the genetic algorithm to display the results.
            </CardContent>
          </Card>
          ) : (
            <div className="flex flex-col gap-6 pb-6">
              <FitnessChart
                data={data.average_fitness_by_generation}
              />
              <ScheduleTable
                schedule={data.ending_schedule}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}