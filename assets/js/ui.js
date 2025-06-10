import { TARIFF_VALUES, COMPANIES } from "../config/constants.js";
import { getPowerCost } from "./calculations.js";

// Function to validate and get numeric values from inputs
export function getNumericValue(elementId, defaultValue = 0) {
  const element = document.getElementById(elementId);
  if (!element) return defaultValue;
  const value = parseFloat(element.value);
  return isNaN(value) ? defaultValue : value;
}

// Function to update tariff fields visibility
export function updateTariffFields(tariffType) {
  const fields = ["simplesFields", "biHorarioFields", "triHorarioFields"];
  fields.forEach((field) => {
    const element = document.getElementById(field);
    if (element) {
      element.classList.add("hidden");
    }
  });

  const selectedField = document.getElementById(tariffType + "Fields");
  if (selectedField) {
    selectedField.classList.remove("hidden");
  }
}

// Function to update gas section visibility
export function updateGasSection(includeGas) {
  const gasSection = document.getElementById("gasSection");
  if (gasSection) {
    if (includeGas) {
      gasSection.classList.remove("hidden");
    } else {
      gasSection.classList.add("hidden");
      // Clear gas fields
      const gasFields = ["gasConsumption", "gasValue"];
      gasFields.forEach((field) => {
        const element = document.getElementById(field);
        if (element) element.value = "";
      });
    }
  }
}

// Function to update card values
export function updateCardValues(power, tariffType) {
  // Add null checks for parameters
  power = power || 0;
  tariffType = tariffType || "simples";

  // Update card values
  COMPANIES.forEach((company) => {
    const cards = document.querySelectorAll(".provider-card");
    let card = null;
    for (let i = 0; i < cards.length; i++) {
      const providerNameElement = cards[i].querySelector(".provider-name");
      if (
        providerNameElement &&
        providerNameElement.textContent.includes(company)
      ) {
        card = cards[i];
        break;
      }
    }

    if (card) {
      const detailsContainer = card.querySelector(".provider-details");
      if (!detailsContainer) return; // Skip if details container doesn't exist

      // Clear existing details
      while (detailsContainer.firstChild) {
        detailsContainer.removeChild(detailsContainer.firstChild);
      }

      // Create details based on tariff type
      if (tariffType === "simples" && TARIFF_VALUES[company]?.simples) {
        const simplesDetail = document.createElement("div");
        simplesDetail.className = "detail-item";
        simplesDetail.innerHTML = `
                    <span class="detail-label">Tarifa Simples</span>
                    <span class="detail-value">${TARIFF_VALUES[
                      company
                    ].simples.toFixed(4)} €/kWh</span>
                `;
        detailsContainer.appendChild(simplesDetail);
      } else if (
        tariffType === "biHorario" &&
        TARIFF_VALUES[company]?.biHorario
      ) {
        const vazioDetail = document.createElement("div");
        vazioDetail.className = "detail-item";
        vazioDetail.innerHTML = `
                    <span class="detail-label">Vazio</span>
                    <span class="detail-value">${TARIFF_VALUES[
                      company
                    ].biHorario.vazio.toFixed(4)} €/kWh</span>
                `;
        detailsContainer.appendChild(vazioDetail);

        const foraVazioDetail = document.createElement("div");
        foraVazioDetail.className = "detail-item";
        foraVazioDetail.innerHTML = `
                    <span class="detail-label">Fora do Vazio</span>
                    <span class="detail-value">${TARIFF_VALUES[
                      company
                    ].biHorario.foraVazio.toFixed(4)} €/kWh</span>
                `;
        detailsContainer.appendChild(foraVazioDetail);
      } else if (
        tariffType === "triHorario" &&
        TARIFF_VALUES[company]?.triHorario
      ) {
        const pontaDetail = document.createElement("div");
        pontaDetail.className = "detail-item";
        pontaDetail.innerHTML = `
                    <span class="detail-label">Ponta</span>
                    <span class="detail-value">${TARIFF_VALUES[
                      company
                    ].triHorario.ponta.toFixed(4)} €/kWh</span>
                `;
        detailsContainer.appendChild(pontaDetail);

        const cheiaDetail = document.createElement("div");
        cheiaDetail.className = "detail-item";
        cheiaDetail.innerHTML = `
                    <span class="detail-label">Cheia</span>
                    <span class="detail-value">${TARIFF_VALUES[
                      company
                    ].triHorario.cheia.toFixed(4)} €/kWh</span>
                `;
        detailsContainer.appendChild(cheiaDetail);

        const vazioDetail = document.createElement("div");
        vazioDetail.className = "detail-item";
        vazioDetail.innerHTML = `
                    <span class="detail-label">Vazio</span>
                    <span class="detail-value">${TARIFF_VALUES[
                      company
                    ].triHorario.vazio.toFixed(4)} €/kWh</span>
                `;
        detailsContainer.appendChild(vazioDetail);
      }

      // Add power value
      const powerDetail = document.createElement("div");
      powerDetail.className = "detail-item";
      const powerValue = getPowerCost(company, power) || 0;
      powerDetail.innerHTML = `
                <span class="detail-label">Potência (kVA)</span>
                <span class="detail-value">${powerValue.toFixed(
                  4
                )} €/kVA/dia</span>
            `;
      detailsContainer.appendChild(powerDetail);
    }
  });
}

