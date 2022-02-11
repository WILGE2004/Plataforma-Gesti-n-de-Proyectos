import React from 'react';
import api from '../../api/api';
import toast from 'react-hot-toast';

export default function Members(props) {

    let members = props.members;

    if(!Array.isArray(members)){
        members = [members];
    };

    return (
        <>
            {members.map((member, i) =>
                <div className="container-fluid d-flex align-items-center p-0"
                    key={i}>
                    <div className="col_avatar p-1">
                        <img src={member.rol==="lider" ? "/img/undraw_profile.svg" : "/img/perfil.png"} alt="userImg" width="40px"
                            style={{ borderRadius: "50px" }} />
                    </div>
                    <div className="col_details w-100">
                        <div>{member.name}</div>
                    </div>
                    <div className="col_action">
                        {member.rol === "lider" && <i className="fa-solid fa-crown"
                            style={{ color: "#ff0", fontSize: "25px" }}></i>}
                    </div>
                    {props.isDeleting && <div className="col_action">
                        <button data-bs-dismiss="modal" className="btn btn-danger" onClick={async()=>{
                            await api.deleteMember(props.deleteFrom,member._id);
                            props.reloadProject();
                            toast.success('Miembro eliminado');
                        }}>
                            Eiminar
                        </button> </div>}
                </div>
            )}
        </>
    );
};