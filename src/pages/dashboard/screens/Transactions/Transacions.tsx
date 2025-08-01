import React, { useState } from 'react';
import { Table, Empty, Tag, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import type { FC } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import WithdrawalModal from '../../../../components/WithdrawalModal';

interface TransactionData {
  key: string;
  dateTime: string;
  narration: string;
  amount: string;
  balanceAfter: string;
  status: string;
  type: 'credit' | 'debit';
}

const data: TransactionData[] = [
  {
    key: '1',
    dateTime: 'Thur, 14/08 - 24 2:30pm',
    narration: 'Withdrawal',
    amount: '£50.00',
    status: 'Success',
    balanceAfter:'£30.00',
    type: 'debit',
  },
  {
    key: '2',
    dateTime: 'Thur, 14/08 - 24 2:30pm',
    narration: 'Referral',
    amount: '£10.00',
    status: 'Success',
    balanceAfter:'£100.00',
    type: 'credit',
  },
  {
    key: '3',
    dateTime: 'Thur, 14/08 - 24 2:30pm',
    narration: 'Withdrawal',
    amount: '£20.50',
    status: 'Success',
    balanceAfter:'£330.00',
    type: 'debit',
  },
  {
    key: '4',
    dateTime: 'Thur, 14/08 - 24 2:30pm',
    narration: 'Referral',
    amount: '£10.00',
    status: 'Success',
    balanceAfter:'£840.00',
    type: 'credit',
  },
  {
    key: '5',
    dateTime: 'Thur, 14/08 - 24 2:30pm',
    narration: 'Referral',
    amount: '£10.00',
    status: 'Success',
    balanceAfter:'£30.00',
    type: 'credit',
  },
  {
    key: '7',
    dateTime: 'Thur, 14/08 - 24 2:30pm',
    narration: 'Referral',
    amount: '£10.00',
    balanceAfter:'£230.00',
    status: 'Success',
    type: 'credit',
  },
  {
    key: '8',
    dateTime: 'Thur, 14/08 - 24 2:30pm',
    narration: 'Withdrawal',
    amount: '£20.50',
    status: 'Success',
    balanceAfter:'£330.00',
    type: 'debit',
  },
  {
    key: '9',
    dateTime: 'Thur, 14/08 - 24 2:30pm',
    narration: 'Referral',
    amount: '£10.00',
    status: 'Success',
    balanceAfter:'£840.00',
    type: 'credit',
  },
  {
    key: '10',
    dateTime: 'Thur, 14/08 - 24 2:30pm',
    narration: 'Referral',
    amount: '£10.00',
    status: 'Success',
    balanceAfter:'£30.00',
    type: 'credit',
  },
  {
    key: '11',
    dateTime: 'Thur, 14/08 - 24 2:30pm',
    narration: 'Referral',
    amount: '£10.00',
    balanceAfter:'£230.00',
    status: 'Success',
    type: 'credit',
  },
];

const RecentTransactions: FC = () => {
  const [withdrawalModalVisible, setWithdrawalModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleWithdrawalSubmit = (values: any) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Withdrawal submitted:', values);
      setLoading(false);
      setWithdrawalModalVisible(false);
      // You can add success notification here
    }, 2000);
  };

  const handleWithdrawalCancel = () => {
    setWithdrawalModalVisible(false);
  };

  const columns: ColumnsType<TransactionData> = [
    {
      title: 'Date & Time',
      dataIndex: 'dateTime',
      key: 'dateTime',
      render: (text, record) => (
        <div className="flex items-center space-x-2">
          {record.type === 'credit' ? (
            <FaArrowDown className="text-[#1F9854]!  text-lg bg-[#E6FAEE] h-8 w-8 p-2 rounded-full" />
          ) : (
          <FaArrowUp className="text-[#E5102E]!  text-lg bg-[#FEECEE] h-8 w-8 p-2 rounded-full" />
          )}
          <span className="text-[#667085] font-[500]!">{text}</span>
        </div>
      ),
      sorter: (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime(),
    },
    {
      title: 'Narration',
      dataIndex: 'narration',
      key: 'narration',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Balance After',
      dataIndex: 'balanceAfter',
      key: 'balanceAfter',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag className="rounded-full px-2 py-1 border-none! font-[500]! text-xs bg-[#ECFDF3]! text-[#1F9854]!">
          {status}
        </Tag>
      ),
    },
  ];

  const customEmpty = (
    <Empty
      image={<SearchOutlined style={{ fontSize: '48px', color: '#3b82f6' }} />}
      description={
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900 mb-2">No Transactions yet</div>
          <div className="text-gray-600">
            Your transactions will appear here once you have completed a transaction
          </div>
        </div>
      }
    />
  );

  return (
    <div className=" ">
      <Button 
        type="primary" 
        onClick={() => setWithdrawalModalVisible(true)}
        className="mb-4 bg-blue-600 hover:bg-blue-700 border-none"
      >
        Withdrawal
      </Button>
      <div className="p-4 border bg-[#FFFFFF] rounded-lg mb-3 border-[#EAEAEA]">
        <h3 className="text-md font-semibold text-[#667085]">Recent Transactions</h3>
      </div>
      <div className="border-[0.6px] bg-[#FFFFFF] rounded-lg mb-3 border-[#EAEAEA]">
        <Table
          columns={columns}
          dataSource={data}
          locale={{ emptyText: customEmpty }}
          size="small"
          className="custom-table text-[14px]"
          pagination={{
            pageSize: 8,
            showSizeChanger: false,
            showQuickJumper: false,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      </div>

      <WithdrawalModal
        visible={withdrawalModalVisible}
        onCancel={handleWithdrawalCancel}
        onSubmit={handleWithdrawalSubmit}
        loading={loading}
        availableBalance="£700.00"
      />
    </div>
  );
};

export default RecentTransactions;
