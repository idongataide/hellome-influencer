import React, { useState } from 'react';
import { Button, Modal, Input, Form } from 'antd';
import { FaCopy } from 'react-icons/fa';

export interface TwoFAModalProps {
    visible: boolean;
    onVerify?: (code?: string) => void; // Rename to onVerify for clarity
    onClose: () => void; 
    onSetupComplete?: () => void; 
    qrCodeSvg: string | null;
    manualCode: string;
    mode: 'setup' | 'verify'; 
}

const TwoFAModal: React.FC<TwoFAModalProps> = ({
    visible,
    onVerify, 
    onClose,
    qrCodeSvg,
    manualCode,
    mode,
}) => {
    const [showVerify, setShowVerify] = useState(mode === 'verify');
    const [form] = Form.useForm();
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    // Reset state when modal closes
    React.useEffect(() => {
        if (!visible) {
            setShowVerify(mode === 'verify');
            setCode('');
            form.resetFields();
        }
    }, [visible, mode, form]);

    const handleVerify = async () => {
        form.validateFields().then(async values => {
            if (onVerify) {
                setLoading(true); 
                await onVerify(values.otp);
                setLoading(false);
            }
        });
    };

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
            onCancel={onClose}
            footer={null}
            centered
            className='!py-10'
        >
            {showVerify ? (
                <>
                    <p className="text-center text-md text-[#344054] mb-4">Enter the 6-digit code from your authenticator app.</p>
                    
                    <Form
                        form={form}
                        onFinish={handleVerify}
                        className="flex flex-col items-center"
                    >
                        <Form.Item
                            name="otp"
                            rules={[
                                { required: true, message: 'Please enter OTP' },
                                { pattern: /^\d{6}$/, message: 'Please enter a valid 6-digit OTP' }
                            ]}
                        >
                            <Input.OTP 
                                length={6} 
                                formatter={(str) => str.toUpperCase()}
                                className="justify-center"
                                onChange={setCode}
                            />
                        </Form.Item>
                        
                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled={code.length !== 6}
                            loading={loading} 
                            className="h-[48px]! w-full bg-primary text-end hover:bg-primary-dark text-white font-medium text-[16px]! rounded-full! mt-4"
                        >
                            Complete 2-step verification
                        </Button>
                    </Form>
                    
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
                        onClick={() => {
                            setShowVerify(true);
                        }}
                        className="h-[48px]! mb-4 w-full bg-primary text-end hover:bg-primary-dark text-white font-medium text-[16px]! rounded-full!"
                    >
                        Continue
                    </Button>
                    <p className="text-center text-md text-[#344054] mb-4">OR enter the code manually</p>
                    <div className="flex justify-center mb-6">
                         <div className='text-[#344054] mb-0 flex items-center justify-between rounded-lg w-[100%] text-[14px]  px-3 py-2 border border-[#E0E3E5] text-left'>
                            {manualCode.match(/.{1,3}/g)?.join('-')}
                          <span className='mb-0 cursor-pointer' onClick={() => navigator.clipboard.writeText(manualCode)}>  {<FaCopy />} </span>
                         </div>
                    </div>
                </>
            )}
        </Modal>
    );
};

export default TwoFAModal;