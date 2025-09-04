
import { axiosAPIInstance } from "./interceptor";

export const getCustomers = async () => {
    try {
      return await axiosAPIInstance
        .get(`/users/`)
        .then((res) => {
          return res?.data;
        });
    } catch (error) {
      return error;
    }
  };

export const getPayouts = async () => {
    try {
      return await axiosAPIInstance
        .get(`/payouts`)
        .then((res) => {
          return res?.data;
        });
    } catch (error) {
      return error;
    }
};

export const getReferrals = async (page: number = 1) => {
  try {
    return await axiosAPIInstance
      .get(`/referrals`, { params: { page } })
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};
  

export const get2FA = async () => {
  try {
    return await axiosAPIInstance
      .post(`/security/2fa`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

// Verify 2FA endpoint
export const verify2FA = async (data: { one_time_password: string }) => {
  try {
    return await axiosAPIInstance
      .patch(`/security/2fa`, data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const updatePassword = async (data: any) => {
  try {
    return await axiosAPIInstance
      .patch(`/security/password`, data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};