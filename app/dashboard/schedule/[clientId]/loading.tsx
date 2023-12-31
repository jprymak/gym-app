import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-2">
      <div className="flex gap-1 items-center justify-end mb-4">
        <Skeleton className="h-[40px] w-[126px]" />
        <Skeleton className="h-[40px] w-[84px]" />
      </div>
      <div className="flex gap-2 rounded-md">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-[40px] w-[58px]" />
          <Skeleton className="h-[40px] w-[58px]" />
        </div>
        <div className="border w-[782px]">
          <div className="p-4 border-b">
            <Skeleton className="h-4 w-[80px]" />
          </div>
          <div className="flex border-b h-[48px] items-center">
            <div className="w-[71px] p-4 flex justify-center">
              <Skeleton className="h-4 w-[40px]" />
            </div>
            <div className="w-[232px] p-4 flex">
              <Skeleton className="h-4 w-[60px]" />
            </div>
            <div className="w-[88px] p-4 flex justify-center">
              <Skeleton className="h-4 w-[50px]" />
            </div>
            <div className="w-[88px] p-4 flex justify-center">
              <Skeleton className="h-4 w-[50px]" />
            </div>
            <div className="w-[88px] p-4 flex">
              <Skeleton className="h-4 w-[50px]" />
            </div>
            <div className="w-[127px] p-4 flex">
              <Skeleton className="h-4 w-[70px]" />
            </div>
            <div className="w-[96px] p-4 flex">
              <Skeleton className="h-4 w-[50px]" />
            </div>
          </div>
          <div className="flex border-b h-[69px] items-center">
            <div className="w-[71px] h-full p-4 flex justify-center">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="w-[232px] h-full p-4 flex">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="w-[88px] h-full p-4 flex justify-center">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="w-[88px] h-full p-4 flex justify-center">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="w-[88px] h-full p-4 flex">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="w-[127px] h-full p-4 flex">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="w-[96px] h-full p-4 flex">
              <Skeleton className="h-full w-full" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <Skeleton className="h-[40px] w-[104px]" />
          <Skeleton className="h-[40px] w-[104px]" />
        </div>
      </div>
    </div>
  );
}
