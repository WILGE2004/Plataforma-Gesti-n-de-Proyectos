import React from 'react';
import Aside from './assets/Aside';
import Nav from './assets/Nav';
import { returnToken } from '../lib/payLoad';
import { Link, Navigate } from 'react-router-dom';

export default function NotFound() {

    const payload = returnToken();

    if (localStorage.getItem("token") === null) {
        return <Navigate to="/" />;
    };

    return (
        <div id="wrapper">
            <Aside />
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <Nav title="Not Found" name={payload.user} />
                    <div className="container-fluid">
                        {/* 404 Error Text */}
                        <div className="text-center">
                            <div className="error mx-auto" data-text={404}>404</div>
                            <p className="lead text-gray-800 mb-5">Page Not Found</p>
                            <p className="text-gray-500 mb-0">It looks like you found a glitch in the matrix...</p>
                            <Link to="/Home">← Back to Home</Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};