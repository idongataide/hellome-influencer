import { axiosAPIInstance } from "./interceptor";

export const postSwap = async (reference: string) => {
  try {
    const response = await axiosAPIInstance.post("/swap", { reference });
    return response.data;
  } catch (error) {
    throw error;
  }
};
