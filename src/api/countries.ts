import { axiosAPIInstance, handleApiError } from "./interceptor";

export type CountryItem = {
	country: string;
	currency: string;
	iso: string;
};

export type CountriesResponse = {
	success: boolean;
	message: string;
	data: CountryItem[];
};

export const getCountries = async (): Promise<CountriesResponse | any> => {
	try {
		const res = await axiosAPIInstance.get(`/countries`);
		return res?.data;
	} catch (error: any) {
		return handleApiError(error);
	}
};


