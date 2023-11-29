import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="w-full max-w-3xl mx-auto mt-4 overflow-y-auto h-96">
      <Skeleton className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-4 mb-2 h-fit" />
      <Skeleton className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-4 mb-2 h-fit" />
      <Skeleton className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-4 mb-2 h-fit" />
      <Skeleton className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-4 mb-2 h-fit" />
    </div>
  )
}
