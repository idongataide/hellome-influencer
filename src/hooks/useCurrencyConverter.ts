import { convertCurrency } from '@/api/converterApi';
import useSWR from "swr";


export const useCurrencyConverter = (currency: string, amount: number) => {
  const { data, isLoading, error, mutate } = useSWR(
    `/swap?currency=${currency}&amount=${amount}`,
    () => {
      return convertCurrency(currency, amount).then((res) => {
        return res?.data;
      });
    },

    {
      revalidateOnFocus: false,
    },
  );

  return { data, isLoading, error, mutate };
};