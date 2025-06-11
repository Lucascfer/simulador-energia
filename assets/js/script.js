import {
  COMPANIES,
  POWER_COSTS,
  TARIFF_VALUES,
  GAS_PRICES,
} from "./constants.js";
import { getPowerCost, calculateSavings } from "./calculations.js";
import {
  getNumericValue,
  updateTariffFields,
  updateGasSection,
  updateCardValues,
  displayResults,
} from "./ui.js";
import { createApp } from "./components/App.js";

// Inicializa a aplicação
document.addEventListener("DOMContentLoaded", function () {
  // Renderiza a aplicação
  document.body.innerHTML = createApp();

  // Initialize tariff fields
  const initialTariffType =
    document.querySelector('input[name="tariffType"]:checked')?.value ||
    "simples";

  // Add events for tariff radio buttons
  document.querySelectorAll('input[name="tariffType"]').forEach((radio) => {
    radio.addEventListener("change", function () {
      // Remove required attribute from all tariff inputs first
      document
        .querySelectorAll('[id^="consumption"], [id^="value"]')
        .forEach((input) => {
          input.removeAttribute("required");
        });

      // Add required attribute only to visible inputs
      const tariffType = this.value;
      switch (tariffType) {
        case "simples":
          const consumptionSimples =
            document.getElementById("consumptionSimples");
          const valueSimples = document.getElementById("valueSimples");
          if (consumptionSimples)
            consumptionSimples.setAttribute("required", "");
          if (valueSimples) valueSimples.setAttribute("required", "");
          break;
        case "biHorario":
          const consumptionBiHorarioVazio = document.getElementById(
            "consumptionBiHorarioVazio"
          );
          const consumptionBiHorarioForaVazio = document.getElementById(
            "consumptionBiHorarioForaVazio"
          );
          const valueBiHorarioVazio = document.getElementById(
            "valueBiHorarioVazio"
          );
          const valueBiHorarioForaVazio = document.getElementById(
            "valueBiHorarioForaVazio"
          );
          if (consumptionBiHorarioVazio)
            consumptionBiHorarioVazio.setAttribute("required", "");
          if (consumptionBiHorarioForaVazio)
            consumptionBiHorarioForaVazio.setAttribute("required", "");
          if (valueBiHorarioVazio)
            valueBiHorarioVazio.setAttribute("required", "");
          if (valueBiHorarioForaVazio)
            valueBiHorarioForaVazio.setAttribute("required", "");
          break;
        case "triHorario":
          const consumptionTriHorarioPonta = document.getElementById(
            "consumptionTriHorarioPonta"
          );
          const consumptionTriHorarioCheia = document.getElementById(
            "consumptionTriHorarioCheia"
          );
          const consumptionTriHorarioVazio = document.getElementById(
            "consumptionTriHorarioVazio"
          );
          const valueTriHorarioPonta = document.getElementById(
            "valueTriHorarioPonta"
          );
          const valueTriHorarioCheia = document.getElementById(
            "valueTriHorarioCheia"
          );
          const valueTriHorarioVazio = document.getElementById(
            "valueTriHorarioVazio"
          );
          if (consumptionTriHorarioPonta)
            consumptionTriHorarioPonta.setAttribute("required", "");
          if (consumptionTriHorarioCheia)
            consumptionTriHorarioCheia.setAttribute("required", "");
          if (consumptionTriHorarioVazio)
            consumptionTriHorarioVazio.setAttribute("required", "");
          if (valueTriHorarioPonta)
            valueTriHorarioPonta.setAttribute("required", "");
          if (valueTriHorarioCheia)
            valueTriHorarioCheia.setAttribute("required", "");
          if (valueTriHorarioVazio)
            valueTriHorarioVazio.setAttribute("required", "");
          break;
      }

      updateTariffFields(this.value);
      updateCardValues(getNumericValue("power"), this.value);
    });
  });

  // Initialize required fields for initial tariff type
  document
    .querySelector(`input[name="tariffType"][value="${initialTariffType}"]`)
    .dispatchEvent(new Event("change"));

  // Initialize card values
  const power = getNumericValue("power");
  updateCardValues(power, initialTariffType);

  // Add event for gas switch
  const simulationType = document.getElementById("simulationType");
  if (simulationType) {
    simulationType.addEventListener("change", function () {
      updateGasSection(this.checked);
    });
  }

  // Add event for power input
  const powerInput = document.getElementById("power");
  if (powerInput) {
    powerInput.addEventListener("input", function () {
      const power = getNumericValue("power");
      const tariffType =
        document.querySelector('input[name="tariffType"]:checked')?.value ||
        "simples";
      updateCardValues(power, tariffType);
    });
  }

  // Add event for form submission
  const form = document.getElementById("simulatorForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form values with null checks
      const tariffTypeRadio = document.querySelector(
        'input[name="tariffType"]:checked'
      );
      const tariffType = tariffTypeRadio ? tariffTypeRadio.value : "simples";
      const power = getNumericValue("power");
      const calculationDays = getNumericValue("calculationDays", 30);
      const energyDiscount = getNumericValue("energyDiscount");
      const gasDiscount = getNumericValue("gasDiscount");
      const includeGas =
        document.getElementById("simulationType")?.checked || false;

      // Get consumption values based on tariff type
      let consumption = {};
      switch (tariffType) {
        case "simples":
          consumption = {
            simples: {
              value: getNumericValue("valueSimples"),
              amount: getNumericValue("consumptionSimples"),
            },
          };
          break;

        case "biHorario":
          consumption = {
            vazio: {
              value: getNumericValue("valueBiHorarioVazio"),
              amount: getNumericValue("consumptionBiHorarioVazio"),
            },
            foraVazio: {
              value: getNumericValue("valueBiHorarioForaVazio"),
              amount: getNumericValue("consumptionBiHorarioForaVazio"),
            },
          };
          break;

        case "triHorario":
          consumption = {
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
          break;
      }

      // Calculate and display results
      const results = calculateSavings(
        consumption,
        tariffType,
        power,
        calculationDays,
        energyDiscount,
        gasDiscount
      );
      displayResults(results, calculationDays, energyDiscount, gasDiscount);
    });
  }
});
