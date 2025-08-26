"use client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Form, Input, Button, Checkbox, Select } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import Images from "@/components/images";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { signup } from "@/api/authAPI";
import { ResponseValue } from "@/interfaces/enums";
import toast, { Toaster } from "react-hot-toast";
import { setNavData } from "../common/setNavData";
import { useOnboardingStore } from "@/global/store";
import { useCountries } from "@/hooks/useCountries";

const Signup = () => {
    // const { setNavPath } = useOnboardingStore();
    const navPath = useOnboardingStore();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [keepSignedIn, setKeepSignedIn] = React.useState(false);

    const { countries, loading: countriesLoading } = useCountries();

    const buildSocialUrls = (values: any): string[] => {
        const sanitizeHandle = (input?: string) => {
            if (!input) return "";
            let handle = String(input).trim();
            handle = handle.replace(/^https?:\/\//i, "");
            handle = handle.replace(/^www\./i, "");
            handle = handle.replace(/^([a-zA-Z]+\.(?:com|net|org|io|co))\//i, "");
            handle = handle.replace(/^@/, "");
            return handle;
        };
        const pairs: Array<[string, string | undefined]> = [
            ["facebook.com", values.facebook],
            ["twitter.com", values.twitter],
            ["instagram.com", values.instagram],
            ["tiktok.com", values.tiktok],
            ["thread.com", values.thread],
        ];
        return pairs
            .map(([domain, handle]) => ({ domain, handle: sanitizeHandle(handle) }))
            .filter((x) => x.handle)
            .map((x) => `https://${x.domain}/${x.handle}`);
    };

    const onFinish = (values: any) => {
        setLoading(true);
        
        // Create the payload structure as expected by the API
        const selected = countries.find((c) => c.iso === values.country);
        const payload = {
            first_name: values.fullName?.split(' ')[0] || values.fullName,
            last_name: values.fullName?.split(' ').slice(1).join(' ') || '',
            email: values.email,
            country: selected ? { iso: selected.iso, currency: selected.currency } : undefined,
            phone: values.phone,
            password: values.password,
            password_confirmation: values.confirmPassword,
            social_media_handles: buildSocialUrls(values),
            audience_size: (values.audienceSite ? String(values.audienceSite) : "0").replace(/\D/g, "")
        };

        signup(payload)
            .then((res) => {
                if (res?.error) {
                    const handled = (() => {
                        const data = res?.data || res?.response?.data || res;
                        const errors = data?.errors;
                        if (errors && typeof errors === 'object') {
                            Object.keys(errors).forEach((key) => {
                                const arr = (errors as any)[key];
                                if (Array.isArray(arr)) arr.forEach((msg) => toast.error(String(msg)));
                            });
                            return true;
                        }
                        return false;
                    })();
                    if (!handled) toast.error(res.message || "An error occurred");
                    return;
                }
                if (res.success === true) {
                    toast.success('Signup Successful');
                    setNavData(navPath, values.email, res);
                    localStorage.setItem(
                        "adminToken",
                        JSON.stringify({
                            access: res?.data?.token,
                        }),
                    );
                    navigate("/review");               
                }  else {
                    console.log(res);
                    const data = res?.response?.data || res?.data || res;
                    const errors = data?.errors;
                    let shown = false;
                    if (errors && typeof errors === 'object') {
                        Object.keys(errors).forEach((key) => {
                            const arr = (errors as any)[key];
                            if (Array.isArray(arr)) {
                                arr.forEach((msg) => toast.error(String(msg)));
                                shown = true;
                            }
                        });
                    }
                    if (!shown) {
                        const x = data?.message || data?.msg;
                        if (x) toast.error(x); else toast.error("An error occurred");
                    }
                }
            }).catch((error) => {
                const data = error?.response?.data || error?.data || error;
                const errors = data?.errors;
                let shown = false;
                if (errors && typeof errors === 'object') {
                    Object.keys(errors).forEach((key) => {
                        const arr = (errors as any)[key];
                        if (Array.isArray(arr)) {
                            arr.forEach((msg) => toast.error(String(msg)));
                            shown = true;
                        }
                    });
                }
                if (!shown) toast.error(data?.message || error?.message || "An unexpected error occurred");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
      <div className="flex flex-col min-h-screen bg-[#FFFFFF] py-10  d-flex justify-center items-center">
        <div className="flex flex-col items-start w-full max-w-3xl mx-auto py-10 px-10 bg-[#FFFFFF]">
            <Toaster position="top-center" />
            <Helmet>
                <meta charSet="utf-8" />
                <title>HelloMe: Sign up for an account</title>
                <link rel="canonical" href={`${URL}`} />
            </Helmet>
            
            {/* Logo */}
            <div className="flex justify-center w-full mb-15">
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
             <div className="mb-[40px]">
              <h3 className="text-lg font-[400] mb-2 text-[#036BDD]">Personal Information</h3>
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
                        <Select
                            placeholder="Select your country"
                            loading={countriesLoading}
                            options={countries.map((c) => ({ label: `${c.country} (${c.currency})`, value: c.iso }))}
                            className="h-[43px]! w-full"
                            showSearch
                            filterOption={(input, option) => {
                                const label = typeof option?.label === 'string' ? option.label : '';
                                return label.toLowerCase().includes(input.toLowerCase());
                            }}
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
                </div>

                {/* Social media handles section */}
                <div className="mb-[40px]">
                    <h3 className="text-lg font-[400] mb-2 text-[#036BDD]">Social Media Handles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            name="instagram"
                            className="mb-0"
                        >
                            <div className="flex items-center">
                                <Input 
                                    placeholder="devburna (without @ or URL)" 
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
                                    placeholder="devburna (without @ or URL)" 
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
                                    placeholder="devburna (without @ or URL)" 
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
                                    placeholder="devburna (without @ or URL)" 
                                    className="h-12 border-gray-300 rounded-lg flex-1" 
                                />
                            </div>
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="audienceSite"
                        label="Audience Size"
                        className="mt-4"
                    >
                        <Input 
                            placeholder="Enter your audience size (e.g., 143434)" 
                            className="h-12 border-gray-300 rounded-lg" 
                        />
                    </Form.Item>
                </div>

                {/* Password section */}
                <div className="mb-4">
                    <h3 className="text-lg font-[400] mb-2 text-[#036BDD]">Password</h3>
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
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Please confirm your password!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords do not match!'));
                                },
                            }),
                        ]}
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