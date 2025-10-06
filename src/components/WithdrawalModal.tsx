import React, { useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { useUser } from '../hooks/useAdmin';

interface WithdrawalModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any, otp: string) => void;
  loading?: boolean;
 
}

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [otpForm] = Form.useForm();
  const [step, setStep] = useState<'withdrawal' | 'otp'>('withdrawal');
  const [withdrawalData, setWithdrawalData] = useState<any>(null);

  const { data: user } = useUser();

  // const walletBalance = user?.wallet?.balance || "0.00";
  const isoCode = user?.wallet?.currency.slice(0,2).toLowerCase();

  const handleWithdrawalSubmit = (values: any) => {
    setWithdrawalData(values);
    setStep('otp');
  };

  const handleOtpSubmit = (values: { otp: string }) => {
    onSubmit(withdrawalData, values.otp);
    setStep('withdrawal');
    otpForm.resetFields();
    form.resetFields();
  };

  const handleCancel = () => {
    setStep('withdrawal');
    onCancel();
    form.resetFields();
    otpForm.resetFields();
  };

  return (
    <>
      {/* Withdrawal Modal */}
      <Modal
        title={<span className="text-[22px] text-center! font-bold text-[#344054]">Withdraw</span>}
        open={visible && step === 'withdrawal'}
        onCancel={handleCancel}
        footer={null}
        width={500}
        centered
        className="withdrawal-modal"
      >
        <div className="bg-[#EBF4FF4D] rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">        
            <div className="flex items-center space-x-2">
                <img
                  src={`images/all-flags/${isoCode}.svg`}
                  alt={`${isoCode} flag`}
                  className="h-10 w-10 object-cover rounded-full"
                />
                <div>
                  <div className="text-lg font-normal text-[#475467]">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: user.wallet.currency,
                    }).format(Number(user.wallet.balance))}
                  </div>
                  <div className="text-[12px] text-[#98A2B3]">Available Balance</div>
                </div>
              </div>
            </div>
          </div>
        {/* </div> */}

        {/* Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleWithdrawalSubmit}
        >
          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              { required: true, message: 'Please enter amount' },
              { pattern: /^\d+(\.\d{1,2})?$/, message: 'Please enter a valid amount' }
            ]}
          >
            <Input placeholder="Enter amount" />
          </Form.Item>

          <Form.Item
            label="Narration"
            name="narration"
            rules={[{ required: true, message: 'Please enter narration' }]}
          >
            <Input placeholder="Enter narration" />
          </Form.Item>

          <Form.Item className="flex justify-center">
              <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="h-[43px]! bg-primary px-10! text-end hover:bg-primary-dark text-white font-medium text-base rounded-full!"
              >
                  Proceed
              </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* OTP Modal */}
      <Modal
        title={<span className="text-[22px] text-center! font-bold text-[#344054]">Enter OTP</span>}
        open={visible && step === 'otp'}
        onCancel={handleCancel}
        footer={null}
        width={400}
        centered
        className="otp-modal"
      >
        <div className="mb-6 text-center">
          <p className="text-[#475467]">Please enter the 6-digit verification code from your authenticator app</p>
        </div>

        <Form
          form={otpForm}
          layout="vertical"
          onFinish={handleOtpSubmit}
        >
          <Form.Item
            name="otp"
            rules={[
              { required: true, message: 'Please enter OTP' },
              { pattern: /^\d{6}$/, message: 'Please enter a valid 6-digit OTP' }
            ]}
          >
            <Input.OTP 
              length={6} 
              formatter={(str) => str.toUpperCase()}
              className="justify-center"
            />
          </Form.Item>

          <Form.Item className="flex justify-center mt-6">
            <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="h-[43px]! bg-primary px-10! text-end hover:bg-primary-dark text-white font-medium text-base rounded-full!"
            >
                Verify & Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default WithdrawalModal;