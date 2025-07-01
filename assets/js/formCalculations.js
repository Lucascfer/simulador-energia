// Função para calcular o valor total com desconto
function calculateValueWithDiscount(value, discount = 0) {
  if (!value || value <= 0) return 0;
  return value * (1 - discount / 100);
}

// Função para calcular o consumo simples
export function calculateSimpleConsumption(consumption, value, discount = 0) {
  if (!consumption || !value) return 0;
  const valueWithDiscount = calculateValueWithDiscount(value, discount);
  return consumption * valueWithDiscount;
}

// Função para calcular o consumo bi-horário
export function calculateBiHorarioConsumption(consumption, discount = {}) {
  if (!consumption) return 0;

  const vazioValue = calculateValueWithDiscount(
    consumption.vazio.value,
    discount.vazio || 0
  );
  const foraVazioValue = calculateValueWithDiscount(
    consumption.foraVazio.value,
    discount.foraVazio || 0
  );

  return (
    consumption.vazio.amount * vazioValue +
    consumption.foraVazio.amount * foraVazioValue
  );
}

// Função para calcular o consumo tri-horário
export function calculateTriHorarioConsumption(consumption, discount = {}) {
  if (!consumption) return 0;

  const pontaValue = calculateValueWithDiscount(
    consumption.ponta.value,
    discount.ponta || 0
  );
  const cheiaValue = calculateValueWithDiscount(
    consumption.cheia.value,
    discount.cheia || 0
  );
  const vazioValue = calculateValueWithDiscount(
    consumption.vazio.value,
    discount.vazio || 0
  );

  return (
    consumption.ponta.amount * pontaValue +
    consumption.cheia.amount * cheiaValue +
    consumption.vazio.amount * vazioValue
  );
}

// Função para calcular o custo da potência
export function calculatePowerCost(
  power,
  powerValue,
  powerDiscount = 0,
  days = 30
) {
  if (!power || !powerValue || !days) return 0;
  const valueWithDiscount = calculateValueWithDiscount(
    powerValue,
    powerDiscount
  );
  return valueWithDiscount * days;
}

// Função para calcular o custo do gás
export function calculateGasCost(
  consumption,
  gasValue,
  gasFixedTerm,
  gasDiscount = 0,
  gasFixedTermDiscount = 0,
  gasDays = 30
) {
  if (!consumption || !gasValue || !gasFixedTerm) return 0;

  const valueWithDiscount = calculateValueWithDiscount(gasValue, gasDiscount);
  const energyCost = consumption * valueWithDiscount;
  const fixedTermWithDiscount = calculateValueWithDiscount(gasFixedTerm, gasFixedTermDiscount);
  const fixedTermCost = fixedTermWithDiscount * gasDays;

  return energyCost + fixedTermCost;
}

// Função principal que calcula todos os valores do formulário
export function calculateFormValues(formData) {
  const {
    tariffType,
    power,
    powerValue,
    powerDiscount,
    calculationDays,
    energyDiscount,
    gasDiscount,
    gasFixedTermDiscount,
    gasCalculationDays,
    consumption,
    gasConsumption,
    gasValue,
    gasFixedTerm,
  } = formData;

  let energyCost = 0;

  // Calcula o custo de energia baseado no tipo de tarifa
  switch (tariffType) {
    case "simples":
      energyCost = calculateSimpleConsumption(
        consumption.simples.amount,
        consumption.simples.value,
        energyDiscount
      );
      break;
    case "biHorario":
      energyCost = calculateBiHorarioConsumption(consumption, energyDiscount);
      break;
    case "triHorario":
      energyCost = calculateTriHorarioConsumption(consumption, energyDiscount);
      break;
  }

  // Calcula o custo da potência
  const powerCost = calculatePowerCost(
    power,
    powerValue,
    powerDiscount,
    calculationDays
  );

  // Calcula o custo do gás se aplicável
  const gasCost = calculateGasCost(
    gasConsumption,
    gasValue,
    gasFixedTerm,
    gasDiscount,
    gasFixedTermDiscount,
    gasCalculationDays
  );

  // Retorna o objeto com todos os cálculos
  return {
    energyCost: energyCost,
    powerCost: powerCost,
    gasCost: gasCost,
    totalCost: energyCost + powerCost + gasCost,
  };
}
