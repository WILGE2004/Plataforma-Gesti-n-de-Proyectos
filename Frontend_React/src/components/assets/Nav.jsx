import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Nav(props) {

    const navigate = useNavigate();

    return (
        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow" style={{ userSelect: "none" }}>
            <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                <i className="fa fa-bars" />
            </button>
            <div>
                {props.children && props.children}
                {props.title}
            </div>
            <ul className="navbar-nav ml-auto">
                <div className="topbar-divider d-none d-sm-block" />
                <li className="nav-item dropdown no-arrow">
                    <div className="nav-link dropdown-toggle" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span className="mr-2 d-none d-lg-inline text-gray-600 small">{props.name.toUpperCase()}</span>
                        <img className="img-profile rounded-circle" alt='img' src="/img/undraw_profile.svg" />
                    </div>
                    <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                        <div className="dropdown-item" onClick={() => {
                            localStorage.removeItem('token');
                            navigate('/');
                        }}>
                            <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400" />
                            Logout
                        </div>
                    </div>
                </li>
            </ul>
        </nav>

    );
};