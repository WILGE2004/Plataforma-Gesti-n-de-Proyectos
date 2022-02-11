import React from 'react';
import { Link } from 'react-router-dom';
import { returnToken } from '../../lib/payLoad';

export default function Prueba() {

    const payload = returnToken();

    return (
        <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar" style={{ userSelect: "none" }}>
            <Link className="sidebar-brand d-flex align-items-center justify-content-center" to="/home">
                <div className="sidebar-brand-icon rotate-n-15">
                    <img src="/img/bandai-namco.svg" alt="logo" />
                </div>
                <div className="sidebar-brand-text mx-1">Bandai <sup>Namco</sup></div>
            </Link>
            <hr className="sidebar-divider" />
            <div className="sidebar-heading">
                Home
            </div>
            <li className="nav-item">
                <Link className="nav-link" to="/home">
                    <i className="fa-solid fa-house"></i>
                    <span>Home</span>
                </Link>
            </li>
            <hr className="sidebar-divider" />
            {payload.rol !== "user" && <>
                <div className="sidebar-heading">
                    Projects
                </div>
                <li className="nav-item">
                    <Link className="nav-link" to="/proyectos">
                        <i className="fa-solid fa-folder-open"></i>
                        <span>Projects</span>
                    </Link>
                </li>
                <hr className="sidebar-divider" />
            </>}
            {payload.rol === "admin" && <>
                <div className="sidebar-heading">
                    Admin
                </div>
                <li className="nav-item">
                    <Link className="nav-link" to="/registro">
                        <i className="fa-solid fa-user-check"></i>
                        <span>Register</span>
                    </Link>
                </li>
                <hr className="sidebar-divider d-none d-md-block" />
            </>}
        </ul>

    );
};