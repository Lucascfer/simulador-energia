import {
  POWER_COSTS,
  TARIFF_VALUES,
  GAS_PRICES,
  COMPANIES,
} from "./constants.js";

/**
 * Valida se um valor é um número válido e positivo
 * @param {number} value - Valor a ser validado
 * @returns {boolean} - true se o valor for válido, false caso contrário
 */
function isValidNumber(value) {
  return typeof value === "number" && !isNaN(value) && value >= 0;
}

/**
 * Obtém o custo de potência com base na empresa e potência contratada
 * @param {string} company - Nome da empresa (EDP, Endesa, Repsol)
 * @param {number} power - Potência contratada em kVA
 * @returns {number} - Custo da potência por kVA/dia
 * @throws {Error} - Se a empresa não for válida ou a potência for inválida
 */
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

/**
 * Calcula o custo fixo baseado na potência contratada
 * @param {string} company - Nome da empresa
 * @param {number} power - Potência contratada
 * @param {number} days - Número de dias do cálculo
 * @returns {number} - Custo fixo total
 */
function calculateFixedCost(company, power, days) {
  if (!isValidNumber(days)) {
    throw new Error("Número de dias inválido");
  }
  const powerCost = getPowerCost(company, power);
  const result = days * powerCost;
  return result;
}

/**
 * Calcula o custo variável para tarifa simples
 * @param {string} company - Nome da empresa
 * @param {number} consumption - Consumo em kWh
 * @param {number} discount - Desconto aplicado
 * @returns {number} - Custo variável total
 */
function calculateSimpleTariffCost(company, consumption, discount) {
  let i = TARIFF_VALUES[company].simples;

  if (!isValidNumber(consumption)) {
    throw new Error("Consumo inválido");
  }
  const result =
    consumption * (TARIFF_VALUES[company].simples * (1 - discount / 100));
  return result;
}

/**
 * Calcula o custo variável para tarifa bi-horária
 * @param {string} company - Nome da empresa
 * @param {Object} consumption - Objeto com consumo ponta e fora ponta
 * @param {number} discount - Desconto aplicado
 * @returns {number} - Custo variável total
 */
function calculateBiHorarioCost(company, consumption, discount) {
  console.log("calculateBiHorarioCost - Input:", {
    company,
    consumption,
    discount,
  });

  if (!consumption?.vazio?.amount || !consumption?.foraVazio?.amount) {
    throw new Error("Consumo inválido para tarifa bi-horária");
  }

  const consumptionVazio =
    consumption.vazio.amount *
    (TARIFF_VALUES[company].biHorario.vazio * (1 - discount / 100));
  const consumptionForaVazio =
    consumption.foraVazio.amount *
    (TARIFF_VALUES[company].biHorario.foraVazio * (1 - discount / 100));

  console.log("calculateBiHorarioCost - Intermediate values:", {
    consumptionVazio,
    consumptionForaVazio,
    vazioTariff: TARIFF_VALUES[company].biHorario.vazio,
    foraVazioTariff: TARIFF_VALUES[company].biHorario.foraVazio,
  });

  const result = consumptionVazio + consumptionForaVazio;
  console.log("calculateBiHorarioCost - Result:", result);
  return result;
}

/**
 * Calcula o custo variável para tarifa tri-horária
 * @param {string} company - Nome da empresa
 * @param {Object} consumption - Objeto com consumo ponta, cheia e vazio
 * @param {number} discount - Desconto aplicado
 * @returns {number} - Custo variável total
 */
function calculateTriHorarioCost(company, consumption, discount) {
  console.log("calculateTriHorarioCost - Input:", {
    company,
    consumption,
    discount,
  });

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

  console.log("calculateTriHorarioCost - Intermediate values:", {
    pontaCost,
    cheiaCost,
    vazioCost,
    pontaTariff: TARIFF_VALUES[company].triHorario.ponta,
    cheiaTariff: TARIFF_VALUES[company].triHorario.cheia,
    vazioTariff: TARIFF_VALUES[company].triHorario.vazio,
  });

  const result = pontaCost + cheiaCost + vazioCost;
  console.log("calculateTriHorarioCost - Result:", result);
  return result;
}

