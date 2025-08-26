import React from 'react';
import { Button, Modal } from 'antd';

interface TwoFAModalProps {
    visible: boolean;
    onCancel: () => void;
    qrCodeSvg: string | null;
}

const TwoFAModal: React.FC<TwoFAModalProps> = ({
    visible,
    onCancel,
    qrCodeSvg,
}) => {

    return (
        <Modal
            title={<span className="text-[24px] text-center! font-semibold text-[#344054]">Turn on 2-Step Verification</span>}
            open={visible}
            onCancel={onCancel}
            footer={null}
            centered
        >
            <p className="text-center text-md text-[#344054] mb-4">Open authenticator and choose scan barcode</p>
            <div className="flex justify-center mb-6">
                {qrCodeSvg && <div dangerouslySetInnerHTML={{ __html: qrCodeSvg }} />}
            </div>  
            <Button
                type="primary"
                htmlType="submit"
                onClick={onCancel}
                className="h-[48px]! mb-4 w-full bg-primary text-end hover:bg-primary-dark text-white font-medium text-[16px]! rounded-full!"
            >
                Click here if you have already scanned the barcode
            </Button>  
        </Modal>
    );
};

export default TwoFAModal;
