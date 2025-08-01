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

const Login = () => {
    const { setNavPath } = useOnboardingStore();
    const navPath = useOnboardingStore();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [keepSignedIn, setKeepSignedIn] = React.useState(false);

    const onFinish = (values: any) => {
        setLoading(true);

        return navigate("/home");
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
      <div className="flex flex-col min-h-screen bg-image-login d-flex justify-center items-center">
        <div className="flex flex-col items-start w-full max-w-md mx-auto py-10 px-10  bg-[#F9FAFB] rounded-2xl shadow-sm">
            <Toaster position="top-center" />
            <Helmet>
                <meta charSet="utf-8" />
                <title>HelloMe: Sign in to your account</title>
                <link rel="canonical" href={`${URL}`} />
            </Helmet>
            
            {/* Logo */}
            <div className="flex justify-center w-full mb-8">
                <img src={Images.logo} alt="HealR Logo" className="h-12" />
            </div>
            
            {/* Welcome Text */}
            <div className="mb-8 text-left w-full">
                <h2 className="text-3xl font-bold text-[#344054] mb-2">Welcome Back!</h2>
                <p className="text-base text-[#475467]">Enter your login details</p>
            </div>
            
            <Form
                name="login"
                layout="vertical"
                onFinish={onFinish}
                className="w-full"
                initialValues={{ remember: true }}
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Please input your email!' },
                        { type: 'email', message: 'Please enter a valid email!' }
                    ]}
                >
                    <Input 
                        placeholder="johndoe@xyz.com" 
                        className="h-12 border-gray-300 rounded-lg" 
                    />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password
                        placeholder="••••••••"
                        className="h-12 border-gray-300 rounded-lg"
                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                </Form.Item>              

                <div className="flex items-center justify-between mb-6">
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <div className="flex items-center gap-2">
                            Dont have an account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
                        </div>
                    </Form.Item>
                    <Link 
                        to="/login/forgot-password" 
                        onClick={() => { setNavPath("forgot-password"); }}
                        className="text-sm text-primary hover:underline"
                    >
                        Forgot password?
                    </Link>
                </div>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="w-full h-[48px]! bg-primary hover:bg-primary-dark text-white font-medium text-base rounded-full!"
                    >
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </div>
     </div>
    )
}

export default Login;