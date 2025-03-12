import  { Plan }  from './models.js';

//PLANES
const FreePlan = await Plan.create({
    ID: null,
    nombre: "free",
    precio: 0,
    duracion: 30,
});

