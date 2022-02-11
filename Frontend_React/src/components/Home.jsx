import React, { Component } from 'react';
import Aside from "./assets/Aside";
import Nav from "./assets/Nav";
import api from '../api/api';
import { returnToken } from '../lib/payLoad';
import { Navigate, Link } from 'react-router-dom';
import Loading from "./assets/Loading";

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { refNom: "", refDesc: "", refIni: "", refFin: "", loading: true, projects: [], projFin: [] };
    };

    componentDidMount() {
        if (localStorage.getItem('token') !== null) this.reloadProjects();
    };

    async reloadProjects() {
        this.setState({ loading: true });
        const projects = await api.getProjects();
        const projFin = projects.filter((project)=>new Date(project.endDate) < new Date());
        this.setState({ projects, projFin });
        this.setState({ loading: false });
    };

    render() {
        const user = returnToken(localStorage.getItem("token"));

        if (localStorage.getItem('token') === null) {
            return <Navigate to="/" />;
        };
        
        return (
            <div id="wrapper">
                <Aside />
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        <Nav title="Home" name={user.user} />
                        <div className="container-fluid">
                            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                <h1 className="h3 mb-0 text-gray-800">¡Bienvenido {user.user}!</h1>
                            </div>
                            <div className="row justify-content-start">
                                <div className="col-xl-3 col-md-6 mb-4">
                                    <div className="card border-left-info shadow h-100 p-2">
                                        <div className="card-body">
                                            <div className="row no-gutters align-items-center">
                                                <div className="col mr-2">
                                                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                                                        Proyectos iniciados</div>
                                                    <div className="h5 mb-0 font-weight-bold text-gray-800">{this.state.projects.length}</div>
                                                </div>
                                                <div className="col-auto">
                                                    <i className="fa-solid fa-circle-play fa-2x text-gray-300" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-md-6 mb-4">
                                    <div className="card border-left-warning shadow h-100 p-2">
                                        <div className="card-body">
                                            <div className="row no-gutters align-items-center">
                                                <div className="col mr-2">
                                                    <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                                        Proyectos finalizados</div>
                                                    <div className="h5 mb-0 font-weight-bold text-gray-800">{this.state.projFin.length}</div>
                                                </div>
                                                <div className="col-auto">
                                                    <i className="fa-solid fa-list-check fa-2x text-gray-300" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {this.state.loading ? <Loading title="Cargando proyectos" /> :
                                (this.state.projects.length === 0) ? "Sin proyectos aun" :
                                    <div className="card shadow mb-4">
                                        <div className="card-header py-3">
                                            <h6 className="m-0 font-weight-bold text-primary">
                                                {user.rol==="user" ? "Proyectos asignados" : "Proyectos"}
                                            </h6>
                                        </div>
                                        <div className="card-body">
                                            <div className="table-responsive">
                                                <table className="table table-bordered" id="dataTable" width="100%" cellSpacing={0}>
                                                    <thead>
                                                        <tr>
                                                            <th>Nombre</th>
                                                            <th>Descripción</th>
                                                            <th>Ir</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.state.projects.map((project) => (
                                                            <tr key={project._id}>
                                                                <td>{project.name}</td>
                                                                <td>{project.desc}</td>
                                                                <td><Link className="mx-1 d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm" to={`/board/${project._id}`} >Abrir<i className="fa-solid fa-chevron-up fa-sm text-white-50"></i></Link></td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    };
};