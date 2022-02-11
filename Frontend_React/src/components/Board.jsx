import React from 'react';
import { Navigate, useParams, Link } from "react-router-dom";
import Aside from "./assets/Aside";
import Modal from './assets/Modal';
import Nav from "./assets/Nav";
import Task from './assets/Task';
import Loading from './assets/Loading';
import Members from './assets/Members';
import Add from './assets/Add';
import api from "../api/api";
import { asString as format } from 'date-format';
import { returnToken } from '../lib/payLoad';
import toast, { Toaster } from 'react-hot-toast';
import NotFound from './NotFound';

export default function Board() {

    const params = useParams();

    const [load, setLoad] = React.useState(true);
    const [project, setProject] = React.useState({});
    const [phases, setPhases] = React.useState([]);
    const [act, setAct] = React.useState(0);
    const [members, setMembers] = React.useState([]);

    const nuevaFase = React.useRef();
    const onSubmit = e => {
        e.preventDefault();
    };

    const newPhase = async () => {
        const nameProject = nuevaFase.current.value;
        if (nameProject === "") {
            toast.error('Ingrese el nombre de la nueva fase');
        } else {
            const savePhase = await api.newPhase({
                project: params.id,
                name: nameProject,
            });

            if (savePhase.success) {
                nuevaFase.current.value = "";
                getFullProject();
                return toast.success("Fase agregada");

            };
            toast.error(savePhase.message);
        };
    };

    const getFullProject = async () => {
        setLoad(true);
        const data = await api.getProject(params.id);
            setProject(data);
        if (data !== null) {
            let nAct = 0;
            data.phases.map((phase) => nAct += phase.activities.length);
            setPhases(data.phases);
            setAct(nAct);
            setMembers(data.members);
        }
        setLoad(false);
    };

    React.useEffect(() => {
        getFullProject();
        // eslint-disable-next-line
    }, [params.id]);

    const stateOnchange = async (e) => {
        await api.updateActivitie(e.target.id, { state: e.target.value, id_project: project._id });
        toast.success('Estado cambiado');
    };

    const hoursOnchange = async (id_phase, id_act) => {
        const id_project = project._id;
        const hoursAct = parseInt(document.getElementById(`hoursAct${id_act}`).textContent) + 1;
        document.getElementById(`hoursAct${id_act}`).innerHTML = hoursAct;
        const hoursPha = parseInt(document.getElementById(`hoursPha${id_phase}`).textContent) + 1;
        document.getElementById(`hoursPha${id_phase}`).innerHTML = hoursPha;
        const hoursPro = parseInt(document.getElementById(`hoursPro${id_project}`).textContent) + 1;
        document.getElementById(`hoursPro${id_project}`).innerHTML = hoursPro;
        await api.updateActivitie(id_act, { hours: hoursAct, id_project, id_phase, id_act });
    };

    const payload = returnToken();

    if (localStorage.getItem("token") === null) {
        return <Navigate to="/" />;
    };

    if (project === null) {
        return <NotFound />;
    }

    return (
        <div id="wrapper">
            <Aside />
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <Nav title={project.name} name={payload.user}><Link to="/proyectos" className="mx-1 d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i className="fa-solid fa-arrow-left"></i></Link></Nav>
                    <div className="container-fluid">
                        <Toaster />
                        <div className="d-sm-flex align-items-center justify-content-between mb-4">
                            <h1 className="h3 mb-0 text-gray-800">{load === false && `${format('dd/MM/yyyy', new Date(project.startDate))} - ${format('dd/MM/yyyy', new Date(project.endDate))}`}</h1>
                            {(payload.rol === "admin" || payload.rol === "lider") && <div className="d-flex">
                                <Modal modalId="fase" title="Agregar una nueva fase" text="Agregar fase" type="circle">
                                    <h6>Agrega el nombre de la nueva fase</h6>
                                    <form className="form-group" onSubmit={onSubmit} >
                                        <div className="form-group d-flex justify-content-between">
                                            <div className="input-group mx-1">
                                                <input
                                                    ref={nuevaFase}
                                                    type="text"
                                                    autoComplete="off"
                                                    spellCheck="false"
                                                    placeholder="Nombre"
                                                    className="form-control" />
                                            </div>
                                            <button
                                                data-bs-dismiss="modal"
                                                type="submit"
                                                className="btn btn-primary mx-1"
                                                onClick={newPhase}
                                            >
                                                Agregar
                                            </button>
                                        </div>
                                    </form>
                                </Modal>
                                <Modal modalId="delMember" title="Elimina a un miembro" text="Eliminar miembro" type="minus">
                                    {false ? <Loading title="Cargando miembros" /> : (members.length === 0) ? <h4>Proyecto sin miembros</h4> : <Members members={members} isDeleting deleteFrom={project._id} reloadProject={() => getFullProject()} />}
                                </Modal>
                                <Modal modalId="addMember" title="Agregar a un miembro" text="Agregar miembro" type="plus">
                                    {load === false && <Add comp={members} reloadProject={() => getFullProject()} id={params.id} members={project.leader} n={members.length} />}
                                </Modal>
                            </div>}
                        </div>
                        <div className="row">
                            <div className="col-xl-3 col-md-6 mb-4">
                                <div className="card border-left-primary shadow h-100 p-2">
                                    <div className="card-body">
                                        <div className="row no-gutters align-items-center">
                                            <div className="col mr-2">
                                                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                                    Horas del proyecto</div>
                                                <div id={`hoursPro${project._id}`} className="h5 mb-0 font-weight-bold text-gray-800">{project.hours}</div>
                                            </div>
                                            <div className="col-auto">
                                                <i className="fa-solid fa-clock fa-2x text-gray-300" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-md-6 mb-4">
                                <div className="card border-left-success shadow h-100 p-2">
                                    <div className="card-body">
                                        <div className="row no-gutters align-items-center">
                                            <div className="col mr-2">
                                                <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                                    Fases del proyecto</div>
                                                <div className="h5 mb-0 font-weight-bold text-gray-800">{phases.length}</div>
                                            </div>
                                            <div className="col-auto">
                                                <i className="fa-solid fa-diagram-project fa-2x text-gray-300" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-md-6 mb-4">
                                <div className="card border-left-info shadow h-100 p-2">
                                    <div className="card-body">
                                        <div className="row no-gutters align-items-center">
                                            <div className="col mr-2">
                                                <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                                                    Actividades del proyecto</div>
                                                <div className="h5 mb-0 font-weight-bold text-gray-800">{act}</div>
                                            </div>
                                            <div className="col-auto">
                                                <i className="fa-solid fa-list-check fa-2x text-gray-300" />
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
                                                    Miembros del proyecto</div>
                                                <div className="h5 mb-0 font-weight-bold text-gray-800">{members.length}</div>
                                            </div>
                                            <div className="col-auto">
                                                <i className="fa-solid fa-users fa-2x text-gray-300" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {load ? <Loading title="Cargando proyecto" /> : (phases.length === 0) ? <h3>Este proyecto no tiene nada aún</h3> : phases.map((phase, i) => (
                            <div className="card shadow mb-4" key={phase._id}>
                                <div className="card-header py-3 d-flex justify-content-between">
                                    <h6 className="m-0 font-weight-bold text-primary">{phase.name}</h6>
                                    <h6 className="m-0 font-weight-bold text-primary">Horas de la fase: <span id={`hoursPha${phase._id}`}>{phase.hours}</span></h6>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        {phase.activities.length !== 0 ?
                                            <table className="table table-bordered" id="dataTable" width="100%" cellSpacing={0}>
                                                <thead>
                                                    <tr>
                                                        <th>Nombre</th>
                                                        <th>Estado</th>
                                                        <th>Cronograma</th>
                                                        <th>Horas</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {phase.activities.map((act, i) => (
                                                        <tr key={act._id}>
                                                            <td>{act.name}</td>
                                                            <td>
                                                                <select className="select-state-act" id={act._id} onChange={stateOnchange} style={{}} defaultValue={act.state}>
                                                                    <option defaultValue="Iniciada">Iniciada</option>
                                                                    <option defaultValue="En Proceso">En Proceso</option>
                                                                    <option defaultValue="Finalizada">Finalizada</option>
                                                                </select>
                                                            </td>
                                                            <td>{`${format('dd/MM/yyyy', new Date(act.startDate))} - ${format('dd/MM/yyyy', new Date(act.endDate))}`}</td>
                                                            <td className="d-flex justify-content-between">
                                                                <button className="btn" id={`hoursAct${act._id}`} style={{ pointerEvents: "none" }} defaultValue={act.hours}>{act.hours}</button>
                                                                <button onClick={() => hoursOnchange(phase._id, act._id)} className="btn btn-primary" >+</button>

                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table> : <h5>Fase sin actividades</h5>}
                                    </div>
                                </div>
                                <div className="card-header py-3">
                                    <Modal
                                        modalId={`faseAct${phase._id}`}
                                        title={`Nueva actividad de la fase ${phase.name}`}
                                        type="circle"
                                        text="Agregar nueva actividad">
                                        <Task id={phase._id} startDate={project.startDate} endDate={project.endDate} reloadProject={() => getFullProject()} />
                                    </Modal>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};