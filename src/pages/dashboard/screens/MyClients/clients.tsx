import React from 'react';
import { Table, Empty, Tag, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import type { FC } from 'react';

interface CustomerData {
  key: string;
  name: string;
  type: 'Individual' | 'Business';
  dateTime: string;
}

const data: CustomerData[] = [
  {
    key: '1',
    name: 'Oscar Adetona',
    type: 'Individual',
    dateTime: 'Thur, 14/08/24 2:30pm',
  },
  {
    key: '2',
    name: 'Edgeplus',
    type: 'Business',
    dateTime: 'Thur, 14/08/24 2:30pm',
  },
  {
    key: '3',
    name: 'Aarob Contrusctions',
    type: 'Business',
    dateTime: 'Thur, 14/08/24 2:30pm',
  },
  {
    key: '4',
    name: 'Musa Garki',
    type: 'Individual',
    dateTime: 'Thur, 14/08/24 2:30pm',
  },
  {
    key: '5',
    name: 'Roy Crambell',
    type: 'Individual',
    dateTime: 'Thur, 14/08/24 2:30pm',
  },
  {
    key: '6',
    name: 'Feyl Ayobami',
    type: 'Business',
    dateTime: 'Thur, 14/08/24 2:30pm',
  },
];

const CustomerList: FC = () => {
  const columns: ColumnsType<CustomerData> = [
    {
      title: 'S/N',
      dataIndex: 'key',
      key: 'key',
      render: (text) => <span className="text-[#667085] font-[500]">{text}</span>,
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
    </div>
  );
};

export default CustomerList;