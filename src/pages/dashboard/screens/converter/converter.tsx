import { useState, useEffect } from "react";
import { Form, Select, InputNumber, Button } from "antd";
import { FaArrowDown } from "react-icons/fa";
import { useUser } from "@/hooks/useAdmin";
import { useCurrencyConverter } from "@/hooks/useCurrencyConverter";
import { useToast } from "@/global/ToastProvider";
import { postSwap } from "@/api/swapApi";

const { Option } = Select;

const CurrencyConverterCard = ({}) => {
  const { data: user } = useUser();
  
  // State for form values
  const [amount, setAmount] = useState<number>(500);
  const [fromCurrency, setFromCurrency] = useState<string>("EUR"); 
  const toCurrency = user?.wallet?.currency || "GBP";
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { viewToast } = useToast();

  type Wallet = {
    currency: string;
    balance: string;
    status: string;
  };

  const { data: convert, isLoading, error } = useCurrencyConverter(fromCurrency, amount);

  console.log(convert,'convert')
useEffect(() => {
  if (user?.wallets && Array.isArray(user.wallets) && !fromCurrency) {
    const availableCurrencies = (user.wallets as Wallet[])
      .filter((w: Wallet) => w.currency !== toCurrency);

    if (availableCurrencies.length > 0) {
      setFromCurrency(availableCurrencies[0].currency);
    }
  }
}, [user, toCurrency]); 

useEffect(() => {
  if (user?.wallets && Array.isArray(user.wallets)) {
    const wallet = (user.wallets as Wallet[]).find(
      (w) => w.currency === fromCurrency
    );
    setSelectedWallet(wallet || null);
  }
}, [fromCurrency, user]);

useEffect(() => {
  if (error) {
    console.log(error, "verror");
    setErrorMessage(error?.response?.data?.message);
  } else {
    setErrorMessage(null);
  }
}, [error]);


  const handleCurrencyChange = (value: string) => {
    setFromCurrency(value);
  };

  const handleAmountChange = (value: number | null) => {
    setAmount(value || 0);
  };

  const handleConvert = async () => {
    if (!convert?.reference) {
      viewToast("Conversion reference not found.", "error");
      return;
    }

    try {
      await postSwap(convert.reference);
      viewToast("Currency swapped successfully!", "success");
    } catch (err: any) {
      viewToast(err?.response?.data?.message || "Failed to swap currency.", "error");
    }
  };

  return (
    <div className="min-h-[340px] relative w-full rounded-3xl p-6 bg-gradient-to-b from-[#036BDD] to-[#05244C]">
      {/* Card */}
      <div>
        {/* From Section */}
        <div className="bg-[#041D3E] w-full min-h-[106px] rounded-2xl p-4 flex justify-between items-center">
          <div>
            <p className="text-md mb-3 font-medium text-[#F2F4F7]">From</p>
            <InputNumber
              className="w-full bg-transparent text-[#D4E7FF] !min-w-[120px] text-[24px] font-normal border-none"
              controls={false}
              value={amount}
              onChange={handleAmountChange}
              min={0}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
              placeholder="0.00"
              style={{ color: '#D4E7FF', fontSize: '24px' }}
            />
          </div>
          <div className="text-end">
            <p className="text-md mb-3 me-2 text-[#FFFFFF]">
              Bal: {fromCurrency} {selectedWallet?.balance ?? "0.00"}
            </p>
            <Form.Item name="country" className="!mb-0 !mt-5">
              <Select
                className="form-control p-0 text-white converter"
                value={fromCurrency}
                defaultValue={fromCurrency}
                onChange={handleCurrencyChange}
                dropdownClassName="bg-[#041D3E] text-white"
              >
                {user?.wallets && Array.isArray(user.wallets) ? (
                  (user.wallets as Wallet[])
                    .filter((w: Wallet) => w.currency !== toCurrency) 
                    .map((w: Wallet) => {
                      const isoCode = w.currency === "EUR" ? "eur" : w.currency.slice(0,2).toLowerCase();
                      return (
                        <Option
                          key={w.currency}
                          value={w.currency}
                          className="!bg-transparent"
                        >
                          <div className="flex items-center space-x-2">
                            <img
                              src={`images/all-flags/${isoCode}.svg`}
                              alt={`${w.currency} flag`}
                              className="h-10 w-10 object-cover rounded-full"
                            />
                            <span className="font-semibold">{w.currency}</span>
                          </div>
                        </Option>
                      );
                    })
                ) : (
                  <Option disabled>Loading...</Option>
                )}
              </Select>
            </Form.Item>
          </div>
        </div>

        <div className='exchange-line rounded-full w-10'>
            <span className="exchange" >
                <FaArrowDown className="text-[#fff]"/>
            </span>
        </div>

        <div className="bg-[#041D3E] mt-5 w-full min-h-[106px] rounded-2xl p-4 flex justify-between items-center">
        <div>
            <p className="text-md mb-3 font-medium text-[#F2F4F7]">To</p>
            <p className="text-[#D4E7FF] text-[24px] font-normal">
              {convert?.data?.target?.currency} {convert?.data?.target?.amount?.toFixed(2) || "0.00"}
            </p>
            {amount > 0 && convert?.data?.rate && (
              <p className="text-sm text-[#D4E7FF]">
                1 {fromCurrency} = {convert?.data?.rate} {toCurrency}
              </p>
            )}
          </div>
          <div className="text-end">
            <div className="flex items-center me-3 space-x-2">
              <img
                src={`images/all-flags/${toCurrency.slice(0,2).toLowerCase()}.svg`}
                alt="flag"
                className="h-10 w-10 object-cover rounded-full"                          
              />
              <span className="font-semibold text-white">{toCurrency}</span>
            </div>           
          </div>
        </div>
        {errorMessage && (
          <p className="text-red-500 text-sm mt-2">
            {errorMessage}
          </p>
        )}

        <Button 
          className="w-full bg-[#036BDD]! border-none! text-white! min-h-[48px]! py-3 rounded-xl font-semibold! mt-5 hover:bg-[#0259B8] transition disabled:opacity-50"
          disabled={isLoading || amount <= 0}
          onClick={handleConvert}
          loading={isLoading}
        >
          {isLoading ? "Converting..." : "Convert now"}
        </Button>
      </div>
    </div>
  );
};

export default CurrencyConverterCard;