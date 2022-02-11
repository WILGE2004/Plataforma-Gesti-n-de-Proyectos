import React from 'react';

export default function Modal(props) {
    return (
        <>
            <button type="button" className="mx-1 d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm" data-bs-toggle="modal" data-bs-target={`#${props.modalId}`}>
                {props.type === "plus" && <i className="fa-solid fa-user-plus fa-sm text-white-50"></i>}
                {props.type === "minus" && <i className="fa-solid fa-user-minus fa-sm text-white-50"></i>}
                {props.type === "circle" && <i className="fa-solid fa-circle-plus fa-sm text-white-50"></i>}
                {props.type === "trash" && <i className="fa-solid fa-trash fa-sm text-white-50"></i>}

                {props.text}
            </button>
            <div className="modal fade" id={props.modalId} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">{props.title}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {props.children}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            {(props.button && props.noDismiss) ? <button type="button" className={`btn btn-${props.button}`} onClick={props.onClick} >{props.textOnClick}</button> : (props.button) && <button type="button" className={`btn btn-${props.button}`} onClick={props.onClick} data-bs-dismiss="modal">{props.textOnClick}</button>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
