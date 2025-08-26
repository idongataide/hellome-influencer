import React from "react";
import { getCountries, CountryItem } from "@/api/countries";

type UseCountriesState = {
	countries: CountryItem[];
	loading: boolean;
	error: string | null;
};

export const useCountries = () => {
	const [{ countries, loading, error }, setState] = React.useState<UseCountriesState>({
		countries: [],
		loading: true,
		error: null,
	});

	const fetchCountries = React.useCallback(async () => {
		setState((s) => ({ ...s, loading: true, error: null }));
		const res = await getCountries();
		if (res?.error) {
			setState({ countries: [], loading: false, error: res?.message || "Failed to load countries" });
			return;
		}
		const list: CountryItem[] = Array.isArray(res?.data) ? res.data : [];
		setState({ countries: list, loading: false, error: null });
	}, []);

	React.useEffect(() => {
		fetchCountries();
	}, [fetchCountries]);

	return { countries, loading, error, refetch: fetchCountries };
};


