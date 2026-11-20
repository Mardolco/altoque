// Caso de la demo: Valeria, 21 años, usa el auto de su mamá y se le pincha
// una llanta en la Av. Javier Prado a las 9 p. m.

export const USUARIO = {
  nombre: "Valeria",
  ubicacion: "Av. Javier Prado",
  contacto: {
    nombre: "Mamá",
    inicial: "M",
    trato: "tu mamá", // "Listo, tu mamá ya puede ver dónde estás"
    descripcion: "Tu contacto de confianza",
  },
};

// Cuenta de prueba del login simulado (/ingresar). No hay servidor: la
// validación es local y solo sirve para la demo.
export const CUENTA_DE_PRUEBA = {
  email: "demo@altoque.pe",
  clave: "Altoque2026",
  nombre: USUARIO.nombre,
};
