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

function calculateFixedCost(company, power, days) {
  if (!isValidNumber(days)) {
    throw new Error("Número de dias inválido");
  }
  const powerCost = getPowerCost(company, power);
  const result = days * powerCost;
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

function calculateGasCost(company, consumption, value = 0, discount = 0) {
  if (!isValidNumber(consumption) || consumption === 0) {
    return 0;
  }

  let gasCost =
    value > 0 ? consumption * value : consumption * GAS_PRICES[company];

  if (isValidNumber(discount) && discount > 0) {
    gasCost *= 1 - discount / 100;
  }

  return gasCost;
}

export function calculateSavings(
  consumption,
  tariffType,
  power,
  calculationDays
) {
  if (
    !isValidNumber(calculationDays) ||
    !consumption ||
    typeof consumption !== "object"
  ) {
    throw new Error("Parâmetros inválidos");
  }

  return COMPANIES.filter(
    (company) => TARIFF_VALUES[company] && POWER_COSTS[company]
  )
    .map((company) => {
      const energyCalculations = {
        simples: () =>
          calculateSimpleTariffCost(company, consumption.simples.amount, 0),
        biHorario: () => calculateBiHorarioCost(company, consumption, 0),
        triHorario: () => calculateTriHorarioCost(company, consumption, 0),
      };

      const fixedCost = calculateFixedCost(company, power, calculationDays);
      const energyCost =
        energyCalculations[tariffType]?.() ??
        (() => {
          throw new Error(`Tipo de tarifa inválido: ${tariffType}`);
        })();
      const gasCost = calculateGasCost(
        company,
        consumption.gas?.amount || 0,
        0,
        0
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
