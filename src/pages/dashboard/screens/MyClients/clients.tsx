import { Table, Empty, Avatar } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import { useReferrals } from '@/hooks/useAdmin';
import { useState } from 'react';

interface ClientData {
  key: string;
  name: string;
  initials: string;
  date: string;
  country: {
    country: string;
    iso: string;
  };
  earned: string;
}

const CustomerList: React.FC = () => {
  const { data: referrals } = useReferrals(1);
  const rows = referrals?.data || [];
  const [page, setPage] = useState(1);

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
      country: t.country || { country: 'Unknown', iso: 'xx' },
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
            alt={`${country.country} flag`}
            className="h-6 w-6 object-cover rounded-full"
          />
          <span className="text-gray-700">{country.country}</span>
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
            current: page,
            pageSize: referrals?.per_page || 10,
            total: referrals?.total || data.length,
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