import {
  POWER_COSTS,
  TARIFF_VALUES,
  GAS_PRICES,
  COMPANIES,
} from "./constants.js";

function isValidNumber(value) {
  return typeof value === "number" && !isNaN(value) && value >= 0;
}

export function getPowerCost(company, power) {
  if (!COMPANIES.includes(company)) {
    throw new Error("Empresa inválida");
  }
  if (!isValidNumber(power)) {
    throw new Error("Potência inválida");
  }
  const powerCost = POWER_COSTS[company][power.toFixed(2)] || 0;

  if (powerCost === undefined) {
    throw new Error(`Potência contratada inválida para a empresa ${company}`);
  }

  return powerCost;
}

function calculateFixedCost(company, power, days, discount = 0) {
  if (!COMPANIES.includes(company)) {
    throw new Error("Empresa inválida");
  }
  if (!isValidNumber(power)) {
    throw new Error("Potência inválida");
  }
  if (!isValidNumber(days)) {
    throw new Error("Número de dias inválido");
  }
  const powerCost = getPowerCost(company, power);
  const result = days * powerCost * (1 - discount / 100);
  return result;
}

function calculateSimpleTariffCost(company, consumption, discount = 0) {
  if (!isValidNumber(consumption)) {
    throw new Error("Consumo inválido");
  }
  const result =
    consumption * (TARIFF_VALUES[company].simples * (1 - discount / 100));
  return result;
}

function calculateBiHorarioCost(company, consumption, discount = 0) {
  if (!consumption?.vazio?.amount || !consumption?.foraVazio?.amount) {
    throw new Error("Consumo inválido para tarifa bi-horária");
  }

  const consumptionVazio =
    consumption.vazio.amount *
    (TARIFF_VALUES[company].biHorario.vazio * (1 - discount / 100));
  const consumptionForaVazio =
    consumption.foraVazio.amount *
    (TARIFF_VALUES[company].biHorario.foraVazio * (1 - discount / 100));

  const result = consumptionVazio + consumptionForaVazio;
  return result;
}

function calculateTriHorarioCost(company, consumption, discount = 0) {
  if (
    !consumption?.ponta?.amount ||
    !consumption?.cheia?.amount ||
    !consumption?.vazio?.amount
  ) {
    throw new Error("Consumo inválido para tarifa tri-horária");
  }

  const pontaCost =
    consumption.ponta.amount *
    (TARIFF_VALUES[company].triHorario.ponta * (1 - discount / 100));
  const cheiaCost =
    consumption.cheia.amount *
    (TARIFF_VALUES[company].triHorario.cheia * (1 - discount / 100));
  const vazioCost =
    consumption.vazio.amount *
    (TARIFF_VALUES[company].triHorario.vazio * (1 - discount / 100));

  const result = pontaCost + cheiaCost + vazioCost;
  return result;
}

function calculateGasCost(
  company,
  consumption,
  escalao,
  discount = 0,
  days = 30
) {
  if (!isValidNumber(consumption) || consumption === 0 || !escalao) {
    return 0;
  }

  const escalaoIndex = parseInt(escalao) - 1;
  const gasPrices = GAS_PRICES[company][escalaoIndex];

  if (!gasPrices) return 0;

  const energyCost = consumption * gasPrices.energia;
  const fixedTermCost = gasPrices.termoFixo * days;

  let totalCost = energyCost + fixedTermCost;

  if (isValidNumber(discount) && discount > 0) {
    totalCost *= 1 - discount / 100;
  }

  return totalCost;
}

export function calculateDiscountAmount(
  company,
  tariffType,
  power,
  DD,
  FE,
  ServicosAdicionais,
  luzGas
) {
  let discount = {
    luz: 0,
    gas: 0,
  };

  switch (company) {
    case "EDP":
      if (DD && FE) {
        if (luzGas) discount.gas += 5;
        if (power >= 3.45) discount.luz = 15;
        if (tariffType === "triHorario") discount.luz = 3;
        
      }
      break;
    case "Repsol":
      if (DD) discount.luz += 1;
      if (FE) discount.luz += 1;
      if (ServicosAdicionais) discount.luz += 1;
      if (luzGas) {
        discount.luz += 2;
        discount.gas = discount.luz;
      }
      break;
    case "Endesa":
      discount.luz = 21;
      if (DD) discount.luz += 1;
      if (FE) discount.luz += 1;
      if (ServicosAdicionais) discount.luz += 2;
      if (luzGas) {
        discount.luz += 2;
        discount.gas = discount.luz;
      }
      break;
    default:
      throw new Error("Empresa inválida");
  }

  return discount;
}

export function calculateSavings(
  consumption,
  tariffType,
  power,
  calculationDays,
  gasConsumption = 0,
  gasEscalao = "1"
) {
  if (
    !isValidNumber(calculationDays) ||
    !consumption ||
    typeof consumption !== "object"
  ) {
    throw new Error("Parâmetros inválidos");
  }
  const directDebit = document.getElementById("directDebit")?.checked || false;
  const electronicInvoice =
    document.getElementById("electronicInvoice")?.checked || false;
  const additionalServices =
    document.getElementById("additionalServices")?.checked || false;
  const luzGas = document.getElementById("simulationType")?.checked || false;

  return COMPANIES.filter(
    (company) => TARIFF_VALUES[company] && POWER_COSTS[company]
  )
    .map((company) => {
      const discountAmount = calculateDiscountAmount(
        company,
        tariffType,
        power,
        directDebit,
        electronicInvoice,
        additionalServices,
        luzGas
      );

      const energyCalculations = {
        simples: () =>
          calculateSimpleTariffCost(
            company,
            consumption.simples.amount,
            discountAmount.luz
          ),
        biHorario: () =>
          calculateBiHorarioCost(company, consumption, discountAmount.luz),
        triHorario: () =>
          calculateTriHorarioCost(company, consumption, discountAmount.luz),
      };

      const fixedCost = calculateFixedCost(
        company,
        power,
        calculationDays,
        discountAmount.luz
      );
      const energyCost =
        energyCalculations[tariffType]?.() ??
        (() => {
          throw new Error(`Tipo de tarifa inválido: ${tariffType}`);
        })();
      const gasCost = calculateGasCost(
        company,
        gasConsumption,
        gasEscalao,
        discountAmount.gas,
        calculationDays
      );
      const totalCost = energyCost + fixedCost + gasCost;

      return {
        company,
        total: +totalCost.toFixed(2),
        energyCost: +(energyCost + fixedCost).toFixed(2),
        gasCost: +gasCost.toFixed(2),
        isCurrent: false,
      };
    })
    .sort((a, b) => a.total - b.total);
}
