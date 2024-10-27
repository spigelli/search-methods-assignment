import { Icons } from "../icons";

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex size-12 items-center justify-center rounded-full bg-gray-800">
          <Icons.load className="size-6 animate-spin text-gray-50" />
        </div>
        <p className="text-sm font-medium text-gray-50">Loading...</p>
      </div>
    </div>
  )
}
