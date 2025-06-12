import { TARIFF_VALUES, COMPANIES, GAS_PRICES } from "./constants.js";
import { getPowerCost, calculateDiscountAmount } from "./calculations.js";

// Utility Functions
export function getNumericValue(elementId, defaultValue = 0) {
  const element = document.getElementById(elementId);
  if (!element) return defaultValue;
  const value = parseFloat(element.value);
  return isNaN(value) ? defaultValue : value;
}

const formatNumericValue = (value, defaultValue = 0) => {
  const numValue = parseFloat(value);
  return isNaN(numValue) ? defaultValue : numValue;
};

// UI Update Functions
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

export function updateGasSection(includeGas) {
  const gasSection = document.getElementById("gasSection");
  if (!gasSection) return;

  if (includeGas) {
    gasSection.classList.remove("hidden");
    const selectedEscalao =
      document.querySelector('input[name="gasEscalao"]:checked')?.value || "1";
    window.updateGasEscalao(selectedEscalao);
  } else {
    gasSection.classList.add("hidden");
    clearGasFields();
    hideGasDetails();
    updateCardValues(
      document.getElementById("power")?.value || 0,
      document.querySelector('input[name="tariffType"]:checked')?.value ||
        "simples"
    );
  }
}

// Helper Functions
function clearGasFields() {
  const gasFields = ["gasConsumption", "gasValue", "gasFixedTerm"];
  gasFields.forEach((field) => {
    const element = document.getElementById(field);
    if (element) element.value = "";
  });
}

function hideGasDetails() {
  const gasDetails = document.querySelectorAll(
    ".gas-details, .gas-termo-fixo-details"
  );
  gasDetails.forEach((detail) => {
    detail.style.display = "none";
  });
}

function createDetailElement(label, value, unit, isDiscounted = false) {
  const detail = document.createElement("div");
  detail.className = "detail-item";
  const numericValue = parseFloat(value) || 0;
  detail.innerHTML = `
    <span class="detail-label">${label}</span>
    <span class="detail-value ${
      isDiscounted ? "text-discounted" : ""
    }">${numericValue.toFixed(4)} ${unit}</span>
  `;
  return detail;
}

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
    energia: gasPrices.energia
  };
}

function createGasDetailsElements(
  company,
  selectedEscalao,
  gasDetails,
  isDiscounted
) {
  const gasContainer = document.createElement("div");
  gasContainer.className = "gas-details-container";

  const gasEnergyDetail = document.createElement("div");
  gasEnergyDetail.className = "detail-item gas-details";
  gasEnergyDetail.innerHTML = `
    <span class="detail-label">Gás Natural (Escalão <span class="gas-escalao">${selectedEscalao}</span>)</span>
    <span class="detail-value gas-energia ${
      isDiscounted ? "text-discounted" : ""
    }">${gasDetails.energia.toFixed(4)} €/kWh</span>
  `;
  gasContainer.appendChild(gasEnergyDetail);

  return gasContainer;
}

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

function createDiscountElement(discount) {
  if (!discount || (discount.luz === 0 && discount.gas === 0)) return null;

  const discountContainer = document.createElement("div");
  discountContainer.className = "discount-badge";

  let discountText = "";
  if (discount.luz > 0) {
    discountText += `<span class="discount-item"><i class="fas fa-bolt"></i> ${discount.luz}%</span>`;
  }
  if (discount.gas > 0) {
    discountText += `<span class="discount-item"><i class="fas fa-fire"></i> ${discount.gas}%</span>`;
  }

  discountContainer.innerHTML = discountText;
  return discountContainer;
}

// Main Update Function
export function updateCardValues(power, tariffType) {
  power = formatNumericValue(power);
  tariffType = tariffType || "simples";

  const directDebit = document.getElementById("directDebit")?.checked || false;
  const electronicInvoice =
    document.getElementById("electronicInvoice")?.checked || false;
  const additionalServices =
    document.getElementById("additionalServices")?.checked || false;
  const luzGas = document.getElementById("simulationType")?.checked || false;

  COMPANIES.forEach((company) => {
    const cardId = `${company.toLowerCase()}Card`;
    const card = document.getElementById(cardId);
    if (!card) {
      console.warn(`Card not found for company: ${company} (ID: ${cardId})`);
      return;
    }

    const detailsContainer = card.querySelector(".provider-details");
    if (!detailsContainer) {
      console.warn(`Details container not found for company: ${company}`);
      return;
    }

    updateCardDiscounts(
      card,
      company,
      tariffType,
      power,
      directDebit,
      electronicInvoice,
      additionalServices,
      luzGas
    );
    updateCardDetails(detailsContainer, company, tariffType, power, luzGas);
  });
}

