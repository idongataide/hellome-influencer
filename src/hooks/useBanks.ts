import { getBanksList } from '@/api/banks';
import useSWR from 'swr';

// interface Bank {
//   id: string;
//   name: string;
//   code: string;
// }

export const useBanks = (currency?: string) => {
  const { data, isLoading, error, mutate } = useSWR(
    currency ? `/banks?currency=${currency}` : '/banks',
    () => {
      return getBanksList(currency).then((res) => {
        if (res && !res.error) {
          return res;
        } else {
          throw new Error(res?.error || 'Failed to fetch banks');
        }
      });
    },
    {
      revalidateOnFocus: false,
    },
  );

  return { data, loading: isLoading, error, mutate };
};