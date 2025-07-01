import { calculateSavings } from "./calculations.js";
import {
  getNumericValue,
  updateTariffFields,
  updateGasSection,
  updateCardValues,
  displayResults,
} from "./ui.js";
import { createApp } from "./components/App.js";
import { calculateFormValues } from "./formCalculations.js";
import { setupExportButtons } from "./components/ExportResults.js";

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

  // Add event listeners for gas escalão radio buttons
  document.querySelectorAll('input[name="gasEscalao"]').forEach((radio) => {
    radio.addEventListener("change", function () {
      if (this.checked) {
        window.updateGasEscalao(this.value);
      }
    });
  });

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

  // Add event for collapsible billing services section
  const billingServicesHeader = document.getElementById(
    "billingServicesHeader"
  );
  if (billingServicesHeader) {
    billingServicesHeader.addEventListener("click", function () {
      const sectionContent = this.nextElementSibling;
      const toggleIcon = this.querySelector(".toggle-icon");

      if (sectionContent.classList.contains("hidden")) {
        sectionContent.classList.remove("hidden");
        toggleIcon.style.transform = "rotate(90deg)";
      } else {
        sectionContent.classList.add("hidden");
        toggleIcon.style.transform = "rotate(0deg)";
      }
    });

    // Initial state: ensure icon is pointing right if section is hidden
    const sectionContent = billingServicesHeader.nextElementSibling;
    const toggleIcon = billingServicesHeader.querySelector(".toggle-icon");
    if (sectionContent.classList.contains("hidden")) {
      toggleIcon.style.transform = "rotate(0deg)";
    }
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
      const powerValue = getNumericValue("powerValue");
      const powerDiscount = getNumericValue("powerDiscount");
      const calculationDays = getNumericValue("calculationDays", 30);

      const TARIFF_DISCOUNT_FIELDS = {
        simples: "energyDiscount",
        biHorario: {
          vazio: "energyDiscountVazio",
          foraVazio: "energyDiscountForaVazio",
        },
        triHorario: {
          ponta: "energyDiscountPonta",
          cheia: "energyDiscountCheia",
          vazio: "energyDiscountVazio",
        },
      };

      const energyDiscount =
        typeof TARIFF_DISCOUNT_FIELDS[tariffType] === "object"
          ? Object.entries(TARIFF_DISCOUNT_FIELDS[tariffType]).reduce(
              (acc, [key, field]) => {
                acc[key] = getNumericValue(field, 0);
                return acc;
              },
              {}
            )
          : getNumericValue(TARIFF_DISCOUNT_FIELDS[tariffType], 0);
      const gasDiscount = getNumericValue("gasDiscount", 0);
      const gasFixedTermDiscount = getNumericValue("gasFixedTermDiscount", 0);
      const gasCalculationDays = getNumericValue("gasCalculationDays", 30);

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

      // Get gas values if included
      const gasConsumption = includeGas ? getNumericValue("gasConsumption") : 0;
      const gasEscalao = includeGas
        ? document.querySelector('input[name="gasEscalao"]:checked')?.value ||
          "1"
        : "1";
      const gasValue = includeGas ? getNumericValue("gasValue") : 0;
      const gasFixedTerm = includeGas ? getNumericValue("gasFixedTerm") : 0;

      // Calculate current values using the new function
      const currentValues = calculateFormValues({
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
      });

      // Calculate results for other companies without discounts
      const otherCompaniesResults = calculateSavings(
        consumption,
        tariffType,
        power,
        calculationDays,
        gasConsumption,
        gasEscalao,
        gasCalculationDays
      );

      // Add current values to the results
      const results = otherCompaniesResults.map((result) => ({
        ...result,
        isCurrent: false,
      }));
      results.push({
        company: "Atual",
        total: currentValues.totalCost,
        energyCost: currentValues.energyCost + currentValues.powerCost,
        gasCost: currentValues.gasCost,
        isCurrent: true,
      });

      displayResults(
        results,
        calculationDays,
        energyDiscount,
        gasDiscount,
        consumption,
        gasConsumption
      );
      setupExportButtons();
      // Scroll suave para o componente de resultados
      setTimeout(() => {
        const resultsEl = document.getElementById("resultsContainer");
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    });
  }

  // Mostrar/esconder o formulário Bitrix24 ao clicar no botão
  const openExtraFormBtn = document.getElementById("openExtraFormBtn");
  const bx24FormDiv = document.getElementById("bx24_form_inline_24_oam7vz");
  if (openExtraFormBtn && bx24FormDiv) {
    // Começa escondido
    bx24FormDiv.classList.add("hidden");
    openExtraFormBtn.addEventListener("click", function () {
      if (bx24FormDiv.classList.contains("hidden")) {
        bx24FormDiv.classList.remove("hidden");
        openExtraFormBtn.innerHTML =
          '<i class="fas fa-times"></i> Fechar formulário';
        // Scroll suave para o formulário Bitrix24
        setTimeout(() => {
          bx24FormDiv.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      } else {
        bx24FormDiv.classList.add("hidden");
        openExtraFormBtn.innerHTML =
          '<i class="fas fa-edit"></i> Cadastrar Cliente & Contrato';
      }
    });
  }

  var formDiv = document.getElementById("bx24_form_inline_24_oam7vz");
  if (formDiv) {
    var s = document.createElement("script");
    s.async = true;
    s.setAttribute("data-b24-form", "inline/24/oam7vz");
    s.setAttribute("data-skip-moving", "true");
    s.src =
      "https://cdn.bitrix24.eu/b32877315/crm/form/loader_24.js?" +
      ((Date.now() / 180000) | 0);
    formDiv.appendChild(s);
  }

  // Atualiza as opções do select de potência conforme a tarifa selecionada
  function setupDynamicPowerOptions() {
    const powerSelect = document.getElementById('power');
    const tariffRadios = document.querySelectorAll('input[name="tariffType"]');
    if (!powerSelect || !tariffRadios.length) return;
    const powerOptionsSimples = [
      { value: '1.15', label: '1.15 kVA' },
      { value: '2.30', label: '2.30 kVA' },
      { value: '3.45', label: '3.45 kVA' },
      { value: '4.60', label: '4.60 kVA' },
      { value: '5.75', label: '5.75 kVA' },
      { value: '6.90', label: '6.90 kVA' },
      { value: '10.35', label: '10.35 kVA' },
      { value: '13.80', label: '13.80 kVA' },
      { value: '17.25', label: '17.25 kVA' },
      { value: '20.70', label: '20.70 kVA' }
    ];
    const powerOptionsBiHorario = [
      { value: '3.45', label: '3.45 kVA' },
      { value: '4.60', label: '4.60 kVA' },
      { value: '5.75', label: '5.75 kVA' },
      { value: '6.90', label: '6.90 kVA' },
      { value: '10.35', label: '10.35 kVA' },
      { value: '13.80', label: '13.80 kVA' },
      { value: '17.25', label: '17.25 kVA' },
      { value: '20.70', label: '20.70 kVA' }
    ];
    const powerOptionsTriHorario = [
      { value: '27.60', label: '27.60 kVA' },
      { value: '34.50', label: '34.50 kVA' },
      { value: '41.40', label: '41.40 kVA' }
    ];
    function updatePowerOptions() {
      const selectedTariff = document.querySelector('input[name="tariffType"]:checked').value;
      let options;
      if (selectedTariff === 'simples') {
        options = powerOptionsSimples;
      } else if (selectedTariff === 'biHorario') {
        options = powerOptionsBiHorario;
      } else if (selectedTariff === 'triHorario') {
        options = powerOptionsTriHorario;
      } else {
        options = [];
      }
      const currentValue = powerSelect.value;
      powerSelect.innerHTML = '<option value="" disabled selected>Selecione...</option>' +
        options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('');
      // Se o valor atual ainda existir, mantém selecionado
      if (options.some(opt => opt.value === currentValue)) {
        powerSelect.value = currentValue;
      }
    }
    tariffRadios.forEach(radio => {
      radio.addEventListener('change', updatePowerOptions);
    });
    // Inicializa ao carregar
    updatePowerOptions();
  }

  // Execute após o DOM estar pronto e o formulário estar na página
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupDynamicPowerOptions);
  } else {
    setupDynamicPowerOptions();
  }
});
