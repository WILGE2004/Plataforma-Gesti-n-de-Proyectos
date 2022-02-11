import React, { Component } from 'react';
import { Navigate, Link } from 'react-router-dom';
import {
    FormGroup,
    Input,
    Label,
} from "reactstrap";
import Aside from "./assets/Aside";
import Modal from './assets/Modal';
import Nav from "./assets/Nav";
import api from "../api/api";
import { returnToken } from "../lib/payLoad";
import Loading from "./assets/Loading";
import { asString as format } from "date-format";
import toast, { Toaster } from 'react-hot-toast';

export default class Projects extends Component {
    constructor(props) {
        super(props);
        this.state = {
            abierto: false,
            refNom: "",
            refDesc: "",
            refIni: "",
            refFin: "",
            loading: true,
            projects: [],
            projFin: [],
            success: false
        };
    };

    state = {
        abierto: false,
    };

    componentDidMount() {
        if (localStorage.getItem("token") !== null) this.reloadProjects();
    };

    async reloadProjects() {
        this.setState({ loading: true });
        const projects = await api.getProjects();
        const projFin = projects.filter((project) => new Date(project.endDate) < new Date());
        this.setState({ projects, projFin });
        this.setState({ loading: false });
    };

    abrirModal = () => {
        this.setState({ abierto: !this.state.abierto });
    };

    guardar = async () => {
        let proj = {
            nombre: this.state.refNom,
            descripcion: this.state.refDesc,
            fInicio: this.state.refIni,
            fFinal: this.state.refFin,
        };

        if (
            proj.nombre !== "" &&
            proj.descripcion !== "" &&
            proj.fInicio !== "" &&
            proj.fFinal !== ""
        ) {
            const payload = returnToken();
            let date = new Date();
            let dd = date.getDate();
            let mm = date.getMonth() + 1;
            let yyyy = date.getFullYear();
            let today = `${yyyy}-${mm}-${dd}`;
            let dateIni = proj.fInicio.split("T")[0];
            let dateFin = proj.fFinal.split("T")[0];

            let success = true;

            if (dateIni < today) {
                success = false;
                toast.error("La fecha de Inicio NO puede ser menor a la actual");
            };
            if (dateFin < dateIni) {
                success = false;
                toast.error("La fecha de Final NO puede ser menor a la Inicial");
            };
            if (proj.fFinal < proj.fInicio) {
                success = false;
                toast.error("La fecha Final NO puede ser menor a la de Inicio");
            };

            if (success) {
                await api.newProject({
                    leader: payload.id,
                    name: proj.nombre,
                    desc: proj.descripcion,
                    startDate: proj.fInicio,
                    endDate: proj.fFinal,
                });
                this.setState({ refNom: "", refDesc: "", refIni: "", refFin: "" });
                this.reloadProjects();
                toast.success("Proyecto creado");
                this.abrirModal();
            };

        } else {
            toast.error("Llene todos los campos");
        };
    };

    render() {
        const user = returnToken(localStorage.getItem("token"));

        if (localStorage.getItem("token") === null) {
            return <Navigate to="/" />;
        };

        if (user.rol === "user") {
            return <Navigate to="/home" />;
        };

        return (
            <div id="wrapper">
                <Aside />
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        <Nav title="Proyectos" name={user.user} />
                        <div className="container-fluid">
                            <Toaster />
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
                            <div className="card shadow mb-4">
                                <div className="card-header py-3">
                                    <h6 className="m-0 font-weight-bold text-primary">
                                        {user.rol === "user" ? "Proyectos asignados" : "Proyectos"}
                                    </h6>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">

                                        {this.state.loading ? <Loading title="Cargando proyectos" /> :
                                            (this.state.projects.length === 0) ? "Sin proyectos aun" :
                                                <table className="table table-bordered" id="dataTable" width="100%" cellSpacing={0}>
                                                    <thead>
                                                        <tr>
                                                            <th>Nombre</th>
                                                            <th>Descripción</th>
                                                            <th scope="col">Fecha Inicial</th>
                                                            <th scope="col">Fecha Final</th>
                                                            <th>Ir - Eliminar</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.state.projects.map((project, i) => (
                                                            <tr key={project._id}>
                                                                <td>{project.name}</td>
                                                                <td>{project.desc}</td>
                                                                <th scope="col">{format("dd-MM-yyyy", new Date(project.startDate))}</th>
                                                                <th scope="col">{format("dd-MM-yyyy", new Date(project.endDate))}</th>
                                                                <td>
                                                                    <Link className="mx-1 d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm" to={`/board/${project._id}`} >
                                                                        Abrir
                                                                        <i className="fa-solid fa-chevron-up fa-sm text-white-50"></i>
                                                                    </Link>
                                                                    <Modal
                                                                        modalId={`modalProject${i}`}
                                                                        title={`¿Está seguro de eliminar el proyecty ${project.name}?`}
                                                                        type="trash"
                                                                        button="danger"
                                                                        textOnClick="Eliminar"
                                                                        onClick={() => {
                                                                            api.deleteProject(project._id);
                                                                            this.reloadProjects();
                                                                            toast.success('Proyecto eliminado')
                                                                        }}
                                                                    >
                                                                        Esta acción borrará toda información sobre el
                                                                        proyecto
                                                                    </Modal>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>}
                                    </div>
                                </div>
                                {user.rol === "lider" && <div className="card-header py-3">
                                    <Modal
                                        modalId="proyecto"
                                        title="Nueva proyecto"
                                        type="circle"
                                        text="Crear un nuevo proyecto"
                                        button="primary"
                                        onClick={this.guardar}
                                        textOnClick="Crear"
                                        noDismiss>
                                        <FormGroup>

                                            <Label for="nombre">Nombre del proyecto</Label>
                                            <Input
                                                onChange={(e) => {
                                                    this.setState({ refNom: e.target.value });
                                                }}
                                                type="text"
                                                id="nombre"
                                                value={this.state.refNom}
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="desc">Descripcion del proyecto</Label>
                                            <Input
                                                onChange={(e) => {
                                                    this.setState({ refDesc: e.target.value });
                                                }}
                                                type="text"
                                                id="desc"
                                                value={this.state.refDesc}
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="fInicio">Fecha de inicio</Label>
                                            <Input
                                                onChange={(e) => {
                                                    this.setState({ refIni: e.target.value });
                                                }}
                                                type="datetime-local"
                                                id="fInicio"
                                                value={this.state.refIni}
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="fFinal">Fecha final</Label>
                                            <Input onChange={(
                                                e
                                            ) => {
                                                this.setState({ refFin: e.target.value });
                                            }}
                                                type="datetime-local"
                                                id="fFinal"
                                                value={this.state.refFin}
                                            />
                                        </FormGroup>
                                    </Modal>
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
};
