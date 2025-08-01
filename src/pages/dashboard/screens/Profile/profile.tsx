import React from "react";
import { Form, Input, Button, Card } from "antd";

const ProfilePage: React.FC = () => {
  return (
    <div className="min-h-[500px] flex flex-col lg:flex-row gap-6">
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
                <Input value="Saito Akintona" disabled />
              </Form.Item>
              <Form.Item label="E-mail">
                <Input value="saitoweezy@gmail.com" disabled />
              </Form.Item>
              <Form.Item label="Phone Number">
                <Input value="+44 131 2345 678" disabled />
              </Form.Item>
              <Form.Item label="Refcode">
                <Input value="SAITAMA" disabled />
              </Form.Item>
            </div>
          </Form>
        </Card>
      </div>

      {/* Right Section - Change Password */}
      <div className="w-full lg:w-1/3 h-full">
        <Card
          title={<span className="text-lg font-semibold text-[#0B2447]">Change Password</span>}
          bordered={false}
          className="shadow-md"
        >
          <Form layout="vertical">
            <Form.Item label="Current Password" name="currentPassword">
              <Input.Password placeholder="Current Password" />
            </Form.Item>
            <Form.Item label="New Password" name="newPassword">
              <Input.Password placeholder="New Password" />
            </Form.Item>
            <Form.Item label="Confirm Password" name="confirmPassword">
              <Input.Password placeholder="Confirm Password" />
            </Form.Item>
            <Form.Item className="flex justify-end mb-0!">
                <Button
                    type="primary"
                    htmlType="submit"
                    className="h-[48px]! bg-primary text-end hover:bg-primary-dark text-white font-medium text-base rounded-full!"
                >
                    Update Password
                </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
