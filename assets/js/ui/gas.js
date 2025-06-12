import { GAS_PRICES } from "../constants.js";
import { updateCardValues } from "./cards.js";

export function getGasDetails(company, selectedEscalao) {
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

export function createGasDetailsElements(
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

export function clearGasFields() {
  const gasFields = ["gasConsumption", "gasValue", "gasFixedTerm"];
  gasFields.forEach((field) => {
    const element = document.getElementById(field);
    if (element) element.value = "";
  });
}

export function hideGasDetails() {
  const gasDetails = document.querySelectorAll(
    ".gas-details, .gas-termo-fixo-details"
  );
  gasDetails.forEach((detail) => {
    detail.style.display = "none";
  });
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