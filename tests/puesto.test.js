const app = require("../index");
const supertest = require("supertest");
const request = supertest(app);

describe("Pruebas para las rutas de puesto", () => {
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

  // Prueba para la creación de un puesto
  it("Debería crear un nuevo puesto", async () => {
    const response = await request
      .post("/saag/agregar-puesto/")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        idPuesto: 500,
        nombrePuesto: "Nuevo Puesto",
      });
    expect(response.statusCode).toBe(200);
  });

    // Prueba para obtener un puesto por ID
    it("Debería obtener un puesto por ID", async () => {
        const idPuesto = 500;
        const response = await request
            .get(`/saag/puesto/${idPuesto}`)
            .set("Authorization", `Bearer ${accessToken}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.idPuesto).toBe(idPuesto);
    });

  // Prueba para obtener todos los puestos
  it("Debería obtener todos los puestos", async () => {
    const response = await request
      .get("/saag/puestos/")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(200);
  });

  // Prueba para actualizar un puesto por ID
  it("Debería actualizar un puesto por ID", async () => {
    const idPuesto = 500; 
    const updatedData = {
      nombrePuesto: "Puesto Actualizado",
    };
    const response = await request
      .put(`/saag/actualizar-puesto/${idPuesto}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updatedData);
    expect(response.statusCode).toBe(200);
  });

  // Prueba para eliminar un puesto por ID
  it("Debería eliminar un puesto por ID", async () => {
    const idPuesto = 500; 
    const response = await request
      .delete(`/saag/eliminar-puesto/${idPuesto}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("El puesto fue eliminado exitosamente");
  });
});
