import React, { useState } from "react";
import { Form, Input, Button, Card, Spin } from "antd";
import { useUser } from "@/hooks/useAdmin";
import  { get2FA, updatePassword, verify2FA } from '@/api/customersApi';
import TwoFAModal from "../../../../components/TwoFAModal";
import toast from "react-hot-toast";

const ProfilePage: React.FC = () => {
  const { data: user, mutate, isLoading } = useUser(); 

  // Extract user data
  const fullName = user ? `${user.first_name} ${user.last_name}` : 'N/A';
  const email = user?.email || 'N/A';
  const phone = user?.profile?.phone || 'N/A';
  const referralCode = user?.profile?.referral_code?.code || 'N/A';
  const [is2faModalVisible, setIs2faModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrCodeSvg, setQrCodeSvg] = useState<string | null>(null);
  const [isMutating, setIsMutating] = useState(false);

  const [passwordForm] = Form.useForm();

  const onFinish = () => {
    setLoading(true);
    get2FA()
        .then((res) => {
            if (res?.error) {
                toast.error(res.message);
                return;
            }
            if (res.success === true) {
                setQrCodeSvg(res.data);
                setIs2faModalVisible(true);
            }  else {
                toast.error(res?.response?.data?.msg || "An unexpected error occurred");
            }
        }).catch((error) => {
            toast.error(error.message || "An unexpected error occurred");
        })
        .finally(() => {
            setLoading(false);
        });
  };

  const handleUpdatePassword = async (values: any) => {
    setLoading(true);
    try {
      const res = await updatePassword({
        current_password: values.currentPassword,
        password: values.newPassword,
        password_confirmation: values.confirmPassword,
      });
      if (res?.error) {
        toast.error(res.message);
      } else if (res.success === true) {
        toast.success("Password updated successfully!");
        passwordForm.resetFields(); 
      } else {
        toast.error(res?.response?.data?.msg || "An unexpected error occurred");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel2FAModal = () => {
    setIs2faModalVisible(false);
    setIsMutating(true);
    verify2FA()
      .finally(() => {
        mutate().finally(() => {
          setIsMutating(false);
        });
        setQrCodeSvg(null);
      });
  };

  return (
    <div className="min-h-[500px] flex flex-col lg:flex-row gap-6">
      {/* Right Section - Change Password */}
      <div className="w-full lg:w-1/3 h-full">
        <Card
          title={<span className="text-lg font-semibold text-[#0B2447]">Change Password</span>}
          bordered={false}
          className="shadow-md"
        >
          <Form layout="vertical" form={passwordForm} onFinish={handleUpdatePassword}> {/* Add form and onFinish handler */}
            <Form.Item label="Current Password" name="currentPassword" rules={[{ required: true, message: 'Please input your current password!' }]}>
              <Input.Password placeholder="Current Password" />
            </Form.Item>
            <Form.Item label="New Password" name="newPassword" rules={[{ required: true, message: 'Please input your new password!' }]}>
              <Input.Password placeholder="New Password" />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={['newPassword']}
              hasFeedback
              rules={[
                { required: true, message: 'Please confirm your new password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm Password" />
            </Form.Item>
            <Form.Item className="flex justify-end mb-0!">
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading} // Add loading state to the button
                    className="h-[48px]! bg-primary text-end hover:bg-primary-dark text-white font-medium text-base rounded-full!"
                >
                    Update Password
                </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>

      {/* Left Section - Personal Information */}
      <div className="w-full lg:w-2/3 h-full">
        <Card
          title={<span className="text-lg font-semibold text-[#0B2447]">Personal Information</span>}
          bordered={false}
          className="shadow-md h-full"
        >
          <Form layout="vertical">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item label="Full Name">
                <Input value={fullName} disabled />
              </Form.Item>
              <Form.Item label="E-mail">
                <Input value={email} disabled />
              </Form.Item>
              <Form.Item label="Phone Number">
                <Input value={phone} disabled />
              </Form.Item>
              <Form.Item label="Refcode">
                <Input value={referralCode} disabled />
              </Form.Item>
            </div>
          </Form>
        </Card>
        
        {isLoading || isMutating ? ( 
          <div className="flex justify-center items-center my-4">
            <Spin />
          </div>
        ) : (
          // Only show the button if 2FA is not enabled
          !user?.two_fa_enabled && (
            <Button
              type="primary"
              onClick={onFinish}
              loading={loading}
              htmlType="submit"
              className="h-[48px]! w-full mb-4 bg-primary text-end hover:bg-primary-dark text-white font-medium text-base rounded-full!"
            >
              Add 2FA Authenticator
            </Button>
          )
        )}
        
        <Button
          type="primary"
          htmlType="submit"
          className="h-[48px]! w-full bg-primary text-end hover:bg-primary-dark text-white font-medium text-base rounded-full!"
        >
          Add Account
        </Button>
      </div>  
      
      <TwoFAModal
        visible={is2faModalVisible}
        onCancel={handleCancel2FAModal}
        qrCodeSvg={qrCodeSvg}          
      />  
    </div>
  );
};

export default ProfilePage;