import React, { Component } from 'react';
import {
    FormGroup,
    Input,
    Label,
} from "reactstrap";
import Aside from "./assets/Aside";
import Modal from './assets/Modal';
import Nav from "./assets/Nav";
import api from "../api/api";
import { Navigate } from "react-router-dom";
import Loading from "./assets/Loading";
import { returnToken } from "../lib/payLoad";
import toast, { Toaster } from 'react-hot-toast';

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            abierto: false,
            refNom: "",
            refEmail: "",
            refRol: "user",
            refPass: "",
            loading: true,
            users: [],
        };
    };

    state = {
        abierto: false,
        users: [],
    };

    componentDidMount() {
        if (localStorage.getItem("token") !== null) this.reloadUsers();
    };

    async reloadUsers() {
        this.setState({ loading: true });
        const dataUsers = await api.getUsers();
        this.setState({ users: dataUsers });
        this.setState({ loading: false });
    };

    async deleteUser(id, rol) {
        await api.deleteUser(id, rol);
        this.reloadUsers();
        toast.success('Usuario eliminado');
    };

    abrirModal = () => {
        this.setState({ abierto: !this.state.abierto });
    };

    signup = async () => {
        const RegExpPass = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        const RegExpEmail = /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,63}$/i;

        let credentials = {
            name: this.state.refNom,
            email: this.state.refEmail,
            rol: this.state.refRol,
            pass: this.state.refPass,
        };

        if (
            credentials.name === "" ||
            credentials.email === "" ||
            credentials.pass === ""
        ) {
            toast.error("Debe llenar todos los campos");
        } else {
            let bandai = credentials.email.split("@")[1];
            if (!RegExpEmail.test(credentials.email)) {
                return toast.error('Email invalido')
            };
            if (bandai !== "namco.com") {
                return toast.error('Email Invalido: No pertenece a la empresa');
            };
            if (!RegExpPass.test(credentials.pass)) {
                return toast.error('La contraseña debe contener min 8 caracteres: Numeros, Mayus, Min y caracteres especiales');
            };

            await api.signup({
                name: credentials.name,
                email: credentials.email.toLowerCase(),
                pass: credentials.pass,
                rol: credentials.rol,
            });
            this.reloadUsers();
            this.setState({ refNom: "", refEmail: "", refRol: "user", refPass: "" });
            this.abrirModal();
            toast.success('Usuario registrado');
        };
    };

    render() {
        const payload = returnToken(localStorage.getItem("token"));

        if (localStorage.getItem("token") === null) {
            return <Navigate to="/" />;
        };

        if (payload.rol !== "admin") {
            return <Navigate to="/home" />;
        };

        return (
            <div id="wrapper">
                <Aside />
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        <Nav title="Registro de usuarios" name={payload.user} />
                        <div className="container-fluid">
                            <Toaster />
                            <div className="d-sm-flex align-items-center justify-content-end mb-4">
                                <div className="d-flex">
                                    <Modal modalId="crearUsuario"
                                        title="Nueva un nuevo usuario"
                                        type="circle"
                                        text="Crear un nuevo usuario"
                                        button="primary"
                                        onClick={this.signup}
                                        textOnClick="Guardar"
                                        noDismiss>
                                        <FormGroup>
                                            <Label for="nombre">Nombre del Usuario</Label>
                                            <Input
                                                onChange={(e) => {
                                                    this.setState({ refNom: e.target.value });
                                                }}
                                                type="text"
                                                id="nombre"
                                                value={this.state.refNom}
                                                required
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="email">Email</Label>
                                            <Input
                                                onChange={(e) => {
                                                    this.setState({ refEmail: e.target.value });
                                                }}
                                                type="email"
                                                id="email"
                                                value={this.state.refEmail}
                                                required
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="pass">Contraseña</Label>
                                            <Input
                                                onChange={(e) => {
                                                    this.setState({ refPass: e.target.value });
                                                }}
                                                type="password"
                                                id="pass"
                                                value={this.state.refPass}
                                                required
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="rol">Rol</Label>
                                            <br />
                                            <select
                                                onChange={(e) => {
                                                    this.setState({ refRol: e.target.value });
                                                }}
                                                defaultValue={this.state.refRol}
                                            >
                                                <option value="user">
                                                    Usuario
                                                </option>
                                                <option value="lider">Lider</option>
                                                <option value="admin">Administrador</option>
                                            </select>
                                        </FormGroup>
                                    </Modal>
                                </div>
                            </div>
                            <div className="card shadow mb-4">
                                <div className="card-header py-3">
                                    <h6 className="m-0 font-weight-bold text-primary">Usuarios</h6>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        {this.state.loading ?
                                            <Loading title="Cargando usuarios" />
                                            : (this.state.users.length === 0) ?
                                                "No hay usuarios aún"
                                                :
                                                <table className="table table-bordered" id="dataTable" width="100%" cellSpacing={0}>
                                                    <thead>
                                                        <tr>
                                                            <th>Nombre</th>
                                                            <th>Correo</th>
                                                            <th>Rol</th>
                                                            <th>Eliminar</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.state.users.map((user, i) => (
                                                            payload.id !== user._id && <tr key={i}>
                                                                <td>{user.name}</td>
                                                                <td>{user.email}</td>
                                                                <td>{user.rol}</td>
                                                                <td>
                                                                    <Modal
                                                                        modalId={`modalUser${i}`}
                                                                        title={`¿Está seguro de eliminar al usuario ${user.name}?`}
                                                                        type="trash"
                                                                        button="danger"
                                                                        textOnClick="Eliminar"
                                                                        onClick={() => this.deleteUser(user._id, user.rol)}
                                                                    >
                                                                        Esta acción borrará al usuario y todos los
                                                                        proyectos que este tenga creados o lo
                                                                        eliminará de sus proyectos asignados
                                                                    </Modal>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
};
