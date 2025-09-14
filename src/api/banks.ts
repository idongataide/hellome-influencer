import { axiosAPIInstance } from "./interceptor";

export const getBanksList = async (currency?: string) => {
    try {
      return await axiosAPIInstance
        .get(`/banks?currency=NGN`, {
          params: currency ? { currency } : {},
        })
        .then((res) => {
          return res?.data;
        });
    } catch (error) {
      return error;
    }
 };

export const verifyAccount = async (data: any) => {
    try {
      return await axiosAPIInstance
        .post(`/settings/bank-lists`, data)
        .then((res) => {
          return res?.data;
        });
    } catch (error) {
      return error;
    }
 };

export const resolveBank = async (data: { account_number: string; bank_code: string }) => {
    try {
      return await axiosAPIInstance
        .post(`/banks`, data)
        .then((res) => {
          return res?.data;
        });
    } catch (error) {
      return error;
    }
 };



 export const addBankAccount = async (data: { 
  account_number: string;
  bank: {
    name: string;
    code?: string;
    address?: string;
    bic_swift?: string;
    iban?: string;
    sort_code?: string;
  };
  metadata: {
    account_name: string;
  };
  one_time_password: string;
}) => {
  try {
    return await axiosAPIInstance.post(`/bank-account`, data).then((res) => res?.data);
  } catch (error) {
    return error;
  }
};
