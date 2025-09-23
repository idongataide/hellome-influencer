import { convertCurrency } from '@/api/converterApi';
import useSWR from "swr";


export const useCurrencyConverter = (currency: string, amount: number) => {
  const { data, isLoading, error, mutate } = useSWR(
    `/swap?currency=${currency}&amount=${amount}`,
    () => convertCurrency(currency, amount),
    {
      revalidateOnFocus: false,
    },
  );

  return { data, isLoading, error, mutate };
};
