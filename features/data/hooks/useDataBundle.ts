import { useQuery } from "@tanstack/react-query";
import { fetchDataBundles } from "@/lib/api/get-data-bundle";
import { DataBundle } from "@/types/bill.types";

export const useGetDataBundles = (network: string) => {
  return useQuery<DataBundle>({
    queryKey: ["data-bundles", network],
    queryFn: () => fetchDataBundles(network),
    staleTime: 10 * 60 * 1000, 
    enabled: !!network
  });
};