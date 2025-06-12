import { COMPANIES } from "../constants.js";
import { updateTariffFields } from "./tariffs.js";
import { updateGasSection } from "./gas.js";
import { updateCardValues } from "./cards.js";
import { displayResults } from "./results.js";
import { getNumericValue, formatNumericValue } from "./utils.js";

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

export {
  updateTariffFields,
  updateGasSection,
  updateCardValues,
  displayResults,
  getNumericValue,
  formatNumericValue
}; 