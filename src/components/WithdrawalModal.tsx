import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { useUser } from '../hooks/useAdmin';

interface WithdrawalModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  loading?: boolean;
}

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  loading = false,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
    });
  };

  const { data: user } = useUser();

  // Extract data from user profile
  const walletBalance = user?.profile?.wallet?.balance || "0.00";

  return (
    <Modal
      title={<span className="text-[22px] text-center! font-bold text-[#344054]">Withdraw</span>}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={500}
      centered
      className="withdrawal-modal"
    >
      {/* Available Balance Section */}
      <div className="bg-[#EBF4FF4D] rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
            <span className="text-white text-xs font-bold">🇬🇧</span>
          </div>
          <div>
            <div className="text-md font-normal text-[#475467]">{walletBalance}</div>
            <div className="text-[12px] text-[#98A2B3]">Available Balance</div>
          </div>
        </div>
      </div>

      {/* Form */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        {/* <Form.Item
          label="Select Bank"
          name="bank"
          className="mb-2"
          rules={[{ required: true, message: 'Please select a bank' }]}
        >
          <Select
            placeholder="Select"
            suffixIcon={<DownOutlined />}
            options={banks}
            className="h-[43px]!"
          />
        </Form.Item> */}

        {/* <Form.Item
          label="Recipient Account"
          name="recipientAccount"
          rules={[{ required: true, message: 'Please enter recipient account' }]}
        >
          <Input 
            placeholder="Enter recipient account"
          />
        </Form.Item> */}

        {/* <Form.Item
          label="Sort Code"
          name="sortCode"
          rules={[
            { required: true, message: 'Please enter sort code' },
            { pattern: /^\d{2}-\d{2}-\d{2}$/, message: 'Sort code must be in format XX-XX-XX' }
          ]}
        >
          <Input placeholder="Enter sort code" />
        </Form.Item> */}

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
  );
};

export default WithdrawalModal; 