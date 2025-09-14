import { Table, Empty, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import type { FC } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { usePayouts } from '@/hooks/useAdmin';

interface TransactionData {
  key: string;
  dateTime: string;
  createdAt: string;
  narration: string;
  reference: string;
  amount: string;
  balanceAfter: string;
  status: string;
  type: 'credit' | 'debit';
}

const RecentTransactions: FC = () => {
  const { data: payouts } = usePayouts(1);
  const apiRows = payouts?.data || [];

  const mapped: TransactionData[] = apiRows.slice(0, 5).map((t: any) => {
    const createdAt = t.created_at;
    const date = new Date(createdAt);
    const dateTime = isNaN(date.getTime()) ? createdAt : date.toLocaleString('en-GB', {
      weekday: 'short', day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true
    });
    const formatCurrency = (v: string | number) => `£ ${Number(v).toFixed(2)}`;


    return {
      key: t.reference,
      createdAt,
      dateTime,
      reference: t.reference,
      amount: formatCurrency(t.amount),
      balanceAfter: formatCurrency(t.balance_after),
      status: t.status,
      type: t.type,
    };
  });

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
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
      key: 'reference',
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
      render: (status) => {
        let colorClasses = "";
    
        console.log(status,'sdsd');
        switch (status) {
          case "pending":
            colorClasses = "!bg-[#FEE2E2] !text-[#B91C1C]";
            break;
          case "paid":
            colorClasses = "!bg-[#ECFDF3] !text-[#1F9854]"; 
            break;
          default:
            colorClasses = "!bg-gray-100 !text-gray-600"; 
            break;
        }
    
        return (
          <Tag className={`rounded-full px-2 py-1 !border-none font-[500] text-xs ${colorClasses}`}>
            <span className="capitalize">{status}</span>
          </Tag>
        );
      },
    }
    
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
      <div className="p-4 border bg-[#FFFFFF] rounded-lg mb-3 border-[#EAEAEA]">
        <h3 className="text-md font-semibold text-[#667085]">Recent Transactions</h3>
      </div>
      <div className="border-[0.6px] bg-[#FFFFFF] rounded-lg mb-3 border-[#EAEAEA]">
        <Table
          columns={columns}
          dataSource={mapped}
          pagination={false}
          locale={{ emptyText: customEmpty }}
          size="small"
          className="custom-table text-[14px]"
        />
      </div>
    </div>
  );
};

export default RecentTransactions;