/**
 * Calcula o custo do gás
 * @param {string} company - Nome da empresa
 * @param {number} consumption - Consumo de gás
 * @param {number} value - Valor do gás (opcional)
 * @param {number} discount - Desconto aplicado
 * @returns {number} - Custo do gás
 */
function calculateGasCost(company, consumption, value = 0, discount = 0) {
  console.log("calculateGasCost - Input:", {
    company,
    consumption,
    value,
    discount,
  });

  if (!isValidNumber(consumption) || consumption === 0) {
    console.log("calculateGasCost - No gas consumption");
    return 0;
  }

  let gasCost =
    value > 0 ? consumption * value : consumption * GAS_PRICES[company];

  if (isValidNumber(discount) && discount > 0) {
    gasCost *= 1 - discount / 100;
  }

  console.log("calculateGasCost - Result:", gasCost);
  return gasCost;
}

/**
 * Calcula as economias comparando diferentes fornecedores de energia
 * @param {Object} consumption - Objeto com consumo de energia
 * @param {string} tariffType - Tipo de tarifa (simples, biHorario, triHorario)
 * @param {number} power - Potência contratada
 * @param {number} calculationDays - Número de dias do cálculo
 * @param {number} energyDiscount - Desconto na energia
 * @param {number} gasDiscount - Desconto no gás
 * @returns {Array} - Array com resultados ordenados por custo total
 */
export function calculateSavings(
  consumption,
  tariffType,
  power,
  calculationDays,
  energyDiscount = 0,
  gasDiscount = 0
) {
  console.log("calculateSavings - Input:", {
    consumption,
    tariffType,
    power,
    calculationDays,
    energyDiscount,
    gasDiscount,
  });

  if (!isValidNumber(calculationDays)) {
    throw new Error("Número de dias inválido");
  }

  if (!consumption || typeof consumption !== "object") {
    throw new Error("Consumo inválido");
  }

  const results = [];

  for (const company of COMPANIES) {
    console.log("\nProcessing company:", company);

    // Valida se a empresa é válida
    if (!TARIFF_VALUES[company] || !POWER_COSTS[company]) {
      throw new Error(`Empresa inválida: ${company}`);
    }

    // Cálculo do custo de energia
    const fixedCost = calculateFixedCost(company, power, calculationDays);
    let energyCost;

    switch (tariffType) {
      case "simples":
        energyCost = calculateSimpleTariffCost(
          company,
          consumption.simples.amount,
          energyDiscount
        );
        break;

      case "biHorario":
        energyCost = calculateBiHorarioCost(
          company,
          consumption,
          energyDiscount
        );
        break;

      case "triHorario":
        energyCost = calculateTriHorarioCost(
          company,
          consumption,
          energyDiscount
        );
        break;

      default:
        throw new Error(`Tipo de tarifa inválido: ${tariffType}`);
    }

    const gasCost = calculateGasCost(
      company,
      consumption.gas?.amount || 0,
      0,
      gasDiscount
    );
    const totalCost = energyCost + fixedCost + gasCost;

    console.log("Company calculation results:", {
      company,
      fixedCost,
      energyCost,
      gasCost,
      totalCost,
    });

    results.push({
      company,
      total: parseFloat(totalCost.toFixed(2)),
      energyCost: parseFloat((energyCost + fixedCost).toFixed(2)),
      gasCost: parseFloat(gasCost.toFixed(2)),
      isCurrent: false,
    });
  }

  // Ordena por custo total (ascendente)
  const sortedResults = results.sort((a, b) => a.total - b.total);
  console.log("\nFinal sorted results:", sortedResults);
  return sortedResults;
}
