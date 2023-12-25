import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="w-full mx-auto mt-2 overflow-y-auto h-96">
      <Skeleton className="bg-green-3 focus:bg-green-5 text-green-12 rounded-lg shadow-lg p-7 mb-2" />
      <Skeleton className="bg-green-3 focus:bg-green-5 text-green-12 rounded-lg shadow-lg p-7 mb-2" />
      <Skeleton className="bg-green-3 focus:bg-green-5 text-green-12 rounded-lg shadow-lg p-7 mb-2" />
      <Skeleton className="bg-green-3 focus:bg-green-5 text-green-12 rounded-lg shadow-lg p-7 mb-2" />
    </div>
  )
}
