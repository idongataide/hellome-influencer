import React from "react";
import { Modal, Button } from "antd";
import { useOnboardingStore } from "../global/store";
import { useNavigate } from "react-router-dom";

interface LogoutConfirmationModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({
  isVisible,
  onClose,
}) => {
  const navigate = useNavigate();

  const handleConfirmLogout = () => {
    useOnboardingStore.persist.clearStorage();
    localStorage.clear();
    sessionStorage.clear();
    useOnboardingStore.setState({
      token: null,
      isAuthorized: false,
      firstName: "",
      lastName: "",
    });
    navigate("/login");
    onClose();
  };

  return (
    <Modal
      title={<span className="text-[22px] text-center! font-bold text-[#344054]">Confirm Logout</span>}
      open={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          No
        </Button>,
        <Button key="submit" type="primary" onClick={handleConfirmLogout}>
          Yes
        </Button>,
      ]}
    >
      <p className="text-md">Are you sure you want to log out?</p>
    </Modal>
  );
};

export default LogoutConfirmationModal;
