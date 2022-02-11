import React from "react";
import api from "../../api/api";
import toast from 'react-hot-toast';

export default function Task(props) {
  const nombre = React.useRef();
  const estado = React.useRef();
  const fInicio = React.useRef();
  const fFinal = React.useRef();

  const newActivity = async () => {
    const name = nombre.current.value;
    const state = estado.current.value;
    const startDate = fInicio.current.value;
    const endDate = fFinal.current.value;

    let day = props.startDate;
    let endDay = props.endDate;

    if (name === "" || state === "" || startDate === "" || endDate === "") {
      toast.error("Rellene todos los campos");
    } else {
      if (startDate < day || startDate > endDay) {
        return toast.error(
          "Fecha de Inicio Incorrecta: debe ser mayor o igual al del proyecto y menor a la final"
        );
      };
      if (endDate > endDay) {
        toast.error(
          "Fecha Final Incorrecta: debe ser menor a la fecha Final del proyecto"
        );
      } else if (endDate < day) {
        toast.error(
          "Fecha Final Incorrecta: debe ser mayor a la fecha Inicial del proyecto"
        );
      } else if (endDate < startDate) {
        toast.error(
          "Fecha Final Incorrecta: debe ser mayor a la fecha Inicial de la actividad"
        );
      } else {
        const saveActivity = await api.newActivity({
          phase: props.id,
          name,
          state,
          startDate,
          endDate,
        });

        if (saveActivity.success) {
          props.reloadProject();
        };
        toast.success("Actividad agregada");
      };
    };
  };

  return (
    <form className="form form group">
      <div className="form-group my-3">
        <h6>
          <label htmlFor="taskName">Agrega el nombre de la tarea</label>
        </h6>
        <input
          ref={nombre}
          className="form-control"
          type="text"
          placeholder="Nombre"
          name="taskName"
          id="taskName"
        />
      </div>
      <div className="form-group my-3">
        <h6>
          <label htmlFor="taskState">Agrega el estado de la tarea</label>
        </h6>
        <select
          ref={estado}
          className="form-control"
          type="text"
          name="taskState"
          id="taskState"
        >
          <option value="Iniciada" defaultValue>
            Iniciada
          </option>
          <option value="En Proceso">En Proceso</option>
          <option value="Finalizada">Finalizada</option>
        </select>
      </div>
      <div className="form-group my-3">
        <h6>
          <label>Agrega el cronograma de la tarea</label>
        </h6>
        <div className="form-group d-flex">
          <div className="form-group col-md-6 p-1">
            <h6>
              <label>Fecha de inicio</label>
            </h6>
            <input
              ref={fInicio}
              className="form-control"
              type="datetime-local"
              name=""
              id=""
            />
          </div>
          <div className="form-group col-md-6 p-1">
            <h6>
              <label>Fecha de terminación</label>
            </h6>
            <input
              ref={fFinal}
              className="form-control"
              type="datetime-local"
              name=""
              id=""
            />
          </div>
        </div>
      </div>
      <input
        onClick={newActivity}
        type="button"
        value="Crear"
        className="btn btn-primary"
        data-bs-dismiss="modal"
      />
    </form>
  );
};