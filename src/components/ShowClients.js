import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { show_alerta } from "../functions";

const ShowClients = () => {
  const url = "http://127.0.0.1:8000/api/clients";
  const [clients, setClients] = useState([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState("");

  useEffect(() => {
    getClients();
  }, []);

  const getClients = async () => {
    const respuesta = await axios.get(url);
    setClients(respuesta.data);
  };
  const openModal = (op, id, name, email, phone, address) => {
    setId("");
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setOperation(op);
    if (op === 1) {
      setTitle("Registrar Cliente");
    } else if (op === 2) {
      setTitle("Editar Cliente");
      setId(id);
      setName(name);
      setEmail(email);
      setPhone(phone);
      setAddress(address);
    }
    window.setTimeout(function () {
      document.getElementById("nombre").focus();
    }, 500);
  };
  const validar = () => {
    var parametros;
    var metodo;
    if (name.trim() === "") {
      show_alerta("Escribe el nombre del cliente", "warning");
    } else if (email.trim() === "") {
      show_alerta("Escribe el correo del cliente", "warning");
    } else if (phone.trim() === "") {
      show_alerta("Escribe el telefono del cliente", "warning");
    } else if (address === "") {
      show_alerta("Escribe la direccion del cliente", "warning");
    } else {
      if (operation === 1) {
        parametros = {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          address: address,
        };
        metodo = "POST";
      } else {
        parametros = {
          id: id,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          address: address,
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
          getClients();
        }
      })
      .catch(function (error) {
        show_alerta("Error en la solicitud", "error");
        console.log(error);
      });
  };
  const deleteClient = (id, name) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: "¿Seguro de eliminar el cliente " + name + " ?",
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
        show_alerta("El cliente NO fue eliminado", "info");
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
                data-bs-target="#modalClients"
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
                    <th>CLIENTE</th>
                    <th>CORREO</th>
                    <th>TELEFONO</th>
                    <th>DIRECCION</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {clients.map((client, i) => (
                    <tr key={client.id}>
                      <td>{i + 1}</td>
                      <td>{client.name}</td>
                      <td>{client.email}</td>
                      <td>{client.name}</td>
                      <td>{client.address}</td>
                      <td>
                        <button
                          onClick={() =>
                            openModal(
                              2,
                              client.id,
                              client.name,
                              client.email,
                              client.phone,
                              client.address
                            )
                          }
                          className="btn btn-warning"
                          data-bs-toggle="modal"
                          data-bs-target="#modalClients"
                        >
                          <i className="fa-solid fa-edit"></i>
                        </button>
                        &nbsp;
                        <button
                          onClick={() => deleteClient(client.id, client.name)}
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
      <div id="modalClients" className="modal fade" aria-hidden="true">
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
                  id="correo"
                  className="form-control"
                  placeholder="Correo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></input>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-comment"></i>
                </span>
                <input
                  type="text"
                  id="telefono"
                  className="form-control"
                  placeholder="Telefono"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                ></input>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-dollar-sign"></i>
                </span>
                <input
                  type="text"
                  id="direccion"
                  className="form-control"
                  placeholder="Direccion"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
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

export default ShowClients;
