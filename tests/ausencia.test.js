const app = require("../index");
const supertest = require("supertest");
const request = supertest(app);

describe("Pruebas para las rutas de ausencia", () => {
  let accessToken = "";
  //realizar el login
  beforeAll(async () => {
    const loginData = {
      nombreUsuario: "fran",
      contrasena: "hashedPassword5#",
    };

    try {
      const response = await request.post("/saag/login").send(loginData);
      accessToken = response.body.accessToken;
    } catch (error) {
      throw new Error("Error al iniciar sesión: " + error.message);
    }
  });
  // Prueba para la creación de una ausencia
  it("Debería crear una nueva ausencia", async () => {
    const response = await request
      .post("/saag/agregar-ausencia")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        idAusencia: 90,
        fechaAusencia: "2023-10-10",
        fechaFin: "2023-10-12",
        razon: "desconocida",
        nombreColaborador: "Henry",
        idColaborador: 6,
      });
    expect(response.statusCode).toBe(200);
  });

  // Prueba para obtener todas las ausencias
  it("Debería obtener todas las ausencias", async () => {
    const response = await request
      .get("/saag/ausencias")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(200);
  });

  it("Debería obtener todas las ausencias del colaborador mediante su id", async () => {
    const colaboradorId = 1;
    const response = await request
      .get(`/saag/ausencias-por-colaborador/${colaboradorId}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(200);
  });

  // Prueba para obtener una ausencia por ID
  it("Debería obtener una ausencia por ID", async () => {
    const ausenciaId = 1;
    const response = await request
      .get(`/saag/ausencia/${ausenciaId}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.idAusencia).toBe(ausenciaId);
  });

  // Prueba para actualizar una ausencia por ID
  it("Debería actualizar una ausencia por ID", async () => {
    const ausenciaId = 1;
    // Datos para la actualización
    const updatedData = {
      fechaAusencia: "2020-10-17",
      fechaFin: "2020-10-19",
      razon: "desconocida",
      nombreColaborador: "Henry",
      idColaborador: 1,
    };
    const response = await request
      .put(`/saag/actualizar-ausencia/${ausenciaId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updatedData);
    expect(response.statusCode).toBe(200);
  });
  // Prueba para eliminar una ausencia por ID
  it("Debería eliminar una ausencia por ID", async () => {
    const ausenciaId = 90;
    const response = await request
      .delete(`/saag/eliminar-ausencia/${ausenciaId}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe(
      "La ausencia fue eliminada exitosamente"
    );
  });

});
