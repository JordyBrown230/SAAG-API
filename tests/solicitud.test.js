const app = require("../index");
const supertest = require("supertest");
const request = supertest(app);

describe("Pruebas para las rutas de solicitud", () => {
  let accessToken = "";
  //realizar el login
  beforeAll(async () => {
    const loginData = {
      nombreUsuario: "fran",
      contrasena: "hashedPassword5#"
    };

    try {
      const response = await request.post("/saag/login").send(loginData);
      accessToken = response.body.accessToken;
    } catch (error) {
      throw new Error("Error al iniciar sesión: " + error.message);
    }
  });
  // Prueba para la creación de una solicitud
  it("Debería crear una nueva solicitud", async () => {
    const insertData = {
      idSolicitud: 533,
      conGoceSalarial: true,
      tipoSolicitud: "Vacaciones",
      asunto: "Request for vacation approval",
      nombreColaborador: "John Doe",
      nombreEncargado: "Manager",
      fechaSolicitud: "2023-10-17T08:00:00Z",
      fechaInicio: "2023-10-20T00:00:00Z",
      fechaFin: "2023-10-25T00:00:00Z",
      horaInicio: "08:00:00",
      horaFin: "17:00:00",
      sustitucion: "SI",
      nombreSustituto: "Jane Smith",
      estado: "Pendiente",
      comentarioTalentoHumano: "Pending approval from HR",
      idColaborador: 6,
    };
    const response = await request
      .post("/saag/agregar-solicitud")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(insertData);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.tipoSolicitud).toBe(insertData.tipoSolicitud);
  });

  // Prueba para obtener todas las solicitudes
  it("Debería obtener todas las solicitudes", async () => {
    const response = await request
      .get("/saag/solicitudes")
      .set("Authorization", `Bearer ${accessToken}`);
    const numeroDeRegistros = response.body.length;
    expect(response.statusCode).toBe(200);
    expect(numeroDeRegistros).toBeGreaterThan(0);
  });

  it("Debería obtener todas las solicitudes del colaborador mediante su id", async () => {
    const colaboradorId = 6;
    const response = await request
      .get(`/saag/solicitudes-por-colaborador/${colaboradorId}`)
      .set("Authorization", `Bearer ${accessToken}`);
    const numeroDeRegistros = response.body.length;
    expect(response.statusCode).toBe(200);
    expect(numeroDeRegistros).toBeGreaterThan(0);
  });

  // Prueba para obtener una solicitud por ID
  it("Debería obtener una solicitud por ID", async () => {
    const solicitudId = 533;
    const response = await request
      .get(`/saag/solicitud/${solicitudId}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.idSolicitud).toBe(solicitudId);
  });

  // Prueba para actualizar una solicitud por ID
  it("Debería actualizar una solicitud por ID", async () => {
    const solicitudId = 533;
    const updatedData = {
      idSolicitud: 1,
      conGoceSalarial: true,
      tipoSolicitud: "Vacaciones",
      asunto: "Request for vacation approval",
      nombreColaborador: "John Doe",
      nombreEncargado: "Manager",
      fechaSolicitud: "2023-10-17T08:00:00Z",
      fechaInicio: "2023-10-20T00:00:00Z",
      fechaFin: "2023-10-25T00:00:00Z",
      horaInicio: "08:00:00",
      horaFin: "17:00:00",
      sustitucion: "SI",
      nombreSustituto: "Jane Smith",
      estado: "Aprobada",
      comentarioTalentoHumano: "Pending approval from HR",
      idColaborador: 6,
    };
    const response = await request
      .put(`/saag/actualizar-solicitud/${solicitudId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updatedData);
    expect(response.statusCode).toBe(200);
    expect(response.body.solicitud.estado).toBe(updatedData.estado);
  });

  // Prueba para eliminar una solicitud por ID
  it("Debería eliminar una solicitud por ID", async () => {
    const solicitudId = 533;
    try {
      const response = await request
        .delete(`/saag/eliminar-solicitud/${solicitudId}`)
        .set("Authorization", `Bearer ${accessToken}`);
        
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("La solicitud fue eliminada exitosamente");
    } catch (error) {
      // If there's an error in the request or the response status code is not as expected
      throw new Error("Error al eliminar la solicitud: " + error.message);
    }
  });
  
});