function updateCardDiscounts(
  card,
  company,
  tariffType,
  power,
  directDebit,
  electronicInvoice,
  additionalServices,
  luzGas
) {
  const existingBadge = card.querySelector(".discount-badge");
  if (existingBadge) {
    existingBadge.remove();
  }

  try {
    const discount = calculateDiscountAmount(
      company,
      tariffType,
      power,
      directDebit,
      electronicInvoice,
      additionalServices,
      luzGas
    );

    if (discount && (discount.luz > 0 || discount.gas > 0)) {
      const discountElement = createDiscountElement(discount);
      if (discountElement) {
        const header = card.querySelector(".provider-header");
        if (header) {
          header.appendChild(discountElement);
        }
      }
      card.classList.add("has-discount");
    } else {
      card.classList.remove("has-discount");
    }
  } catch (error) {
    console.warn(`Error calculating discount for ${company}:`, error);
  }
}

function updateCardDetails(
  detailsContainer,
  company,
  tariffType,
  power,
  luzGas
) {
  const fragment = document.createDocumentFragment();

  // Get discount conditions
  const directDebit = document.getElementById("directDebit")?.checked || false;
  const electronicInvoice =
    document.getElementById("electronicInvoice")?.checked || false;
  const additionalServices =
    document.getElementById("additionalServices")?.checked || false;

  // Calculate discounts
  const discount = calculateDiscountAmount(
    company,
    tariffType,
    power,
    directDebit,
    electronicInvoice,
    additionalServices,
    luzGas
  );

  // Add tariff details with discounts
  const tariffDetails = getTariffDetails(company, tariffType);
  if (tariffDetails) {
    tariffDetails.forEach((detail) => {
      // Apply energy discount if exists
      const discountedValue = discount?.luz
        ? detail.value * (1 - discount.luz / 100)
        : detail.value;
      fragment.appendChild(
        createDetailElement(
          detail.label,
          discountedValue,
          "€/kWh",
          !!discount?.luz
        )
      );
    });
  }

  // Add gas details if enabled
  if (luzGas) {
    const selectedEscalao =
      document.querySelector('input[name="gasEscalao"]:checked')?.value || "1";
    const gasDetails = getGasDetails(company, selectedEscalao);

    if (gasDetails) {
      // Apply gas discount if exists
      const discountedGasDetails = {
        energia: discount?.gas
          ? gasDetails.energia * (1 - discount.gas / 100)
          : gasDetails.energia
      };

      const gasContainer = createGasDetailsElements(
        company,
        selectedEscalao,
        discountedGasDetails,
        !!discount?.gas
      );
      fragment.appendChild(gasContainer);
    }
  }

  detailsContainer.innerHTML = "";
  detailsContainer.appendChild(fragment);
}

// Results Display Function
export function displayResults(
  results,
  calculationDays,
  energyDiscount,
  gasDiscount
) {
  const container = document.getElementById("resultsContainer");
  if (!container) return;

  const currentResult = results.find((result) => result.isCurrent);
  if (!currentResult) return;

  container.innerHTML = generateResultsHTML(
    results,
    currentResult,
    calculationDays,
    energyDiscount,
    gasDiscount
  );
  animateResultsCards();
}

function generateResultsHTML(
  results,
  currentResult,
  calculationDays,
  energyDiscount,
  gasDiscount
) {
  return `
    <div class="w-full">
      <h2 class="text-2xl font-semibold text-gray-800 mb-6">
        <i class="fas fa-chart-bar text-electric mr-2"></i> Resultados
      </h2>
      
      ${generatePotentialCostsSection(
        calculationDays,
        energyDiscount,
        gasDiscount
      )}
      ${generateCurrentProviderSection(currentResult)}
      
      <h3 class="text-lg font-medium text-gray-800 mb-4">Opções Disponíveis</h3>
      ${generateAvailableOptionsHTML(results, currentResult)}
      
      ${generateDisclaimerSection(energyDiscount, gasDiscount)}
    </div>
  `;
}

