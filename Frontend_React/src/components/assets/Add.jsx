import React from 'react';
import Members from './Members';
import api from '../../api/api';
import toast from 'react-hot-toast';

const Add = (props) => {

    const members = props.members;
    const [users, setUsers] = React.useState([]);
    const [id, setId] = React.useState(0);
    const newMember = React.useRef();

    const onSubmit = async e => {
        e.preventDefault();
        if (id === 0) {
            toast.error('Seleccione un usuario primero');
        } else {
            await api.addMember(props.id, id);
            props.reloadProject();
            toast.success('Usuario agregado como miembro');
        };
    };

    const onChange = async e => {
        if (newMember.current.value.length !== 0) {
            setId(0);
            const data = await api.searchUsers(newMember.current.value);
            const membersId = props.comp.map((mem) => mem._id);
            const newdata = data.filter(dataMeb => !membersId.includes(dataMeb._id));
            setUsers(newdata);
        } else {
            setUsers([]);
        };
    };

    const onClickMember = async (_id, email) => {
        setId(_id);
        setUsers([]);
        newMember.current.value = email;
    };

    return (
        <>
            <div className="project_asignament">
                <div className="project_id">
                    <div className="text-center">
                        <img src="/img/undraw_profile.svg" alt="projectProfile" width="150px" />
                        <h3>Miembros ({props.n})</h3>
                    </div>
                    <p className="my-0 mx-1">
                        <strong>
                            <small>Asignar a una persona como usuario subalterno de este proyecto</small>
                        </strong>
                    </p>
                    <form className="form-group" onSubmit={onSubmit}>
                        <div className="form-group d-flex justify-content-between">
                            <div className="input-group mx-1">
                                <input
                                    ref={newMember}
                                    onChange={onChange}
                                    type="text"
                                    autoComplete="off"
                                    spellCheck="false"
                                    placeholder="Ingrese el correo"
                                    className="form-control" />
                            </div>
                            {id !== 0 ? <button data-bs-dismiss="modal" type="submit" className="btn btn-primary mx-1">Asignar</button> : <button type="submit" className="btn btn-primary mx-1">Asignar</button>}
                        </div>
                        {users.length !== 0 &&
                            <div className="mx-1 d-flex justify-content-between align-items-center" style={{ padding: "0", margin: "0" }}>
                                <div className="card w-100" style={{ padding: "0", margin: "0" }} >
                                    <div className="card-body py-0">
                                        {users.map((user, i) => (
                                            <div onClick={() => onClickMember(user._id, user.email)} className="over-members p-1" style={{ cursor: "pointer" }} key={i}>
                                                <strong>
                                                    {user.email}
                                                </strong>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button type="button" className="btn btn-primary mx-1" style={{ opacity: "0", pointerEvents: "none" }}>Asignar</button>
                            </div>
                        }
                    </form>

                    <div className="container p-3 text-center" style={{ fontSize: "15px" }}>
                        Un usuario subalterno puede ver las actividades de el proyecto,
                        cargar horas al desarrollo de una actividad de un proyecto y
                        marcar actividad como iniciada/completada.
                    </div>
                    <p className="m-0">
                        <strong>
                            <small>Lider de este proyecto</small>
                        </strong>
                    </p>
                    <div>
                        <div>
                            <Members members={members} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Add;
