import React from "react";
import { Form, Select } from "antd";
import { FaArrowDown } from "react-icons/fa";

const { Option } = Select;



const CurrencyConverterCard = ({
    
}) => {


    const RemittanceSource = [
        {
          country: "United Kingdom",
          currency: "GBP",
          iso: "gb",
        },
        {
          country: "Euro",
          currency: "EUR",
          iso: "eu",
        },
        {
          country: "Nigeria",
          currency: "NGN",
          iso: "ng",
        },
        {
          country: "Denmark",
          currency: "DKK",
          iso: "dk",
        },
        {
          country: "United States",
          currency: "USD",
          iso: "us",
        },
      ];

      
  return (
    <div className="min-h-[340px] relative w-full rounded-3xl p-6 bg-gradient-to-b from-[#036BDD] to-[#05244C]">
      {/* Card */}
      <div>
        {/* From Section */}
        <div className="bg-[#041D3E] w-full min-h-[106px] rounded-2xl p-4 flex justify-between items-center">
          <div>
            <p className="text-md mb-3 font-medium text-[#F2F4F7]">From</p>
            <p className="text-[#D4E7FF] text-[24px] font-normal">₦ 0.00</p>
          </div>
          <div className=" text-end ">
            <p className="text-md mb-3 me-2 text-[#FFFFFF]">Bal: ₦32,000</p>
            <Form.Item name="country" className="!mb-0 !mt-5">
              <Select
                className="form-control p-0 text-white converter"
              
                // value={selectedCurrency}
                // onChange={handleCurrencyChange}
                defaultValue={"GBP"}
                dropdownClassName="bg-[#041D3E] text-white"
              >
                {RemittanceSource && Array.isArray(RemittanceSource) ? (
                  RemittanceSource.map((e) => {
                    const isoCode =
                      e.country === "Euro" ? "eur" : e.iso?.toLowerCase();

                    return (
                      <Option
                        key={e.currency}
                        value={e.currency}
                        className="!bg-transparent"
                      >
                        <div className="flex items-center space-x-2">
                          <img
                            src={`images/all-flags/${isoCode}.svg`}
                            alt={`${e.country} flag`}
                            className="h-10 w-10 object-cover rounded-full"                          
                          />
                          <span className="font-semibold">{e.currency}</span>
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
            <p className="text-[#D4E7FF] text-[24px] font-normal">₦ 0.00</p>
          </div>
          <div className="text-end">
                <div className="flex items-center me-3 space-x-2">
                    <img
                        src={`images/all-flags/ng.svg`}
                        alt="flag"
                        className="h-10 w-10 object-cover rounded-full"                          
                    />
                    <span className="font-semibold text-white">NGN</span>
                </div>           
          </div>
        </div>


        {/* Button */}
        <button className="w-full bg-[#036BDD] text-white py-3 rounded-xl font-semibold mt-5 hover:bg-[#0259B8] transition">
          Convert now
        </button>
      </div>
    </div>
  );
};

export default CurrencyConverterCard;
