import React, { useState } from 'react';
import { Table, Empty, Tag, Button, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import type { FC } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import WithdrawalModal from '../../../../components/WithdrawalModal';
import TwoFAModal from '../../../../components/TwoFAModal';
import AddBankAccountModal from '../../../../components/AddBankAccountModal';
import { usePayouts, useUser } from '@/hooks/useAdmin';
import { requestPayout } from '@/api/payoutApi';
import { get2FA, verify2FA } from '@/api/customersApi'; 
import toast from 'react-hot-toast';
import SuccessModal from '../../../../components/SuccessModal';
import LoadingModal from '@/components/LoadingModal';

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
interface AlertModalProps {
  visible: boolean;
  title: string;
  message: string;
  action: 'setup2fa' | 'addBankAccount';
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean; 
}

const AlertModal: FC<AlertModalProps> = ({
  visible,
  title,
  message,
  action,
  onCancel,
  onConfirm,
  loading = false 
}) => {
  return (
    <Modal
      title={
        <div className="text-center mt-8">
          <img src='/images/icons/warning.svg' className='h-14 w-14 mb-3 mx-auto' alt='icon'/>
          <span className="text-[22px] font-bold text-[#344054] block">{title}</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={400}
      centered
      className="alert-modal !py-14"
      closable={!loading} 
    >
      <div className="mb-6 text-center">
        <p className="text-[#475467]">{message}</p>
      </div>

      <div className="flex justify-center space-x-3">
        <Button 
          key="confirm" 
          type="primary" 
          onClick={onConfirm}
          className="h-[43px] bg-primary w-full !py-5 mb-6 !px-6 text-white font-medium text-base !rounded-full hover:bg-primary-dark"
          // disabled={loading}
          loading={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              {/* <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> */}
              Loading...
            </span>
          ) : (
            action === 'setup2fa' ? 'Setup 2FA' : 'Add Bank Account'
          )}
        </Button>
      </div>
    </Modal>
  );
};

const RecentTransactions: FC = () => {
  const [withdrawalModalVisible, setWithdrawalModalVisible] = React.useState(false);
  const [twoFAModalVisible, setTwoFAModalVisible] = React.useState(false);
  const [addBankAccountModalVisible, setAddBankAccountModalVisible] = React.useState(false);
  const [alertModalVisible, setAlertModalVisible] = React.useState(false);
  const [alertModalContent, setAlertModalContent] = React.useState<{ title: string; message: string; action: 'setup2fa' | 'addBankAccount' } | null>(null);
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);
  const [twoFAInitialMode, setTwoFAInitialMode] = useState<'setup' | 'verify'>('setup');
  const [qrCodeSvgForSetup, setQrCodeSvgForSetup] = useState<string | null>(null);
  const [manualCodeForSetup, setManualCodeForSetup] = useState<string>('');
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState(0);
  const { data: payouts, mutate : refresh, isLoading } = usePayouts(1);
  const { data: user, mutate } = useUser();
  const navigate = useNavigate();

  const apiRows = payouts?.data || [];


  const currencySymbol = {
    GBP: '£',
    NGN: '₦',
    EUR: '€',
    DKK: 'kr',
  };


  const mapped: TransactionData[] = apiRows.slice(0, 5).map((t: any) => {
    const createdAt = t.created_at;
    const date = new Date(createdAt);
    const dateTime = isNaN(date.getTime())
      ? createdAt
      : date.toLocaleString("en-GB", {
          weekday: "short",
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
  
    const formattedAmount = Number(t.amount).toLocaleString();
    const formattedBalance = Number(t.balance_after).toLocaleString();
  
    return {
      key: t.reference,
      createdAt,
      dateTime,
      reference: t.reference,
      amount: currencySymbol[t.currency as keyof typeof currencySymbol] + " " + formattedAmount,
      balanceAfter: currencySymbol[t.currency as keyof typeof currencySymbol] + " " + formattedBalance,
      status: t.status,
      type: t.type,
    };
  });
  

  const handle2FAVerification = (code?: string) => {
    if (code && code.length === 6) {
      const data = { one_time_password: code };
      return verify2FA(data) 
        .then((res) => {
          if (res?.error) {
            toast.error(res.message);
          } else if (res.success === true) {
            setTwoFAModalVisible(false);
            toast.success("2FA enabled successfully!");
            mutate(); 
          } else {
            toast.error(res?.response?.data?.message || "An unexpected error occurred");
          }
        })
        .finally(() => {
          setQrCodeSvgForSetup(null);
          setManualCodeForSetup('');
        });
    } else {
      toast.error("2FA verification cancelled or code is invalid.");
      setQrCodeSvgForSetup(null);
      setManualCodeForSetup('');
    }
  };

  const handleWithdrawalSubmit = async (values: any, otp: string) => {
    
    if (!otp) {
      toast.error("2FA code is required for withdrawal.");
      setWithdrawalLoading(false);
      return;
    }
    setWithdrawalLoading(true);
    try {
      const response = await requestPayout({
        amount: values.amount,
        narration: values.narration,
        one_time_password: otp as string,
      });
      if (response?.success === true) {
        toast.success(response?.data?.message || "Payout requested successfully!");
        setWithdrawalModalVisible(false);
        setWithdrawalAmount(values.amount); 
        setIsSuccessModalVisible(true);
        mutate(); 
      } else {
        toast.error(response?.response?.data?.message || "Payout request failed.");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setWithdrawalLoading(false);
    }
  };

  const handleWithdrawalCancel = () => {
    setWithdrawalModalVisible(false);
  };

  const handleViewDetails = () => {
    refresh()
    setIsSuccessModalVisible(false);
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
    setIsSuccessModalVisible(false);
  };

  const handleWithdrawalClick = () => {
    if (!user?.two_fa_enabled) {
      setAlertModalContent({
        title: "Setup 2FA Authenticator",
        message: "Protect your account with an authenticator before adding your bank account details",
        action: 'setup2fa',
      });
      setAlertModalVisible(true);
    } else if (!user?.bank_account) {
      setAlertModalContent({
        title: "Add Bank Account",
        message: "Please add your bank account details to proceed with withdrawals.",
        action: 'addBankAccount',
      });
      setAlertModalVisible(true);
    } else {
      setWithdrawalModalVisible(true);
    }
  };

  const handleTwoFAModalClose = () => {
    setTwoFAModalVisible(false);
    setQrCodeSvgForSetup(null); 
    setManualCodeForSetup(''); 
    if (twoFAInitialMode === 'verify') {
        setWithdrawalModalVisible(false);
    }
  };

  const handleAddBankAccountModalClose = () => {
    setAddBankAccountModalVisible(false);
  };
  const [twoFASetupLoading, setTwoFASetupLoading] = React.useState(false);

  const handleAlertModalConfirm = () => {
    if (alertModalContent?.action === 'setup2fa') {
      setTwoFASetupLoading(true); // Start loading
      
      get2FA().then((res: any) => {
        if (res.success === true) {
          setQrCodeSvgForSetup(res.data.qr);
          setManualCodeForSetup(res.data.code);
          setTwoFAModalVisible(true);
          setTwoFAInitialMode('setup');
        } else {
          toast.error(res?.response?.data?.msg || "Failed to fetch 2FA data.");
        }
      }).catch((error: any) => {
        toast.error(error.message || "An unexpected error occurred while fetching 2FA data.");
      }).finally(() => {
        setTwoFASetupLoading(false); 
        setAlertModalVisible(false); 
      });
    } else if (alertModalContent?.action === 'addBankAccount') {
      setAlertModalVisible(false);
      setAddBankAccountModalVisible(true);
    }
  };


  const handleAlertModalCancel = () => {
    setAlertModalVisible(false);
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
      <Button 
        type="primary" 
        onClick={handleWithdrawalClick}
        className="mb-4 bg-blue-600 !rounded-full !px-10 !py-6 hover:bg-blue-700 border-none"
      >
        Withdrawal
      </Button>
      <div className="p-4 border bg-[#FFFFFF] rounded-lg mb-3 border-[#EAEAEA]">
        <h3 className="text-md font-semibold text-[#667085]">Recent Transactions</h3>
      </div>
      <div className="border-[0.6px] bg-[#FFFFFF] rounded-lg mb-3 border-[#EAEAEA]">
        <Table
          columns={columns}
          dataSource={mapped}
          locale={{ emptyText: customEmpty }}
          size="small"
          className="custom-table text-[14px]"
          pagination={{
            pageSize: payouts?.per_page || 10,
            showSizeChanger: false,
            showQuickJumper: false,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
          loading={isLoading}
        />
      </div>

      <WithdrawalModal
        visible={withdrawalModalVisible}
        onCancel={handleWithdrawalCancel}
        onSubmit={handleWithdrawalSubmit}
        loading={withdrawalLoading}
      />

      
      {user && !user.two_fa_enabled && (
        <TwoFAModal
          visible={twoFAModalVisible}
          onClose={handleTwoFAModalClose}
          onVerify={handle2FAVerification} 
          mode={twoFAInitialMode}
          qrCodeSvg={qrCodeSvgForSetup}
          manualCode={manualCodeForSetup}
        />
      )}

      {user && (!user.bank_account || Object.keys(user.bank_account).length === 0) && (
        <AddBankAccountModal
          visible={addBankAccountModalVisible}
          onCancel={handleAddBankAccountModalClose}
          onAddAccount={() => setAddBankAccountModalVisible(false)} 
          loading={false} 
        />
      )}

      {alertModalContent && (
        <AlertModal
          visible={alertModalVisible}
          title={alertModalContent.title}
          message={alertModalContent.message}
          action={alertModalContent.action}
          onCancel={handleAlertModalCancel}
          onConfirm={handleAlertModalConfirm}
          loading={twoFASetupLoading}
        />
      )}
      <SuccessModal
        visible={isSuccessModalVisible}
        amount={withdrawalAmount}
        onViewDetails={handleViewDetails}
        onGoToDashboard={handleGoToDashboard}
      />
      <LoadingModal visible={withdrawalLoading} />

    </div>
  );
};

export default RecentTransactions;