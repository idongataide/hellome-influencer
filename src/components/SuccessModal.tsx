import React from 'react';
import { Modal, Button } from 'antd';
import success from '../../public/images/success.png';

interface SuccessModalProps {
  visible: boolean;
  amount: number;
  onViewDetails: () => void;
  onGoToDashboard: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  amount,
  onViewDetails,
  onGoToDashboard,
}) => {
  return (
    <Modal
      open={visible}
      footer={null}
      closable={false}
      centered
      className="success-modal !max-w-sm"
      >
      <div className="flex flex-col items-center justify-center">
        <img src={success} alt="success" className="w-24 h-24 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Withdraw successful</h2>
        <p className="text-gray-600 text-center mb-6">
          Your £{amount} withdrawal was completed successfully
        </p>
        <Button
          type="primary"
          onClick={onViewDetails}
          className="!px-10 !py-5 !rounded-full mb-3 h-12 text-lg"
        >
          View
        </Button>
        <Button type="link" onClick={onGoToDashboard} className="text-base">
          Go to dashboard
        </Button>
      </div>
    </Modal>
  );
};

export default SuccessModal;
