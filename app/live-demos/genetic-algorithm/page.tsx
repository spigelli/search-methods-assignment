'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GeneticOptionsForm } from "./GeneticOptionsForm";
import { FitnessChart } from "./FitnessChart";
import { z } from "zod";

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
  // const [response, setResponse] = useState<string | null>(null);
  const [data, setData] = useState<z.infer<typeof dataSchema> | undefined>(undefined);

  return (
    <section dir="ltr" className="container h-full py-6">
      <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_300px]">
        <div className="hidden flex-col space-y-4 sm:flex md:order-2">
          <GeneticOptionsForm
            runAlgorithmAction={async (formData: any) => {
              const urlParams = {
                'initial-population-size': formData.get('initialPopulationSize'),
                'min-generations': formData.get('minGenerations'),
                'gmin-fitness-improvement-ratio': formData.get('fitnessImprovementRatio'),
                'mutation-probability': formData.get('mutationProbability'),
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
              <CardTitle>Response</CardTitle>
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
    // <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
    //   <div className="flex flex-col items-start gap-4">
    //     <GeneticOptionsForm />

    //     <form
    //       className="flex flex-col justify-center rounded-lg space-y-4 w-full"
    //       action={async (formData: FormData) => {
    //         const response = await fetch("/api/genetic-algorithm", {
    //           method: "GET",
    //           headers: {
    //             "Content-Type": "application/json",
    //           },
    //         });
    //         const text = await response.text();
    //         setResponse(text);
    //       }}
    //     >
    //       <button
    //         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    //         type="submit"
    //       >
    //         Test
    //       </button>
    //     </form>

    //     <Card className="w-full">
    //       <CardHeader>
    //         <CardTitle>Response</CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         <pre>{response}</pre>
    //       </CardContent>
    //     </Card>
    //   </div>
    // </section>
  );
}