import React, { useState } from 'react';
import { Modal, Form, Select, Input, Button } from 'antd';
import { useBanks } from '@/hooks/useBanks';
import { resolveBank, addBankAccount } from '@/api/banks';
import toast from 'react-hot-toast';
import { useUser } from '@/hooks/useAdmin';

interface AddBankAccountModalProps {
  visible: boolean;
  onCancel: () => void;
  onAddAccount: (values: any) => void;
  loading: boolean;
}

const AddBankAccountModal: React.FC<AddBankAccountModalProps> = ({
  visible,
  onCancel,
  onAddAccount,
}) => {
  const [form] = Form.useForm();
  const [otpForm] = Form.useForm();
  const [resolvedAccountName, setResolvedAccountName] = useState<string | null>(null);
  const [resolvingAccount, setResolvingAccount] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [otpModalVisible, setOtpModalVisible] = useState<boolean>(false);
  const [bankAccountData, setBankAccountData] = useState<any>(null);
  const [otpLoading, setOtpLoading] = useState<boolean>(false);

  const { data: Banks } = useBanks('NGN');
  const { data: user } = useUser();

  const baseCurrency = user?.wallet?.currency;
  const isNGN = baseCurrency === 'NGN';

  const handleAddAccount = () => {
    form.validateFields().then(async (values) => {
      let payload: any;
      setSubmitting(true);

      if (isNGN) {
        const selectedBank = Banks?.data.find((bank: any) => bank.bank_code === values.bank);

        payload = {
          account_number: values.accountNumber,
          bank: {
            name: selectedBank ? selectedBank.bank_name : '',
            code: selectedBank ? selectedBank.bank_code : '', // NGN only
            sort_code: selectedBank ? selectedBank.bank_code : '', // NGN sort_code
            address: '',   // not required for NGN
            bic_swift: '', // not required for NGN
            iban: ''       // not required for NGN
          },
          metadata: {
            account_name: `${user?.profile?.first_name || ''} ${user?.profile?.last_name || ''}`.trim()
          }
        };
      } else {
        payload = {
          account_number: values.accountNumber,
          bank: {
            name: values.bankName,
            code: '', // not required for non-NGN
            sort_code: baseCurrency === 'GBP' ? values.sortCode || '' : '',
            address: baseCurrency === 'USD' ? values.address || '' : '',
            bic_swift: baseCurrency === 'USD' || baseCurrency === 'EUR' ? values.bicSwift || '' : '',
            iban: baseCurrency === 'EUR' ? values.iban || '' : ''
          },
          metadata: {
            account_name: `${user?.profile?.first_name || ''} ${user?.profile?.last_name || ''}`.trim()
          }
        };
      }

      setBankAccountData(payload);
      setOtpModalVisible(true);
    }).finally(() => {
      setSubmitting(false);
    });
  };

  const handleOtpSubmit = async (values: any) => {
    if (!bankAccountData) return;

    try {
      setOtpLoading(true);
      const payloadWithOtp = {
        ...bankAccountData,
        one_time_password: values.otp
      };

      const res = await addBankAccount(payloadWithOtp);
      console.log(res,'s')

      if (res?.success !== true) {
        toast.error(res?.response?.data?.message || 'Failed to add bank account');
      } else if (res.success === true) {
        toast.success('Bank account added successfully!');
        onAddAccount(bankAccountData);
        form.resetFields();
        setResolvedAccountName(null);
        setOtpModalVisible(false);
        otpForm.resetFields();
      }
    } catch (error) {
      console.error("Error adding bank account:", error);
      toast.error('Failed to add bank account. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleCancel = () => {
    setOtpModalVisible(false);
    onCancel();
  };

  return (
    <>
      <Modal
        title={<span className="text-lg font-semibold text-[#0B2447]">Add Account</span>}
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddAccount}
          onValuesChange={async (changedValues, allValues) => {
            if (isNGN && (changedValues.bank || changedValues.accountNumber)) {
              const { bank, accountNumber } = allValues;
              if (bank && accountNumber && accountNumber.length >= 10) {
                try {
                  setResolvingAccount(true);
                  const response = await resolveBank({ account_number: accountNumber, bank_code: bank });
                  if (response && response.data && response.data.account_name) {
                    setResolvedAccountName(response.data.account_name);
                  } else {
                    setResolvedAccountName(null);
                  }
                } catch (error) {
                  console.error("Error resolving bank account:", error);
                  setResolvedAccountName(null);
                } finally {
                  setResolvingAccount(false);
                }
              } else {
                setResolvedAccountName(null);
                setResolvingAccount(false);
              }
            }
          }}
        >
          {isNGN ? (
            <>
              <Form.Item
                label="Select Bank"
                name="bank"
                rules={[{ required: true, message: 'Please select a bank!' }]}
              >
                <Select
                  placeholder="Select"
                  className="!h-[43px]"
                  showSearch
                  filterOption={(input, option) => {
                    const childrenText = String(option?.children || '');
                    return childrenText.toLowerCase().includes(input.toLowerCase());
                  }}
                >
                  {Banks && Banks.map((bank: any) => (
                    <Select.Option key={bank.bank_code} value={bank.bank_code}>
                      {bank.bank_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Recipient Account"
                name="accountNumber"
                rules={[{ required: true, message: 'Please input recipient account number!' }]}
              >
                <Input placeholder="Enter recipient account" />
              </Form.Item>

              <div className="flex item-end mb-2 justify-content-end">
                <span className="text-[#036BDD] font-semibold">
                  Account Name: {resolvingAccount ? 'Resolving...' : resolvedAccountName || 'N/A'}
                </span>
              </div>
            </>
          ) : (
            <>
              <Form.Item
                label="Bank Name"
                name="bankName"
                rules={[{ required: true, message: 'Please enter bank name!' }]}
              >
                <Input placeholder="Enter bank name" />
              </Form.Item>

              <Form.Item
                label="Account Number"
                name="accountNumber"
                rules={[{ required: true, message: 'Please input account number!' }]}
              >
                <Input placeholder="Enter account number" />
              </Form.Item>

              {baseCurrency === 'GBP' && (
                <Form.Item label="Sort Code" name="sortCode">
                  <Input placeholder="Enter sort code" />
                </Form.Item>
              )}

              {baseCurrency === 'USD' && (
                <>
                  <Form.Item label="Bank Address" name="address">
                    <Input placeholder="Enter bank address" />
                  </Form.Item>
                  <Form.Item label="BIC/SWIFT" name="bicSwift">
                    <Input placeholder="Enter BIC/SWIFT code" />
                  </Form.Item>
                </>
              )}

              {baseCurrency === 'EUR' && (
                <>
                  <Form.Item label="IBAN" name="iban">
                    <Input placeholder="Enter IBAN" />
                  </Form.Item>
                  <Form.Item label="BIC/SWIFT" name="bicSwift">
                    <Input placeholder="Enter BIC/SWIFT code" />
                  </Form.Item>
                </>
              )}
            </>
          )}

          <Form.Item className="mt-7!">
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              className="h-[48px]! w-full bg-primary hover:bg-primary-dark text-white font-medium text-base rounded-full!"
            >
              Add Account
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* OTP Modal */}
      <Modal
        title={<span className="text-[22px] font-bold text-[#344054]">Enter OTP</span>}
        open={otpModalVisible}
        onCancel={() => setOtpModalVisible(false)}
        footer={null}
        width={400}
        centered
        className="otp-modal"
      >
        <div className="mb-6 text-center">
          <p className="text-[#475467]">
            Please enter the 6-digit verification code from your authenticator app
          </p>
        </div>

        <Form form={otpForm} layout="vertical" onFinish={handleOtpSubmit}>
          <Form.Item
            name="otp"
            rules={[
              { required: true, message: 'Please enter OTP' },
              { pattern: /^\d{6}$/, message: 'Please enter a valid 6-digit OTP' }
            ]}
          >
            <Input.OTP length={6} className="justify-center" />
          </Form.Item>

          <Form.Item className="flex justify-center mt-6">
            <Button
              type="primary"
              htmlType="submit"
              loading={otpLoading}
              className="h-[43px]! bg-primary px-10! hover:bg-primary-dark text-white font-medium text-base rounded-full!"
            >
              Verify & Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddBankAccountModal;
