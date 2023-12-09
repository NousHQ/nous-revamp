import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="w-full max-w-3xl mx-auto mt-4 overflow-y-auto h-96">
      <Skeleton className="bg-green-3 hover:bg-green-4 focus:bg-green-5 text-green-12 rounded-lg shadow-lg p-4 mb-2" />
      <Skeleton className="bg-green-3 hover:bg-green-4 focus:bg-green-5 text-green-12 rounded-lg shadow-lg p-4 mb-2" />
      <Skeleton className="bg-green-3 hover:bg-green-4 focus:bg-green-5 text-green-12 rounded-lg shadow-lg p-4 mb-2" />
      <Skeleton className="bg-green-3 hover:bg-green-4 focus:bg-green-5 text-green-12 rounded-lg shadow-lg p-4 mb-2" />
    </div>
  )
}
