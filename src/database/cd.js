import { Plan } from './models.js';

async function createPlans() {
    try {
        const FreePlan = await Plan.create({
            ID: null,
            nombre: "free",
            precio: 0,
            duracion: 30,
        });
    } catch (error) {
        console.error("Error al crear el plan:", error);
    }
}

(async () => {
    await createPlans();
    console.log("Datos cargados con éxito");
})();
