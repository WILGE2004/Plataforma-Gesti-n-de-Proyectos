import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom'
import api from '..//api/api';
import toast, { Toaster } from 'react-hot-toast';

export default function Login() {

    const refEmail = React.useRef();
    const refPass = React.useRef();
    const navigate = useNavigate();

    const login = async (e) => {
        e.preventDefault();
        const email = refEmail.current.value;
        const pass = refPass.current.value;

        const response = await api.login({
            email: email.toLowerCase(),
            pass,
        });

        if (response.success) {
            localStorage.setItem("token", response.token);
            navigate(`/home`);
        } else {
            toast.error(response.message);
        };
    };

    if (localStorage.getItem("token") !== null) {
        return <Navigate to="/home" />;
    };

    return (
        <div className="container">
            <Toaster />
            <div className="row justify-content-center">
                <div className="col-xl-10 col-lg-12 col-md-9">
                    <div className="card o-hidden border-0 shadow-lg my-5">
                        <div className="card-body p-0">
                            <div className="row">
                                <div className="col-lg-6 d-none d-lg-block" id="bg-login-bandai" />
                                <div className="col-lg-6">
                                    <div className="p-5">
                                        <div className="text-center">
                                            <h1 className="h4 text-gray-900 mb-4">Welcome Back!</h1>
                                        </div>
                                        <form className="user" onSubmit={login}>
                                            <div className="form-group">
                                                <input ref={refEmail} type="email" className="form-control form-control-user" id="exampleInputEmail" aria-describedby="emailHelp" placeholder="Enter Email Address..." />
                                            </div>
                                            <div className="form-group">
                                                <input ref={refPass} type="password" className="form-control form-control-user" id="exampleInputPassword" placeholder="Password" />
                                            </div>
                                            <div className="form-group">
                                                <div className="custom-control custom-checkbox small">
                                                    <input type="checkbox" className="custom-control-input" id="customCheck" />
                                                    <label className="custom-control-label" htmlFor="customCheck">Remember
                                                        Me</label>
                                                </div>
                                            </div>
                                            <button type="submit" className="btn btn-primary btn-user btn-block">
                                                Login
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};