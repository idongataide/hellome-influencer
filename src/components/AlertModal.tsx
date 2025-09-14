import React from 'react';
import { Modal, Button } from 'antd';

interface AlertModalProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmText: string;
}

const AlertModal: React.FC<AlertModalProps> = ({
  visible,
  title,
  message,
  onClose,
  onConfirm,
  confirmText,
}) => {
  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={onConfirm}>
          {confirmText}
        </Button>,
      ]}
    >
      <p>{message}</p>
    </Modal>
  );
};

export default AlertModal;

