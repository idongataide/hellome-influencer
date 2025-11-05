import React from 'react';
import { Table, Avatar, Spin } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useReferrals } from '@/hooks/useAdmin';

interface ClientData {
  key: string;
  name: string;
  initials: string;
  date: string;
  country: {
    name: string;
    iso: string;
  };
  earned: string;
}

const MyClients: React.FC = () => {
  const { data: referrals, isLoading } = useReferrals(1); 
  const rows = referrals?.data || [];

  const computeInitials = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'NA';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso || '';
    return d.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const data: ClientData[] = rows.slice(0, 6).map((t: any, idx: number) => {
    const name =
      t.name ||
      [t.first_name, t.last_name].filter(Boolean).join(' ') ||
      t.email ||
      'Unknown';
    const initials = computeInitials(name);
    const date = formatDate(t.created_at || t.createdAt || '');
    const key = String(
      t.id || t.uuid || t.reference || `${name}-${t.created_at || idx}`
    );
    return {
      key,
      name,
      initials,
      date,
      country: t.country || { name: 'Unknown', iso: 'xx' },
      earned: t.earned || '0',
    };
  });

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
              fontWeight: 'normal',
            }}
          >
            {record.initials}
          </Avatar>
          <span className="font-normal! text-[#475467]">{name}</span>
        </div>
      ),
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      render: (country) => (
        <div className="flex items-center gap-2">
          <img
            src={`images/all-flags/${country.iso.toLowerCase()}.svg`}
            alt={`${country.name} flag`}
            className="h-6 w-6 object-cover rounded-full"
          />
          <span className="text-gray-700">{country.name}</span>
        </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => <span className="text-gray-600">{date}</span>,
    },
    {
      title: 'Amount Earned',
      dataIndex: 'earned',
      key: 'earned',
      render: (earned) => (
        <span className="font-medium text-[#05244C]">{earned}</span>
      ),
    },
  ];

  return (
    <div className="bg-[#F2F4F7] rounded-lg">
      <div className="p-4">
        <h3 className="text-lg font-normal text-[#05244C]">My Clients</h3>
      </div>
      <div className="p-4 pt-0">
        <Spin spinning={isLoading}>
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            size="small"
            className="custom-table border-none! bg-[#F2F4F7]!"
          />
        </Spin>
      </div>
    </div>
  );
};

export default MyClients;
