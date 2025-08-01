"use client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Form, Input, Button, Checkbox } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import Images from "@/components/images";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { login } from "@/api/authAPI";
import { ResponseValue } from "@/interfaces/enums";
import toast, { Toaster } from "react-hot-toast";
import { setNavData } from "../common/setNavData";
import { useOnboardingStore } from "@/global/store";

const Signup = () => {
    const { setNavPath } = useOnboardingStore();
    const navPath = useOnboardingStore();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [keepSignedIn, setKeepSignedIn] = React.useState(false);

    const onFinish = (values: any) => {
        setLoading(true);
        const data = {
            email: values.email,
            password: values.password,
            remember: keepSignedIn
        };

        login(data)
            .then((res) => {
                if (res?.error) {
                    toast.error(res.message);
                    return;
                }
                if (res.status === ResponseValue.SUCCESS) {
                    toast.success('Login Successful');
                    setNavData(navPath, values.email, res);

                    localStorage.setItem(
                        "adminToken",
                        JSON.stringify({
                            access: res?.data?.token,
                        }),
                    );
                    navigate("/");               
                }  else {
                    const x = res?.response?.data?.msg
                    toast.error(x);
                }
            }).catch((error) => {
                toast.error(error.message || "An unexpected error occurred");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
      <div className="flex flex-col min-h-screen bg-[#FFFFFF]  d-flex justify-center items-center">
        <div className="flex flex-col items-start w-full max-w-3xl mx-auto py-10 px-10 bg-[#FFFFFF]">
            <Toaster position="top-center" />
            <Helmet>
                <meta charSet="utf-8" />
                <title>HelloMe: Sign up for an account</title>
                <link rel="canonical" href={`${URL}`} />
            </Helmet>
            
            {/* Logo */}
            <div className="flex justify-center w-full mb-8">
                <Link to="/login"> 
                      <img src={Images.logo} alt="HelloMe Logo" className="h-12" />
                </Link>
            </div>
               
            <Form
                name="signup"
                layout="vertical"
                onFinish={onFinish}
                className="w-full"
                initialValues={{ remember: true }}
            >
                {/* Two-column layout for personal details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                        label="Full Name"
                        name="fullName"
                        rules={[{ required: true, message: 'Please input your full name!' }]}
                        className="mb-0"
                    >
                        <Input 
                            placeholder="Enter your full name" 
                            className="h-12 border-gray-300 rounded-lg w-full" 
                        />
                    </Form.Item>

                    <Form.Item
                        label="Country"
                        name="country"
                        rules={[{ required: true, message: 'Please select your country!' }]}
                        className="mb-0"
                    >
                        <Input 
                            placeholder="United Kingdom" 
                            className="h-12 border-gray-300 rounded-lg w-full" 
                        />
                    </Form.Item>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                        className="mb-0"
                    >
                        <Input 
                            placeholder="Enter your email" 
                            className="h-12 border-gray-300 rounded-lg w-full" 
                        />
                    </Form.Item>

                    <Form.Item
                        label="Phone Number"
                        name="phone"
                        rules={[{ required: true, message: 'Please input your phone number!' }]}
                        className="mb-0"
                    >
                        <Input 
                            placeholder="GB 0000-0000-0000" 
                            className="h-12 border-gray-300 rounded-lg w-full" 
                        />
                    </Form.Item>
                </div>

                {/* Social media handles section */}
                <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2 text-[#036BDD]">Social Media Handles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            name="instagram"
                            className="mb-0"
                        >
                            <div className="flex items-center">
                                <Input 
                                    placeholder="username" 
                                    className="h-12 border-gray-300 rounded-lg flex-1" 
                                />
                            </div>
                        </Form.Item>

                        <Form.Item
                            name="twitter"
                            className="mb-0"
                        >
                            <div className="flex items-center">
                                <Input 
                                    placeholder="username" 
                                    className="h-12 border-gray-300 rounded-lg flex-1" 
                                />
                            </div>
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            name="facebook"
                            className="mb-0"
                        >
                            <div className="flex items-center">
                                <Input 
                                    placeholder="username" 
                                    className="h-12 border-gray-300 rounded-lg flex-1" 
                                />
                            </div>
                        </Form.Item>

                        <Form.Item
                            name="tiktok"
                            className="mb-0"
                        >
                            <div className="flex items-center">
                                <Input 
                                    placeholder="username" 
                                    className="h-12 border-gray-300 rounded-lg flex-1" 
                                />
                            </div>
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="audienceSite"
                        label="Enter audience site"
                        className="mt-4"
                    >
                        <Input 
                            placeholder="Enter your audience site" 
                            className="h-12 border-gray-300 rounded-lg" 
                        />
                    </Form.Item>
                </div>

                {/* Password section */}
                <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2 text-[#036BDD]">Password</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                        label="Create Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                        className="mb-0"
                    >
                        <Input.Password
                            placeholder="Enter password"
                            className="h-12 border-gray-300 rounded-lg w-full"
                            iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Confirm password"
                        name="confirmPassword"
                        rules={[{ required: true, message: 'Please confirm your password!' }]}
                        className="mb-0"
                    >
                        <Input.Password
                            placeholder="Confirm password"
                            className="h-12 border-gray-300 rounded-lg w-full"
                            iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>
                    </div>

                    <div className="flex items-center mb-6">
                        <Checkbox 
                            checked={keepSignedIn}
                            onChange={(e) => setKeepSignedIn(e.target.checked)}
                            className="text-gray-600"
                        >
                            By clicking begin, I accept the terms and conditions
                        </Checkbox>
                    </div>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            className="w-full h-[48px]! bg-primary hover:bg-primary-dark text-white font-medium text-base rounded-full!"
                        >
                            Sign up
                        </Button>
                    </Form.Item>
                </div>
            </Form>
        </div>
     </div>
    )
}

export default Signup;