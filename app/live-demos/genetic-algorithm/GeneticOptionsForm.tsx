'use client';

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const populationBounds = {
  min: 10,
  max: 9999,
};

const minGenerationsBounds = {
  min: 1,
  max: 1000,
};

const formSchema = z.object({
  initialPopulationSize: z
    .number()
    .int()
    .min(populationBounds.min, {
      'message': 'Initial population size must be at least 10.',
    })
    .max(populationBounds.max, {
      message: 'Initial population size must be less than 10,000.',
    }),
  
});

export function GeneticOptionsForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initialPopulationSize: 100,
    },
  });
  return (
    <Form {...form}>
      <form
        onSubmit={() => {
          alert(form.getValues().initialPopulationSize);
        }}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="initialPopulationSize"
          render={({ field: { value, onChange } }) => (
            <FormItem>
              <FormLabel>Initial Population Size - {value}</FormLabel>
              <FormControl>
                <Slider
                  min={populationBounds.min}
                  max={populationBounds.max}
                  step={1}
                  defaultValue={[value]}
                  onValueChange={onChange}
                />
              </FormControl>
              <FormDescription>
                The starting number of random schedules included in the first generation&apos;s population.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>

  );
}