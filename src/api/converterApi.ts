import { axiosAPIInstance } from './interceptor';

export const convertCurrency = async (currency: string, amount: number) => {
  try {
    const response = await axiosAPIInstance.get(`/swap?currency=${currency}&amount=${amount}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
