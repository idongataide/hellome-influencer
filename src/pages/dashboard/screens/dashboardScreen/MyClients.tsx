import React from 'react';
import { Table, Avatar } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface ClientData {
  key: string;
  name: string;
  initials: string;
  date: string;
}

const MyClients: React.FC = () => {
  const data: ClientData[] = [
    {
      key: '1',
      name: 'David Bako',
      initials: 'DB',
      date: '21/06/2025',
    },
    {
      key: '2',
      name: 'Niyi Adetoro',
      initials: 'NA',
      date: '18/06/2025',
    },
    {
      key: '3',
      name: 'Adekemi Akintona',
      initials: 'AA',
      date: '02/06/2025',
    },
    {
      key: '4',
      name: 'Niyi Adetoro',
      initials: 'NA',
      date: '30/05/2025',
    },
  ];

  const columns: ColumnsType<ClientData> = [
    {
      title: 'Client',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div className="flex items-center gap-3">
          <Avatar 
            style={{ 
              backgroundColor: '#031730',
              color: 'white',
              fontWeight: 'normal'
            }}
          >
            {record.initials}
          </Avatar>
          <span className="font-normal! text-[#475467]">{name}</span>
        </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => (
        <span className="text-gray-600">{date}</span>
      ),
    },
  ];

  return (
    <div className="bg-[#F2F4F7] rounded-lg ">
      <div className="p-4">
        <h3 className="text-lg font-normal text-[#05244C]">My Clients</h3>
      </div>
      <div className="p-4 pt-0">
        <Table 
          columns={columns} 
          dataSource={data} 
          pagination={false}
          size="small"
          className="custom-table border-none! bg-[#F2F4F7]!"
        />
      </div>
    </div>
  );
};

export default MyClients; 