function generatePotentialCostsSection(
  calculationDays,
  energyDiscount,
  gasDiscount
) {
  return `
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
  `;
}

function generateCurrentProviderSection(currentResult) {
  return `
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
            <span>Energia: €${currentResult.energyCost.toFixed(2)}</span>
          </div>
          ${
            currentResult.gasCost > 0
              ? `
          <div>
            <i class="fas fa-fire mr-1"></i>
            <span>Gás: €${currentResult.gasCost.toFixed(2)}</span>
          </div>
          `
              : ""
          }
        </div>
      </div>
    </div>
  `;
}

function generateAvailableOptionsHTML(results, currentResult) {
  return results
    .filter((result) => !result.isCurrent)
    .map((result, index) => {
      const savings = currentResult.total - result.total;
      const savingsPercentage = ((savings / currentResult.total) * 100).toFixed(
        1
      );
      const isSaving = savings > 0;

      return `
        <div class="result-card mb-4 p-4 rounded-lg border ${
          index === 0
            ? "border-savings bg-green-50"
            : "border-gray-200 bg-white"
        }">
          <div class="flex justify-between items-center mb-1">
            <div class="flex items-center">
              <span class="font-bold text-gray-800">${result.company}</span>
              ${
                index === 0
                  ? '<span class="ml-2 px-2 py-1 bg-savings text-white text-xs rounded-full">Melhor Opção</span>'
                  : ""
              }
            </div>
            <div class="text-lg font-bold">€${result.total.toFixed(2)}</div>
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
                ${isSaving ? "Economia" : "Custo adicional"}: €${Math.abs(
        savings
      ).toFixed(2)}
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
    })
    .join("");
}

function generateDisclaimerSection(energyDiscount, gasDiscount) {
  return `
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
  `;
}

function animateResultsCards() {
  const cards = document.querySelectorAll(".result-card");
  cards.forEach((card, i) => {
    setTimeout(() => {
      card.classList.add("show");
    }, i * 150);
  });
}

// Event Listeners Setup
document.addEventListener("DOMContentLoaded", () => {
  const elements = {
    power: document.getElementById("power"),
    tariffType: document.querySelectorAll('input[name="tariffType"]'),
    simulationType: document.getElementById("simulationType"),
    gasEscalao: document.querySelectorAll('input[name="gasEscalao"]'),
    includeGas: document.getElementById("includeGas"),
  };

  const updateFormValues = () => {
    // Verificar se os cards existem antes de atualizar
    const cardsExist = COMPANIES.every((company) => {
      const cardId = `${company.toLowerCase()}Card`;
      return document.getElementById(cardId);
    });

    if (!cardsExist) {
      console.warn(
        "Provider cards not found in DOM. Waiting for cards to be created..."
      );
      return;
    }

    const currentPower = elements.power?.value || 0;
    const currentTariffType =
      document.querySelector('input[name="tariffType"]:checked')?.value ||
      "simples";
    updateCardValues(currentPower, currentTariffType);
  };

  // Setup event listeners
  if (elements.power) {
    elements.power.addEventListener("input", updateFormValues);
  }

  elements.tariffType.forEach((radio) => {
    radio.addEventListener("change", updateFormValues);
  });

  if (elements.simulationType) {
    elements.simulationType.addEventListener("input", () => {
      updateGasSection(elements.simulationType.checked);
      updateFormValues();
    });
  }

  elements.gasEscalao.forEach((radio) => {
    radio.addEventListener("change", updateFormValues);
  });

  if (elements.includeGas) {
    elements.includeGas.addEventListener("input", () => {
      updateGasSection(elements.includeGas.checked);
      updateFormValues();
    });
  }

  // Aguardar um pequeno delay para garantir que os cards foram criados
  setTimeout(() => {
    updateFormValues();
  }, 100);
});
