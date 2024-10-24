'use client';

import { z, ZodNumber } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useMemo } from "react";

function formTooSmallMessage(minimum: number): string | undefined {
  return `Initial population size must be at least ${minimum}.`;
}

function formTooLargeMessage(maximum: number): string | undefined {
  return `Initial population size must be at most ${maximum}.`;
}

const fieldConfigs = [
  {
    name: "initialPopulationSize" as const,
    label: (value: number) => `Initial Population Size - ${value}`,
    description: "The starting number of random schedules included in the first generation's population.",
    step: 1,
    isInt: true,
    bounds: {
      min: 10,
      max: 9999,
    }
  },
  {
    name: "minGenerations" as const,
    label: (value: number) => `Minimum Generations - ${value}`,
    description: "The minimum number of generations to run the genetic algorithm.",
    bounds: {
      min: 1,
      max: 1000,
    },
    step: 1,
    isInt: true,
  },
  {
    name: "fitnessImprovementRatio" as const,
    label: (value: number) => `Fitness Improvement Ratio - ${(value * 100 + 100).toFixed(3)}%`,
    description: "The percentage improvement under which the genetic algorithm will stop after running the minimum number of generations.",
    bounds: {
      min: 0,
      max: 0.05,
    },
    step: 0.001,
    isInt: false,
  },
  {
    name: "mutationProbability" as const,
    label: (value: number) => `Mutation Probability - ${(value * 100).toFixed(3)}%`,
    description: "The probability that a mutation will occur in a given generation.",
    bounds: {
      min: 0,
      max: 0.1,
    },
    step: 0.001,
    isInt: false,
  },
];

const formSchema = z.object(
  Object.fromEntries(
    fieldConfigs.map((fieldConfig) => {
      const { name, bounds, isInt } = fieldConfig;
      let v: ZodNumber = z
        .number()
        .min(bounds.min, { message: formTooSmallMessage(bounds.min) })
        .max(bounds.max, { message: formTooLargeMessage(bounds.max) });
      if (isInt) {
        v = v.int();
      }
      return [name, v];
    })
  )
);

export function GeneticOptionsForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initialPopulationSize: 100,
      minGenerations: 100,
      fitnessImprovementRatio: 0.01,
      mutationProbability: 0.05,
    },
  });

  const formFields = useMemo(() => {
    const fields = fieldConfigs.map((fieldConfig) => {
      const { name, label, description, bounds, step } = fieldConfig;
      return (
        <FormField
          control={form.control}
          key={name}
          name={name}
          render={({ field: { value, onChange } }) => (
            <FormItem>
              <FormLabel>{label(value)}</FormLabel>
              <FormControl>
                <Slider
                  min={bounds.min}
                  max={bounds.max}
                  step={step}
                  defaultValue={[value]}
                  onValueChange={onChange}
                />
              </FormControl>
              <FormDescription>{description}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    });
    return fields;
  }, [form]);

  return (
    <Form {...form}>
      <form
        onSubmit={() => {
          alert(form.getValues().initialPopulationSize);
        }}
        className="space-y-8"
      >
        {formFields}
        <Button type="submit">Submit</Button>
      </form>
    </Form>

  );
}

