import { getCustomerCount, getCustomers, getCustomersDetails } from "@/api/customersApi";


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

export const useCustomerCount = () => {
    const { data, isLoading, mutate } = useSWR(
      `/users?component=count-status`,
      () => {
        return getCustomerCount().then((res) => {
          return res;
        });
      },
      {
        revalidateOnFocus: false,
      }
    );
    return { data, isLoading, mutate };
};

export const useCustomersData = (userId: string) => {
  const { data, isLoading, mutate } = useSWR(
    `users/`,
    () => {
      return getCustomersDetails(userId).then((res) => {
        return res?.data;
      });
    },

    {
      revalidateOnFocus: false,
    },
  );

  return { data, isLoading, mutate };
};

