import { TARIFF_VALUES, COMPANIES, GAS_PRICES } from "./constants.js";
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
      // Get the current selected escalão
      const selectedEscalao =
        document.querySelector('input[name="gasEscalao"]:checked')?.value ||
        "1";
      // Update gas values in provider cards
      window.updateGasEscalao(selectedEscalao);
    } else {
      gasSection.classList.add("hidden");
      // Clear gas fields
      const gasFields = ["gasConsumption", "gasValue", "gasFixedTerm"];
      gasFields.forEach((field) => {
        const element = document.getElementById(field);
        if (element) element.value = "";
      });

      // Hide gas details in provider cards
      const gasDetails = document.querySelectorAll(".gas-details, .gas-termo-fixo-details");
      gasDetails.forEach((detail) => {
        detail.style.display = "none";
      });

      // Atualizar os cards para remover os detalhes do gás
      const power = document.getElementById('power')?.value || 0;
      const tariffType = document.querySelector('input[name="tariffType"]:checked')?.value || 'simples';
      updateCardValues(power, tariffType);
    }
  }
}

// Helper function to create detail element
function createDetailElement(label, value, unit) {
  const detail = document.createElement("div");
  detail.className = "detail-item";
  detail.innerHTML = `
    <span class="detail-label">${label}</span>
    <span class="detail-value">${value.toFixed(4)} ${unit}</span>
  `;
  return detail;
}

// Helper function to validate and format numeric value
function formatNumericValue(value, defaultValue = 0) {
  const numValue = parseFloat(value);
  return isNaN(numValue) ? defaultValue : numValue;
}

// Helper function to get gas details
function getGasDetails(company, selectedEscalao) {
  const escalaoIndex = parseInt(selectedEscalao) - 1;
  if (!GAS_PRICES[company] || !GAS_PRICES[company][escalaoIndex]) {
    console.warn(
      `Gas prices not found for company: ${company} and escalao: ${selectedEscalao}`
    );
    return null;
  }

  const gasPrices = GAS_PRICES[company][escalaoIndex];
  return {
    energia: formatNumericValue(gasPrices.energia),
    termoFixo: formatNumericValue(gasPrices.termoFixo),
  };
}

// Helper function to create gas details elements
function createGasDetailsElements(company, selectedEscalao, gasDetails) {
  const gasContainer = document.createElement("div");
  gasContainer.className = "gas-details-container";

  const gasEnergyDetail = document.createElement("div");
  gasEnergyDetail.className = "detail-item gas-details";
  gasEnergyDetail.innerHTML = `
    <span class="detail-label">Gás Natural (Escalão <span class="gas-escalao">${selectedEscalao}</span>)</span>
    <span class="detail-value gas-energia">${gasDetails.energia.toFixed(
      4
    )} €/kWh</span>
  `;
  gasContainer.appendChild(gasEnergyDetail);

  const gasFixedTermDetail = document.createElement("div");
  gasFixedTermDetail.className = "detail-item gas-termo-fixo-details";
  gasFixedTermDetail.innerHTML = `
    <span class="detail-label">Termo Fixo Gás</span>
    <span class="detail-value gas-termo-fixo">${gasDetails.termoFixo.toFixed(
      4
    )} €/mês</span>
  `;
  gasContainer.appendChild(gasFixedTermDetail);

  return gasContainer;
}

// Helper function to get tariff details
function getTariffDetails(company, tariffType) {
  if (!TARIFF_VALUES[company]) {
    console.warn(`Tariff values not found for company: ${company}`);
    return null;
  }

  const tariffs = TARIFF_VALUES[company];
  switch (tariffType) {
    case "simples":
      return tariffs.simples
        ? [{ label: "Tarifa Simples", value: tariffs.simples }]
        : null;
    case "biHorario":
      return tariffs.biHorario
        ? [
            { label: "Vazio", value: tariffs.biHorario.vazio },
            { label: "Fora do Vazio", value: tariffs.biHorario.foraVazio },
          ]
        : null;
    case "triHorario":
      return tariffs.triHorario
        ? [
            { label: "Ponta", value: tariffs.triHorario.ponta },
            { label: "Cheia", value: tariffs.triHorario.cheia },
            { label: "Vazio", value: tariffs.triHorario.vazio },
          ]
        : null;
    default:
      return null;
  }
}

export function updateCardValues(power, tariffType) {
  // Validate and set default values
  power = formatNumericValue(power);
  tariffType = tariffType || "simples";

  // Update card values
  COMPANIES.forEach((company) => {
    const card = document.getElementById(`${company.toLowerCase()}Card`);
    if (!card) {
      console.warn(`Card not found for company: ${company}`);
      return;
    }

    const detailsContainer = card.querySelector(".provider-details");
    if (!detailsContainer) {
      console.warn(`Details container not found for company: ${company}`);
      return;
    }

    // Create document fragment for better performance
    const fragment = document.createDocumentFragment();

    // Add tariff details first
    const tariffDetails = getTariffDetails(company, tariffType);
    if (tariffDetails) {
      tariffDetails.forEach((detail) => {
        fragment.appendChild(
          createDetailElement(detail.label, detail.value, "€/kWh")
        );
      });
    }

    // Add power value second
    const powerValue = getPowerCost(company, power) || 0;
    if (powerValue !== undefined) {
      fragment.appendChild(
        createDetailElement("Potência (kVA)", powerValue, "€/kVA/dia")
      );
    }

    // Add gas details last if enabled
    const simulationType = document.getElementById("simulationType");
    if (simulationType?.checked) {
      const selectedEscalao =
        document.querySelector('input[name="gasEscalao"]:checked')?.value ||
        "1";
      const gasDetails = getGasDetails(company, selectedEscalao);
      
      if (gasDetails) {
        const gasContainer = createGasDetailsElements(
          company,
          selectedEscalao,
          gasDetails
        );
        fragment.appendChild(gasContainer);
      }
    }

    // Clear and update container
    detailsContainer.innerHTML = "";
    detailsContainer.appendChild(fragment);
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
  if (!container) return;

  // Find current values from results
  const currentResult = results.find((result) => result.isCurrent);
  if (!currentResult) return;

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
                        <div class="text-lg font-bold">€${currentResult.total.toFixed(
                          2
                        )}</div>
                    </div>
                    <div class="flex justify-between items-center text-sm text-gray-600">
                        <div>
                            <i class="fas fa-bolt mr-1"></i>
                            <span>Energia: €${currentResult.energyCost.toFixed(
                              2
                            )}</span>
                        </div>
                        ${
                          currentResult.gasCost > 0
                            ? `
                        <div>
                            <i class="fas fa-fire mr-1"></i>
                            <span>Gás: €${currentResult.gasCost.toFixed(
                              2
                            )}</span>
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
    if (result.isCurrent) return;
    const savings = currentResult.total - result.total;
    const savingsPercentage = ((savings / currentResult.total) * 100).toFixed(
      1
    );
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
