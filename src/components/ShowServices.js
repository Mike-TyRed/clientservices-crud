import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { show_alerta } from "../functions";

const ShowServices = () => {
  const url = "http://127.0.0.1:8000/api/services";
  const [services, setServices] = useState([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState("");

  useEffect(() => {
    getServices();
  }, []);

  const getServices = async () => {
    const respuesta = await axios.get(url);
    setServices(respuesta.data);
  };
  const openModal = (op, id, name, description, price) => {
    setId("");
    setName("");
    setDescription("");
    setPrice("");
    setOperation(op);
    if (op === 1) {
      setTitle("Registrar Servicio");
    } else if (op === 2) {
      setTitle("Editar Servicio");
      setId(id);
      setName(name);
      setDescription(description);
      setPrice(price);
    }
    window.setTimeout(function () {
      document.getElementById("nombre").focus();
    }, 500);
  };
  const validar = () => {
    var parametros;
    var metodo;
    if (name.trim() === "") {
      show_alerta("Escribe el nombre del servicio", "warning");
    } else if (description.trim() === "") {
      show_alerta("Escribe la descripcion del servicio", "warning");
    } else if (price.trim() === "") {
      show_alerta("Escribe el precio del servicio", "warning");
    } else {
      if (operation === 1) {
        parametros = {
          name: name.trim(),
          description: description.trim(),
          price: price.trim(),
        };
        metodo = "POST";
      } else {
        parametros = {
          id: id,
          name: name.trim(),
          description: description.trim(),
          price: price.trim(),
        };
        metodo = "PUT";
      }
      envarSolicitud(metodo, parametros);
    }
  };
  const envarSolicitud = async (metodo, parametros) => {
    await axios({ method: metodo, url: url, data: parametros })
      .then(function (respuesta) {
        var tipo = respuesta.data[0];
        var msj = respuesta.data[1];
        show_alerta(msj, tipo);
        if (tipo === "success") {
          document.getElementById("btnCerrar").click();
          getServices();
        }
      })
      .catch(function (error) {
        show_alerta("Error en la solicitud", "error");
        console.log(error);
      });
  };
  const deleteService = (id, name) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: "¿Seguro de eliminar el servicee " + name + " ?",
      icon: "question",
      text: "No se podrá dar marcha atrás",
      showCancelButton: true,
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setId(id);
        envarSolicitud("DELETE", { id: id });
      } else {
        show_alerta("El servicee NO fue eliminado", "info");
      }
    });
  };

  return (
    <div className="App">
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-md-4 offset-md-4">
            <div className="d-grid mx-auto">
              <button
                onClick={() => openModal(1)}
                className="btn btn-dark"
                data-bs-toggle="modal"
                data-bs-target="#modalServices"
              >
                <i className="fa-solid fa-circle-plus"></i> Añadir
              </button>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-12 col-lg-8 offset-0 offset-lg-2">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>SERVICIO</th>
                    <th>DESCRIPCION</th>
                    <th>PRECIO</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {services.map((service, i) => (
                    <tr key={service.id}>
                      <td>{i + 1}</td>
                      <td>{service.name}</td>
                      <td>{service.description}</td>
                      <td>{service.price}</td>
                      <td>
                        <button
                          onClick={() =>
                            openModal(
                              2,
                              service.id,
                              service.name,
                              service.description,
                              service.price
                            )
                          }
                          className="btn btn-warning"
                          data-bs-toggle="modal"
                          data-bs-target="#modalServices"
                        >
                          <i className="fa-solid fa-edit"></i>
                        </button>
                        &nbsp;
                        <button
                          onClick={() =>
                            deleteService(service.id, service.name)
                          }
                          className="btn btn-danger"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div id="modalServices" className="modal fade" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <label className="h5">{title}</label>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <input type="hidden" id="id"></input>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-gift"></i>
                </span>
                <input
                  type="text"
                  id="nombre"
                  className="form-control"
                  placeholder="Nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></input>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-comment"></i>
                </span>
                <input
                  type="text"
                  id="description"
                  className="form-control"
                  placeholder="Descripcion"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></input>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-comment"></i>
                </span>
                <input
                  type="text"
                  id="price"
                  className="form-control"
                  placeholder="Precio"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                ></input>
              </div>
              <div className="d-grid col-6 mx-auto">
                <button onClick={() => validar()} className="btn btn-success">
                  <i className="fa-solid fa-floppy-disk"></i> Guardar
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                id="btnCerrar"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowServices;
