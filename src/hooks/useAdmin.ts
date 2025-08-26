import { getUser } from "@/api/authAPI";
import { getCustomers, getPayouts, getReferrals } from "@/api/customersApi";


import useSWR from "swr";

export const useAllCustomers = () => {
  const { data, isLoading, mutate } = useSWR(
    `users/`,
    () => {
      return getCustomers().then((res) => {
        return res?.data;
      });
    },

    {
      revalidateOnFocus: false,
    },
  );

  return { data, isLoading, mutate };
};



export const useUser = () => {
  const { data, isLoading, mutate } = useSWR(
    `auth/`,
    () => { 
      return getUser().then((res) => {
        return res?.data;
      });
    },
    {
      revalidateOnFocus: false,
    },
  );
  return { data, isLoading, mutate };
};


export const usePayouts = (page: number = 1) => {
  const { data, isLoading, mutate, error } = useSWR(
    [`payouts`, page],
    () => getPayouts().then((res) => res?.data),
    { revalidateOnFocus: false }
  );

  return { data, isLoading, mutate, error };
};

export const useReferrals = (page: number = 1) => {
  const { data, isLoading, mutate, error } = useSWR(
    [`referrals`, page],
    () => getReferrals(page).then((res) => res?.data),
    { revalidateOnFocus: false }
  );

  return { data, isLoading, mutate, error };
};

