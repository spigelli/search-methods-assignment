'use client'

import { ReactFlowProvider } from '@xyflow/react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { GraphCard } from './GraphCard'
import { PopulateForm } from './PopulateForm'
import { SearchForm } from './SearchForm'
import { CustomControls } from './CustomControls';
import { SearchProvider } from './SearchProvider';
import { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';

export function Playground() {
  const [hasPopulated, setHasPopulated] = useState(false)

  return (
    <ReactFlowProvider>
      <SearchProvider>
        <div className="relative size-full">
          <div className="pointer-events-none absolute left-0 top-[64px] z-10 h-[calc(100vh_-_65px)] w-full">
            <div className="relative size-full">
              <Card className="pointer-events-auto absolute left-4 top-4 w-[350px] bg-slate-50/5 shadow-2xl shadow-slate-400 backdrop-blur-[3px] dark:bg-slate-400/5 dark:shadow-black">
                <CardHeader className="pb-4">
                  <CardTitle>Configure search graph</CardTitle>
                  <CardDescription>
                    Edit start and end towns and routing algorithm.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <PopulateForm setHasPopulated={setHasPopulated} />
                  <SearchForm hasPopulated={hasPopulated} />
                </CardContent>
              </Card>
              <div className="absolute bottom-4 left-4">
                <CustomControls />
              </div>
              <div className="absolute bottom-4 right-4">
                <Toaster />
              </div>
            </div>
          </div>
          <div className="absolute left-0 z-0 h-full w-screen">
            <GraphCard />
          </div>
        </div>
      </SearchProvider>
    </ReactFlowProvider>
  )
}
