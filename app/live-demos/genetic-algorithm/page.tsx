'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GeneticAlgorithm() {
  const [response, setResponse] = useState<string | null>(null);

  return (
    <div className="w-full max-w-4xl">
      <form
        className="min-h-[500px] p-4  flex flex-col justify-center  rounded-lg space-y-4"
        action={async (formData: FormData) => {
          const response = await fetch("/api/genetic-algorithm", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const text = await response.text();
          setResponse(text);
        }}
      >
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Test
        </button>
      </form>
      <Card>
        <CardHeader>
          <CardTitle>Response</CardTitle>
        </CardHeader>
        <CardContent>
          <pre>{response}</pre>
        </CardContent>
      </Card>
    </div>
  );
}