import { FC } from "react";
import { Modal, Spin } from "antd";

interface LoadingModalProps {
  visible: boolean;
}

const LoadingModal: FC<LoadingModalProps> = ({ visible }) => {
  return (
    <Modal
      open={visible}
      footer={null}
      closable={false}
      centered
      maskClosable={false}
      width={120}
      height={120}
      className="loading-modal"
    >
      <div className="flex flex-col items-center justify-center py-2">
        <Spin size="large" />
        <p className="mt-3 text-gray-600 text-sm">Processing...</p>
      </div>
    </Modal>
  );
};

export default LoadingModal;
