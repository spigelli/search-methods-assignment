import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useReactFlow } from "@xyflow/react";
import { use, useCallback } from "react";

export function CustomControls() {
  const {
    zoomIn,
    zoomOut,
    fitView,
  } = useReactFlow()

  const handleZoomIn = useCallback(() => { zoomIn() }, [zoomIn])
  const handleZoomOut = useCallback(() => { zoomOut() }, [zoomOut])
  const handleFitView = useCallback(() => { fitView() }, [fitView])

  return (
    <ButtonGroup orientation="horizontal" className="pointer-events-auto overflow-visible bg-slate-50/5 shadow-2xl shadow-slate-400 backdrop-blur-[3px] dark:bg-slate-400/5 dark:shadow-black">
      <Button
        variant="outline"
        size="icon"
        onClick={handleZoomOut}
      >
        <Icons.minus className="size-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleZoomIn}
      >
        <Icons.plus className="size-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleFitView}
      >
        <Icons.fit className="size-4" />
      </Button>
    </ButtonGroup>
  )
}