'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GeneticOptionsForm } from "./GeneticOptionsForm";

export default function GeneticAlgorithm() {
  const [response, setResponse] = useState<string | null>(null);

  return (
    <section dir="ltr" className="container h-full py-6">
      <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_300px]">
        <div className="hidden flex-col space-y-4 sm:flex md:order-2">
          {/* <Card className="size-full">
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <GeneticOptionsForm />
            </CardContent>
          </Card> */}
          <GeneticOptionsForm />
        </div>
        <div className="md:order-1">
          <Card className="size-full">
            <CardHeader>
              <CardTitle>Response</CardTitle>
            </CardHeader>
            <CardContent>
              <pre>{response}</pre>
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