// Function to display results
export function displayResults(
  results,
  calculationDays,
  energyDiscount,
  gasDiscount
) {
  const container = document.getElementById("resultsContainer");

  // Get current values from form
  const tariffType = document.querySelector(
    'input[name="tariffType"]:checked'
  ).value;
  const power = getNumericValue("powerValue");
  let currentConsumption = {};
  let currentEnergyCost = 0;
  let currentGasCost = 0;

  // Calculate current energy consumption based on tariff type
  switch (tariffType) {
    case "simples":
      currentConsumption = {
        simples: {
          value: getNumericValue("valueSimples"),
          amount: getNumericValue("consumptionSimples"),
        },
      };
      currentEnergyCost =
        currentConsumption.simples.amount * currentConsumption.simples.value;
      break;
    case "biHorario":
      currentConsumption = {
        vazio: {
          value: getNumericValue("valueBiHorarioVazio"),
          amount: getNumericValue("consumptionBiHorarioVazio"),
        },
        foraVazio: {
          value: getNumericValue("valueBiHorarioForaVazio"),
          amount: getNumericValue("consumptionBiHorarioForaVazio"),
        },
      };
      currentEnergyCost =
        currentConsumption.vazio.amount * currentConsumption.vazio.value +
        currentConsumption.foraVazio.amount *
          currentConsumption.foraVazio.value;
      break;
    case "triHorario":
      currentConsumption = {
        ponta: {
          value: getNumericValue("valueTriHorarioPonta"),
          amount: getNumericValue("consumptionTriHorarioPonta"),
        },
        cheia: {
          value: getNumericValue("valueTriHorarioCheia"),
          amount: getNumericValue("consumptionTriHorarioCheia"),
        },
        vazio: {
          value: getNumericValue("valueTriHorarioVazio"),
          amount: getNumericValue("consumptionTriHorarioVazio"),
        },
      };
      currentEnergyCost =
        currentConsumption.ponta.amount * currentConsumption.ponta.value +
        currentConsumption.cheia.amount * currentConsumption.cheia.value +
        currentConsumption.vazio.amount * currentConsumption.vazio.value;
      break;
  }

  // Calculate current gas cost if applicable
  const includeGas = document.getElementById("simulationType")?.checked;
  if (includeGas) {
    const gasConsumption = getNumericValue("gasConsumption");
    const gasValue = getNumericValue("gasValue");
    currentGasCost = gasConsumption * gasValue;
  }

  // Calculate power cost
  const powerCost = power * calculationDays;
  currentEnergyCost += powerCost;

  // Calculate total current cost
  const currentTotal = currentEnergyCost + currentGasCost;

  // Create HTML for results
  let html = `
        <div class="w-full">
            <h2 class="text-2xl font-semibold text-gray-800 mb-6">
                <i class="fas fa-chart-bar text-electric mr-2"></i> Resultados
            </h2>
            
            <div class="mb-6 p-4 bg-blue-50 rounded-lg border border-electric">
                <h3 class="text-lg font-medium text-gray-800 mb-2">Potenciais Custos</h3>
                <p class="text-gray-700">Com base nos dados fornecidos, aqui estão os custos estimados com diferentes comercializadoras para um período de ${calculationDays} dias:</p>
                ${
                  energyDiscount > 0
                    ? `<p class="text-gray-700 mt-2"><i class="fas fa-percentage mr-1"></i> Desconto aplicado em energia: ${energyDiscount}%</p>`
                    : ""
                }
                ${
                  gasDiscount > 0
                    ? `<p class="text-gray-700 mt-2"><i class="fas fa-percentage mr-1"></i> Desconto aplicado em gás: ${gasDiscount}%</p>`
                    : ""
                }
            </div>

            <div class="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-300">
                <h3 class="text-lg font-medium text-gray-800 mb-2">Comercializadora Atual</h3>
                <div class="result-card p-4 rounded-lg border border-gray-200 bg-white">
                    <div class="flex justify-between items-center mb-1">
                        <div class="flex items-center">
                            <span class="font-bold text-gray-800">Valores Atuais</span>
                        </div>
                        <div class="text-lg font-bold">€${currentTotal.toFixed(
                          2
                        )}</div>
                    </div>
                    <div class="flex justify-between items-center text-sm text-gray-600">
                        <div>
                            <i class="fas fa-bolt mr-1"></i>
                            <span>Energia: €${currentEnergyCost.toFixed(
                              2
                            )}</span>
                        </div>
                        ${
                          currentGasCost > 0
                            ? `
                        <div>
                            <i class="fas fa-fire mr-1"></i>
                            <span>Gás: €${currentGasCost.toFixed(2)}</span>
                        </div>
                        `
                            : ""
                        }
                    </div>
                </div>
            </div>
            
            <h3 class="text-lg font-medium text-gray-800 mb-4">Opções Disponíveis</h3>
    `;

  results.forEach((result, index) => {
    const savings = currentTotal - result.total;
    const savingsPercentage = ((savings / currentTotal) * 100).toFixed(1);
    const isSaving = savings > 0;

    html += `
            <div class="result-card mb-4 p-4 rounded-lg border ${
              index === 0
                ? "border-savings bg-green-50"
                : "border-gray-200 bg-white"
            }">
                <div class="flex justify-between items-center mb-1">
                    <div class="flex items-center">
                        <span class="font-bold text-gray-800">${
                          result.company
                        }</span>
                        ${
                          index === 0
                            ? '<span class="ml-2 px-2 py-1 bg-savings text-white text-xs rounded-full">Melhor Opção</span>'
                            : ""
                        }
                    </div>
                    <div class="text-lg font-bold">€${result.total.toFixed(
                      2
                    )}</div>
                </div>
                <div class="flex justify-between items-center text-sm text-gray-600">
                    <div>
                        <i class="fas fa-bolt mr-1"></i>
                        <span>Energia: €${result.energyCost.toFixed(2)}</span>
                    </div>
                    ${
                      result.gasCost > 0
                        ? `
                    <div>
                        <i class="fas fa-fire mr-1"></i>
                        <span>Gás: €${result.gasCost.toFixed(2)}</span>
                    </div>
                    `
                        : ""
                    }
                </div>
                <div class="mt-2 pt-2 border-t border-gray-200">
                    <div class="flex justify-between items-center">
                        <span class="text-sm font-medium ${
                          isSaving ? "text-savings" : "text-red-500"
                        }">
                            <i class="fas ${
                              isSaving ? "fa-arrow-down" : "fa-arrow-up"
                            } mr-1"></i>
                            ${
                              isSaving ? "Economia" : "Custo adicional"
                            }: €${Math.abs(savings).toFixed(2)}
                        </span>
                        <span class="text-sm font-medium ${
                          isSaving ? "text-savings" : "text-red-500"
                        }">
                            ${isSaving ? "+" : "-"}${savingsPercentage}%
                        </span>
                    </div>
                </div>
            </div>
        `;
  });

  html += `
        <div class="mt-6 p-4 bg-gray-100 rounded-lg text-sm text-gray-700">
            <p><i class="fas fa-info-circle mr-2 text-gray-500"></i> Esta simulação utiliza preços de referência e pode não refletir os valores exatos da sua fatura. Os valores calculados são estimativas baseadas nos dados fornecidos.</p>
            ${
              energyDiscount > 0 || gasDiscount > 0
                ? `
            <p class="mt-2"><i class="fas fa-exclamation-circle mr-2 text-gray-500"></i> Os descontos aplicados são estimativas e podem variar de acordo com as condições específicas de cada comercializadora.</p>
            `
                : ""
            }
        </div>
    </div>
    `;

  // Replace container content
  container.innerHTML = html;

  // Animate results cards one by one
  const cards = document.querySelectorAll(".result-card");
  cards.forEach((card, i) => {
    setTimeout(() => {
      card.classList.add("show");
    }, i * 150);
  });
}
