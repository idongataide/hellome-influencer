import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';

interface WithdrawalModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  loading?: boolean;
  availableBalance?: string;
}

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  loading = false,
  availableBalance = '£700.00'
}) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
    });
  };

  const banks = [
    { value: 'barclays', label: 'Barclays Bank' },
    { value: 'hsbc', label: 'HSBC Bank' },
    { value: 'lloyds', label: 'Lloyds Bank' },
    { value: 'natwest', label: 'NatWest' },
    { value: 'santander', label: 'Santander' },
  ];

  return (
    <Modal
      title="Withdraw"
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
            <div className="text-md font-normal text-[#475467]">{availableBalance}</div>
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
        <Form.Item
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
        </Form.Item>

        <Form.Item
          label="Recipient Account"
          name="recipientAccount"
          rules={[{ required: true, message: 'Please enter recipient account' }]}
        >
          <Input 
            placeholder="Enter recipient account"
          />
        </Form.Item>

        <Form.Item
          label="Sort Code"
          name="sortCode"
          rules={[
            { required: true, message: 'Please enter sort code' },
            { pattern: /^\d{2}-\d{2}-\d{2}$/, message: 'Sort code must be in format XX-XX-XX' }
          ]}
        >
          <Input placeholder="Enter sort code" />
        </Form.Item>

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