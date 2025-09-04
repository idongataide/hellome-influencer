import { useState, useEffect } from "react";
import { Form, Select, InputNumber, Button } from "antd";
import { FaArrowDown } from "react-icons/fa";
import { useUser } from "@/hooks/useAdmin";
import { useCurrencyConverter } from "@/hooks/useCurrencyConverter";

const { Option } = Select;

const CurrencyConverterCard = ({}) => {
  const { data: user } = useUser();
  
  // State for form values
  const [amount, setAmount] = useState<number>(0);
  const [fromCurrency, setFromCurrency] = useState<string>(user?.wallet?.currency || "EUR");
  const [toCurrency, setToCurrency] = useState<string>(user?.wallet?.currency || "EUR");
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(user?.wallet || null);

  type Wallet = {
    currency: string;
    balance: string;
    status: string;
  };

  // Use the currency converter hook
  const { data: convert, isLoading } = useCurrencyConverter(fromCurrency, amount);

  useEffect(() => {
    if (user?.wallets && Array.isArray(user.wallets)) {
      const wallet = (user.wallets as Wallet[]).find((w) => w.currency === fromCurrency);
      setSelectedWallet(wallet || null);
      
      // Set the toCurrency to the user's main wallet currency
      if (user.wallet) {
        setToCurrency(user.wallet.currency);
      }
    }
  }, [fromCurrency, user]);

  const handleCurrencyChange = (value: string) => {
    setFromCurrency(value);
  };

  const handleAmountChange = (value: number | null) => {
    setAmount(value || 0);
  };

  // Calculate converted amount
  const convertedAmount = convert?.convertedAmount || 0;
  const exchangeRate = convert?.exchangeRate || 1;

  return (
    <div className="min-h-[340px] relative w-full rounded-3xl p-6 bg-gradient-to-b from-[#036BDD] to-[#05244C]">
      {/* Card */}
      <div>
        {/* From Section */}
        <div className="bg-[#041D3E] w-full min-h-[106px] rounded-2xl p-4 flex justify-between items-center">
          <div>
            <p className="text-md mb-3 font-medium text-[#F2F4F7]">From</p>
            <InputNumber
              className="w-full bg-transparent text-[#D4E7FF] text-[24px] font-normal border-none"
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
                    .filter((w: Wallet) => w.currency !== user.wallet.currency)
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
              {toCurrency} {convertedAmount.toFixed(2)}
            </p>
            {amount > 0 && (
              <p className="text-sm text-[#D4E7FF]">
                1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
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

        {/* Button */}
        <Button 
          className="w-full bg-[#036BDD] text-white py-3 rounded-xl font-semibold mt-5 hover:bg-[#0259B8] transition disabled:opacity-50"
          disabled={isLoading || amount <= 0}
        >
          {isLoading ? "Converting..." : "Convert now"}
        </Button>
      </div>
    </div>
  );
};

export default CurrencyConverterCard;