
import React, { useState } from 'react';
import { Button, Modal, Input } from 'antd';

export interface TwoFAModalProps {
    visible: boolean;
    onCancel: (code?: string) => void;
    qrCodeSvg: string | null;
}


const TwoFAModal: React.FC<TwoFAModalProps> = ({
    visible,
    onCancel,
    qrCodeSvg,
}) => {
    const [showVerify, setShowVerify] = useState(false);
    const [code, setCode] = useState('');

    return (
        <Modal
            title={
                showVerify ? (
                    <span className="text-[24px] text-center! font-semibold text-[#344054]">Verify Authentication Code</span>
                ) : (
                    <span className="text-[24px] text-center! font-semibold text-[#344054]">Turn on 2-Step Verification</span>
                )
            }
            open={visible}
            onCancel={() => onCancel()}
            footer={null}
            centered
        >
            {showVerify ? (
                <>
                    <p className="text-center text-md text-[#344054] mb-4">Enter the 6-digit code in authenticator.</p>
                    <div className="flex justify-center mb-6 gap-2">
                        {[...Array(6)].map((_, i) => (
                            <Input
                                key={i}
                                maxLength={1}
                                style={{ width: 40, textAlign: 'center', fontSize: 24 }}
                                value={code[i] || ''}
                                onChange={e => {
                                    const val = e.target.value.replace(/[^0-9]/g, '');
                                    let newCode = code.split('');
                                    newCode[i] = val;
                                    setCode(newCode.join('').slice(0, 6));
                                }}
                            />
                        ))}
                    </div>
                    <Button
                        type="primary"
                        htmlType="submit"
                        disabled={code.length !== 6}
                        onClick={() => onCancel(code)}
                        className="h-[48px]! w-full bg-primary text-end hover:bg-primary-dark text-white font-medium text-[16px]! rounded-full!"
                    >
                        Complete 2-step verification
                    </Button>
                    <div className="text-center mt-4">
                        <span>Having trouble? <a href="#" className="text-blue-500">Chat with our team</a></span>
                    </div>
                </>
            ) : (
                <>
                    <p className="text-center text-md text-[#344054] mb-4">Open authenticator and choose scan barcode</p>
                    <div className="flex justify-center mb-6">
                        {qrCodeSvg && <div dangerouslySetInnerHTML={{ __html: qrCodeSvg }} />}
                    </div>
                    <Button
                        type="primary"
                        htmlType="submit"
                        onClick={() => setShowVerify(true)}
                        className="h-[48px]! mb-4 w-full bg-primary text-end hover:bg-primary-dark text-white font-medium text-[16px]! rounded-full!"
                    >
                        Continue
                    </Button>
                </>
            )}
        </Modal>
    );
};

export default TwoFAModal;
