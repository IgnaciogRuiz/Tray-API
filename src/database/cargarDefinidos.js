import  { Plan } from './schema.js';

const FreePlan = await Plan.create({
    ID: null,
    nombre: "free",
    numero_empleados: 1,
    numero_mesas: 15,
    facturacion: false,
    precio: 0
});

const StarterPlan = await Plan.create({
    ID: null,
    nombre: "starter",
    numero_empleados: 3,
    numero_mesas: 30,
    facturacion: true,
    precio: 30000
});

const PlanPremium = await Plan.create({
    ID: null,
    nombre: "Premium",
    numero_empleados: 5,
    numero_mesas: 60,
    facturacion: true,
    precio: 45000
});

const PlanEnterprise = await Plan.create({
    ID: null,
    nombre: "Enterprise",
    numero_empleados: 1000,
    numero_mesas: 10000,
    facturacion: true,
    precio: 80000
});




