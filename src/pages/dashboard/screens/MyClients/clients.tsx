import { Table, Empty } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import type { FC } from 'react';
import React from 'react';
import { useReferrals } from '@/hooks/useAdmin';

interface CustomerData {
  key: string;
  name: string;
  type: 'Individual' | 'Business';
  dateTime: string;
}

const CustomerList: FC = () => {
  const [page, setPage] = React.useState(1);
  const { data: referrals } = useReferrals(page);
  const rows = referrals?.data || [];

  console.log(referrals,'referralss');

  const mapped: CustomerData[] = rows.map((r: any, index: number) => {
    const name = r.name || [r.first_name, r.last_name].filter(Boolean).join(' ') || r.email || 'Unknown';
    const type = (r.type || r.account_type || 'Individual') as 'Individual' | 'Business';
    const d = new Date(r.created_at || r.createdAt || '');
    const dateTime = isNaN(d.getTime()) ? (r.created_at || '') : d.toLocaleString('en-GB');
    return {
      key: String(r.id || r.uuid || r.reference || `${name}-${index}`),
      name,
      type: type === 'Business' ? 'Business' : 'Individual',
      dateTime,
    };
  });

  const columns: ColumnsType<CustomerData> = [
    {
      title: 'S/N',
      dataIndex: 'key',
      key: 'key',
      render: (_text, _record, idx) => <span className="text-[#667085] font-[500]">{(page - 1) * (referrals?.per_page || 10) + idx + 1}</span>,
    },
    {
      title: 'Names',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span className="text-[#667085] font-[500]">{text}</span>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <span 
          className={`rounded-full px-2 py-1 border-none font-[500] text-xs ${
            type === 'Individual' ? 'bg-[#ECFDF3] text-[#1F9854]' : 'bg-[#EEF2F8] text-[#3842A0]'
          }`}
        >
          {type}
        </span>
      ),
    },
    {
      title: 'Date & Time',
      dataIndex: 'dateTime',
      key: 'dateTime',
      render: (text) => <span className="text-[#667085] font-[500]">{text}</span>,
      sorter: (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime(),
    },
  ];

  const customEmpty = (
    <Empty
      image={<SearchOutlined style={{ fontSize: '48px', color: '#3b82f6' }} />}
      description={
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900 mb-2">No Customers yet</div>
          <div className="text-gray-600">
            Your customers will appear here once they register
          </div>
        </div>
      }
    />
  );

  return (
    <div className="">
      <div className="p-4 border bg-[#FFFFFF] rounded-lg mb-3 border-[#EAEAEA]">
        <h3 className="text-md font-semibold text-[#667085]">Customer List</h3>
      </div>
      <div className="border-[0.6px] bg-[#FFFFFF] rounded-lg mb-3 border-[#EAEAEA]">
        <Table
          columns={columns}
          dataSource={mapped}
          locale={{ emptyText: customEmpty }}
          size="small"
          className="custom-table text-[14px]"
          pagination={{
            current: page,
            pageSize: referrals?.per_page || 10,
            total: referrals?.total || mapped.length,
            showSizeChanger: false,
            showQuickJumper: false,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            onChange: (p) => setPage(p),
          }}
        />
      </div>
    </div>
  );
};

export default CustomerList;