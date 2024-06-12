const app = require("../index");
const supertest = require("supertest");
const request = supertest(app);

describe("Pruebas para las rutas de telefono", () => {
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
  // Prueba para la creación de un telefono
  it("Debería crear un nuevo telefono", async () => {
    const response = await request
      .post("/saag/telefonos/agregar-telefono/")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        idTelefono: 500,
        numeroTelefono: '85256888',
        idColaborador: 32,
      });
    expect(response.statusCode).toBe(200);
  });

  it("Debería obtener todos los telefonos del colaborador mediante su id", async () => {
    const colaboradorId = 32;
    const response = await request
      .get(`/saag/telefonos/obtener-por-colaborador/${colaboradorId}`)
      .set("Authorization", `Bearer ${accessToken}`);
     expect(response.statusCode).toBe(200);
  });

  // Prueba para actualizar un telefono por ID
  it("Debería actualizar un telefono por ID", async () => {
    const idTelefono = 500;
    // Datos para la actualización
    const updatedData = {
        numeroTelefono: '1111111',
        idColaborador: 32,
    };
    const response = await request
      .put(`/saag/telefonos/actualizar-telefono/${idTelefono}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updatedData);
    expect(response.statusCode).toBe(200);
  });
  // Prueba para eliminar un telefono por ID
  it("Debería eliminar una ausencia por ID", async () => {
    const idTelefono = 500;
    const response = await request
      .delete(`/saag/telefonos/eliminar-telefono/${idTelefono}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe(
      "Registro eliminado exitosamente!."
    );
  });


});
