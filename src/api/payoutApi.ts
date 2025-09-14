import { axiosAPIInstance } from "./interceptor";



interface PayoutRequest {
  amount: string;
  narration: string;
  one_time_password: string;
}



export const requestPayout = async (data: PayoutRequest) => {
    try {
      return await axiosAPIInstance
        .post('/request-payout', data)
        .then((res) => {
          return res?.data;
        });
    } catch (error) {
      return error;
    }
};