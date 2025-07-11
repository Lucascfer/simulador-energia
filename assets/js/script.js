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

  // Mostrar/esconder o formulário extra ao clicar no botão
  const openExtraFormBtn = document.getElementById("openExtraFormBtn");
  let customFormDiv = document.getElementById("custom_form_inline");
  if (!customFormDiv) {
    customFormDiv = document.createElement("div");
    customFormDiv.id = "custom_form_inline";
    customFormDiv.classList.add("hidden");
    openExtraFormBtn?.insertAdjacentElement("afterend", customFormDiv);
  }
  if (openExtraFormBtn && customFormDiv) {
    customFormDiv.innerHTML = `
      <form id="clientRegisterForm" class="bg-white rounded-lg shadow-lg p-6 max-w-xl mx-auto mt-6">
        <h2 class="text-2xl font-bold mb-4 text-gray-900">Cadastro de Cliente</h2>
        <h3 class="text-lg font-semibold mt-4 mb-2 text-gray-900">Contato</h3>
        <div style="background: #f7fafc; border: 2px solid #d1d5db; border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 1.5rem;">
          <div class="mb-4">
            <label for="nome" class="block text-sm font-medium text-gray-700 mb-1">Primeiro Nome *</label>
            <input type="text" id="nome" name="nome" required class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus:border-electric" />
          </div>
          <div class="mb-4">
            <label for="apelido" class="block text-sm font-medium text-gray-700 mb-1">Sobrenome *</label>
            <input type="text" id="apelido" name="apelido" required class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus:border-electric" />
          </div>
          <div class="mb-4">
            <label for="telefone" class="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
            <input type="text" id="telefone" name="telefone" required class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus:border-electric" />
          </div>
          <div class="mb-4">
            <label for="nif" class="block text-sm font-medium text-gray-700 mb-1">NIF</label>
            <input type="text" id="nif" name="nif" class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus:border-electric" />
          </div>
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input type="email" id="email" name="email" class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus:border-electric" />
          </div>
          </div>
          <h3 class="text-lg font-semibold mt-4 mb-2 text-gray-900">Negócio</h3>
          <div class="mb-4">
            <label for="comercializadoraAtual" class="block text-sm font-medium text-gray-700 mb-1">Comercializadora Atual</label>
            <input type="text" id="comercializadoraAtual" name="comercializadoraAtual" class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus:border-electric" />
          </div>
          <div class="mb-4">
            <label for="comercializadoraMelhor" class="block text-sm font-medium text-gray-700 mb-1">Comercializadora com Melhor Proposta *</label>
            <select required id="comercializadoraMelhor" name="comercializadoraMelhor" class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus:border-electric">
              <option value="">Selecione...</option>
            </select>
          </div>
          <div class="mb-4">
            <label for="moradaFornecimento" class="block text-sm font-medium text-gray-700 mb-1">Morada de Fornecimento</label>
            <input type="text" id="moradaFornecimento" name="moradaFornecimento" class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus:border-electric" />
          </div>
          <div class="mb-4">
            <label for="codigoPostal" class="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
            <input type="text" id="codigoPostal" name="codigoPostal" class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus:border-electric" />
          </div>
          <div class="mb-4">
            <label for="oferta" class="block text-sm font-medium text-gray-700 mb-1">Oferta</label>
            <input type="text" id="oferta" name="oferta" class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus:border-electric" />
          </div>
          <div class="mb-4">
            <label for="produto" class="block text-sm font-medium text-gray-700 mb-1">Produto</label>
            <select id="produto" name="produto" class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus:border-electric">
              <option value="">Selecione...</option>
            </select>
          </div>
        </div>
        <h3 class="text-lg font-semibold mt-6 mb-2 text-gray-900">Luz</h3>
        <div style="background: #f0f4ff; border: 2px solid #3B82F6; border-radius: 0.75rem; padding: 1.5rem; position: relative;">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="mb-4">
              <label for="potenciaContratada" class="block text-sm font-medium text-gray-700 mb-1">Potência Contratada</label>
              <input type="text" id="potenciaContratada" name="potenciaContratada" class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus:border-electric" />
            </div>
            <div class="mb-4">
              <label for="valorPotenciaDia" class="block text-sm font-medium text-gray-700 mb-1">Valor da Potência/Dia</label>
              <input type="text" id="valorPotenciaDia" name="valorPotenciaDia" class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus:border-electric" />
            </div>
            <div class="mb-4">
              <label for="valorKwhLuz" class="block text-sm font-medium text-gray-700 mb-1">Valor KW/H Luz</label>
              <input type="text" id="valorKwhLuz" name="valorKwhLuz" class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus:border-electric" />
            </div>
            <div class="mb-4">
              <label for="cpe" class="block text-sm font-medium text-gray-700 mb-1">CPE</label>
              <input type="text" id="cpe" name="cpe" class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus:border-electric" />
            </div>
          </div>
        </div>
        <h3 class="text-lg font-semibold mt-6 mb-2 text-gray-900">Gás</h3>
        <div class="mb-6" style="background: #FFF5F5; border: 2px solid #F97316; border-radius: 0.75rem; padding: 1.5rem; position: relative;">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="mb-4">
              <label for="escalaoGas" class="block text-sm font-medium text-gray-700 mb-1">Escalão Gás</label>
              <input type="text" id="escalaoGas" name="escalaoGas" class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus-border-electric" />
            </div>
            <div class="mb-4">
              <label for="valorEscalaoGas" class="block text-sm font-medium text-gray-700 mb-1">Valor Escalão Gás</label>
              <input type="text" id="valorEscalaoGas" name="valorEscalaoGas" class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus-border-electric" />
            </div>
            <div class="mb-4">
              <label for="valorKwhGas" class="block text-sm font-medium text-gray-700 mb-1">Valor KW/H Gás</label>
              <input type="text" id="valorKwhGas" name="valorKwhGas" class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus-border-electric" />
            </div>
            <div class="mb-4">
              <label for="cui" class="block text-sm font-medium text-gray-700 mb-1">CUI</label>
              <input type="text" id="cui" name="cui" class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus-border-electric" />
            </div>
          </div>
        </div>
        <h3 class="text-lg font-semibold mt-6 mb-2 text-gray-900">Informações adicionais</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="mb-4 flex items-center">
            <input type="checkbox" id="debitoDireto" name="debitoDireto" class="mr-2 h-5 w-5 text-electric focus:ring-electric border-gray-300 rounded" />
            <label for="debitoDireto" class="block text-sm font-medium text-gray-700 mb-0">Débito Direto</label>
          </div>
          <div class="mb-4 flex items-center">
            <input type="checkbox" id="faturaEletronica" name="faturaEletronica" class="mr-2 h-5 w-5 text-electric focus:ring-electric border-gray-300 rounded" />
            <label for="faturaEletronica" class="block text-sm font-medium text-gray-700 mb-0">Fatura Eletrônica</label>
          </div>
          <div class="mb-4">
            <label for="leadCriadoPor" class="block text-sm font-medium text-gray-700 mb-1">Lead criado por *</label>
            <select id="leadCriadoPor" name="leadCriadoPor" required class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus-border-electric">
              <option value="">Selecione o responsável...</option>
            </select>
          </div>
        </div>
        <h3 class="text-lg font-semibold mt-4 mb-2 text-gray-900">Documentos</h3>
        <div style="background: #d1d5db; border: 2px solid #f7fafc; border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 1.5rem;">
        <div class="mb-4">
          <label for="docCartaoCidadao" class="block text-sm font-medium text-gray-700 mb-1">Cartão de Cidadão</label>
          <input type="file" id="docCartaoCidadao" name="docCartaoCidadao" accept="image/*,application/pdf" class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus-border-electric" />
        </div>
        <div class="mb-4">
          <label for="docIBAN" class="block text-sm font-medium text-gray-700 mb-1">Comprovativo de IBAN</label>
          <input type="file" id="docIBAN" name="docIBAN" accept="image/*,application/pdf" class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus-border-electric" />
        </div>
        <div class="mb-4">
          <label for="docPropsta" class="block text-sm font-medium text-gray-700 mb-1">Proposta Preenchida e Assinada</label>
          <input type="file" id="docPropsta" name="docPropsta" accept="image/*,application/pdf" class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus-border-electric" />
        </div>
        <div class="mb-4">
          <label for="docFatura" class="block text-sm font-medium text-gray-700 mb-1">Fatura de energia</label>
          <input type="file" id="docFatura" name="docFatura" accept="image/*,application/pdf" class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus-border-electric" />
        </div>
        <div class="mb-4">
          <label for="docContrato" class="block text-sm font-medium text-gray-700 mb-1">Contrato de arrendamento ou atestado de morada</label>
          <input type="file" id="docContrato" name="docContrato" accept="image/*,application/pdf" class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus-border-electric" />
        </div>
        <div class="mb-4">
          <label for="docCertidao" class="block text-sm font-medium text-gray-700 mb-1">Certidão permanente</label>
          <input type="file" id="docCertidao" name="docCertidao" accept="image/*,application/pdf" class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus-border-electric" />
        </div>
        <div class="mb-4">
          <label for="documentos" class="block text-sm font-medium text-gray-700 mb-1">Documentos Extras</label>
          <input type="file" id="documentos" name="documentos" accept="image/*,application/pdf" multiple class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus-border-electric" />
        </div>
        </div>
        <button type="submit" class="w-full custom-gradient-btn text-white py-3 px-6 rounded-lg transition-colors duration-200 mt-4">Enviar</button>
      </form>
    `;
    customFormDiv.classList.add("hidden");
    openExtraFormBtn.addEventListener("click", function () {
      if (customFormDiv.classList.contains("hidden")) {
        customFormDiv.classList.remove("hidden");
        openExtraFormBtn.innerHTML =
          '<i class="fas fa-times" style="color:#fff;"></i> Fechar formulário';
        setTimeout(() => {
          customFormDiv.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      } else {
        customFormDiv.classList.add("hidden");
        openExtraFormBtn.innerHTML =
          '<i class="fas fa-edit" style="color:#fff;"></i> Cadastrar Cliente & Contrato';
      }
    });

    const leadCriadoPorSelect = customFormDiv.querySelector("#leadCriadoPor");
    if (leadCriadoPorSelect) {
      const responsaveis = [
        { id: "66", nome: "Raquel Almeida" },
        { id: "46", nome: "Susana Paixão" },
        { id: "82", nome: "Camilla Leal" },
      ];
      responsaveis.forEach((resp) => {
        const opt = document.createElement("option");
        opt.value = resp.id;
        opt.textContent = resp.nome;
        leadCriadoPorSelect.appendChild(opt);
      });
    }

    // Função para converter arquivo em base64
    function fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    // Submissão do formulário
    customFormDiv
      .querySelector("#clientRegisterForm")
      .addEventListener("submit", function (e) {
        e.preventDefault();
        const submitBtn = customFormDiv.querySelector('button[type="submit"]');
        const originalBtnHTML = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loader" style="display:inline-block;width:22px;height:22px;border:3px solid #FFD700;border-top:3px solid #fff;border-radius:50%;animation:spin 1s linear infinite;vertical-align:middle;margin-right:8px;"></span>Enviando...';
        const nome = customFormDiv.querySelector("#nome").value;
        const apelido = customFormDiv.querySelector("#apelido").value;
        const telefone = customFormDiv.querySelector("#telefone").value;
        const nif = customFormDiv.querySelector("#nif").value;
        const email = customFormDiv.querySelector("#email").value;
        const moradaFornecimento = customFormDiv.querySelector(
          "#moradaFornecimento"
        ).value;
        const codigoPostal = customFormDiv.querySelector("#codigoPostal").value;
        const comercializadoraAtual = customFormDiv.querySelector(
          "#comercializadoraAtual"
        ).value;
        const comercializadoraMelhor = customFormDiv.querySelector(
          "#comercializadoraMelhor"
        ).value;
        const oferta = customFormDiv.querySelector("#oferta").value;
        const produto = customFormDiv.querySelector("#produto").value;
        const potenciaContratada = customFormDiv.querySelector(
          "#potenciaContratada"
        ).value;
        const valorPotenciaDia =
          customFormDiv.querySelector("#valorPotenciaDia").value;
        const valorKwhLuz = customFormDiv.querySelector("#valorKwhLuz").value;
        const cpe = customFormDiv.querySelector("#cpe").value;
        const escalaoGas = customFormDiv.querySelector("#escalaoGas").value;
        const valorEscalaoGas =
          customFormDiv.querySelector("#valorEscalaoGas").value;
        const valorKwhGas = customFormDiv.querySelector("#valorKwhGas").value;
        const cui = customFormDiv.querySelector("#cui").value;
        const infosTecnicas = `Informações da Luz: Potência Contratada: ${potenciaContratada}, Valor da Potência/Dia: ${valorPotenciaDia}, Valor KW/H Luz: ${valorKwhLuz}, CPE: ${cpe}; Informações do Gás: Escalão: ${escalaoGas}, Valor Escalão Gás: ${valorEscalaoGas}, Valor KW/H Gás: ${valorKwhGas}, CUI: ${cui}`;
        const debitoDireto = customFormDiv.querySelector("#debitoDireto")
          .checked
          ? 1
          : 0;
        const faturaEletronica = customFormDiv.querySelector(
          "#faturaEletronica"
        ).checked
          ? 1
          : 0;
        const responsavelId =
          customFormDiv.querySelector("#leadCriadoPor").value;
        const documentosInput = customFormDiv.querySelector("#documentos");
        const documentosFiles = documentosInput.files;
        const docCartaoCidadao =
          customFormDiv.querySelector("#docCartaoCidadao").files[0] || null;
        const docIBAN =
          customFormDiv.querySelector("#docIBAN").files[0] || null;
        const docPropsta =
          customFormDiv.querySelector("#docPropsta").files[0] || null;
        const docFatura =
          customFormDiv.querySelector("#docFatura").files[0] || null;
        const docContrato =
          customFormDiv.querySelector("#docContrato").files[0] || null;
        const docCertidao =
          customFormDiv.querySelector("#docCertidao").files[0] || null;

        // Primeiro fetch para pegar o ID do contato da comercializadora
        fetch(
          `https://scriptai.bitrix24.eu/rest/68/ye7rcklmis4m3p5a/crm.contact.list?FILTER[NAME]=${comercializadoraMelhor}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => response.json())
          .then(async (data) => {
            const comercializadoraID = data.result[0];
            // Converter arquivos para base64
            return Promise.all(
              Array.from(documentosFiles).map(async (file) => ({
                fileData: await fileToBase64(file),
                fileName: file.name,
                fileType: file.type,
              }))
            ).then((documentosArray) => ({
              comercializadoraID,
              documentosArray,
            }));
          })
          .then(({ comercializadoraID, documentosArray }) => {
            // Montar a URL e o corpo para criar o negócio (deal)
            const url = `https://scriptai.bitrix24.eu/rest/68/ye7rcklmis4m3p5a/crm.deal.add.json`;
            const body = {
              FIELDS: {
                TITLE: `${nome} ${apelido} - ${nif}`,
                CONTACT_ID: comercializadoraID.ID,
                UF_CRM_1751560635722: telefone, // "contato/telefone do cliente" - campo deal
                UF_CRM_1751639120142: email, // "contato/email do cliente" - campo deal
                UF_CRM_1744875846819: moradaFornecimento,
                UF_CRM_1744875971691: codigoPostal,
                UF_CRM_1751640327698: comercializadoraAtual,
                UF_CRM_1751640353466: comercializadoraMelhor,
                UF_CRM_1743668642121: oferta,
                UF_CRM_1751643980492: nif,
                UF_CRM_1743668621554: produto,
                UF_CRM_1743668642121: oferta,
                UF_CRM_1752053109190: infosTecnicas, // Informações Técnicas
                UF_CRM_1751900708698: docCartaoCidadao, // Cartão de Cidadão
                UF_CRM_1751900744976: docIBAN, // Comprovativo de IBAN
                UF_CRM_1751900777494: docPropsta, // Proposta Preenchida e Assinada
                UF_CRM_1751900815592: docFatura, // Fatura de energia
                UF_CRM_1751900865433: docContrato, // Contrato de arrendamento ou atestado de morada
                UF_CRM_1751962727087: docCertidao, // Certidão permanente
                UF_CRM_1744877268028: debitoDireto,
                UF_CRM_1744877294531: faturaEletronica,
                UF_CRM_1743668942049: documentosArray,
                CATEGORY_ID: 16, // Energia Residencial
                STAGE_ID: "C16:NEW", // Primeiro estágio do negócio
                ASSIGNED_BY_ID: responsavelId, // ID do responsável pelo negócio
              },
            };
            return fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(body),
            });
          })
          .then(async (response) => {
            const data = await response.json();
            const dealId = data.result; // ID do negócio criado

            // 1. Buscar contatos já associados ao negócio
            return fetch(
              `https://scriptai.bitrix24.eu/rest/68/ye7rcklmis4m3p5a/crm.deal.get.json?ID=${dealId}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            )
              .then((res) => res.json())
              .then(async (dealData) => {
                const existingContacts = dealData.result.CONTACT_ID;
                console.log("Contatos existentes:", existingContacts);
                // 2. Criar o novo contato
                return fetch(
                  `https://scriptai.bitrix24.eu/rest/68/ye7rcklmis4m3p5a/crm.contact.add.json?FIELDS[NAME]=${nome}&FIELDS[LAST_NAME]=${apelido}&FIELDS[EMAIL][0][VALUE]=${email}&FIELDS[EMAIL][0][VALUE_TYPE]=WORK&FIELDS[PHONE][0][VALUE]=${telefone}&FIELDS[PHONE][0][VALUE_TYPE]=WORK`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                )
                  .then((res) => res.json())
                  .then((dataClient) => {
                    const clientId = dataClient.result;
                    // 3. Adicionar o novo contato ao array de contatos do negócio
                    const updatedContacts = [existingContacts, clientId.toString()];
                    return fetch(
                      `https://scriptai.bitrix24.eu/rest/68/ye7rcklmis4m3p5a/crm.deal.update`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          ID: dealId, // ID do negócio já criado
                          FIELDS: {
                            CONTACT_IDS: updatedContacts
                          },
                        }),
                      }
                    );
                  });
              });
          })
          .then(() => {
            // Exibe a mensagem de sucesso somente após o envio bem-sucedido
            const formSuccessMsg =
              customFormDiv.querySelector("#top-success-notification");
            // Notificação fixa no topo
            showTopNotification('Cadastro enviado com sucesso!');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
            setTimeout(() => {
              if (formSuccessMsg) formSuccessMsg.style.display = "none";
              customFormDiv.classList.add("hidden");
              openExtraFormBtn.innerHTML =
                '<i class="fas fa-edit"></i> Cadastrar Cliente & Contrato';
            }, 2000);
          })
          .catch((error) => {
            console.error("Erro:", error);
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
          });
      });

    // Após inserir o HTML, popular o select de produto dinamicamente
    const produtoSelect = customFormDiv.querySelector("#produto");
    if (produtoSelect) {
      const produtos = [
        { ID: "176", VALUE: "Luz" },
        { ID: "178", VALUE: "Luz + Gás" },
        { ID: "180", VALUE: "Luz + Solar" },
        { ID: "182", VALUE: "Luz + Solar + Gás" },
      ];
      produtos.forEach((prod) => {
        const opt = document.createElement("option");
        opt.value = prod.ID;
        opt.textContent = prod.VALUE;
        produtoSelect.appendChild(opt);
      });
    }

    // Popular o select de comercializadoraMelhor com os nomes do constants.js
    import("./constants.js").then(({ COMPANIES }) => {
      const comercializadoraMelhorSelect = customFormDiv.querySelector("#comercializadoraMelhor");
      if (comercializadoraMelhorSelect && Array.isArray(COMPANIES)) {
        COMPANIES.forEach((company) => {
          const opt = document.createElement("option");
          opt.value = company;
          opt.textContent = company;
          comercializadoraMelhorSelect.appendChild(opt);
        });
      }
    });

    // Garante que a mensagem de sucesso fique oculta por padrão
    const formSuccessMsg = customFormDiv.querySelector("#formSuccessMsg");
    if (formSuccessMsg) {
      formSuccessMsg.style.display = "none";
    }
  }

  // Atualiza as opções do select de potência conforme a tarifa selecionada
  function setupDynamicPowerOptions() {
    const powerSelect = document.getElementById("power");
    const tariffRadios = document.querySelectorAll('input[name="tariffType"]');
    if (!powerSelect || !tariffRadios.length) return;
    const powerOptionsSimples = [
      { value: "1.15", label: "1.15 kVA" },
      { value: "2.30", label: "2.30 kVA" },
      { value: "3.45", label: "3.45 kVA" },
      { value: "4.60", label: "4.60 kVA" },
      { value: "5.75", label: "5.75 kVA" },
      { value: "6.90", label: "6.90 kVA" },
      { value: "10.35", label: "10.35 kVA" },
      { value: "13.80", label: "13.80 kVA" },
      { value: "17.25", label: "17.25 kVA" },
      { value: "20.70", label: "20.70 kVA" },
    ];
    const powerOptionsBiHorario = [
      { value: "3.45", label: "3.45 kVA" },
      { value: "4.60", label: "4.60 kVA" },
      { value: "5.75", label: "5.75 kVA" },
      { value: "6.90", label: "6.90 kVA" },
      { value: "10.35", label: "10.35 kVA" },
      { value: "13.80", label: "13.80 kVA" },
      { value: "17.25", label: "17.25 kVA" },
      { value: "20.70", label: "20.70 kVA" },
    ];
    const powerOptionsTriHorario = [
      { value: "27.60", label: "27.60 kVA" },
      { value: "34.50", label: "34.50 kVA" },
      { value: "41.40", label: "41.40 kVA" },
    ];
    function updatePowerOptions() {
      const selectedTariff = document.querySelector(
        'input[name="tariffType"]:checked'
      ).value;
      let options;
      if (selectedTariff === "simples") {
        options = powerOptionsSimples;
      } else if (selectedTariff === "biHorario") {
        options = powerOptionsBiHorario;
      } else if (selectedTariff === "triHorario") {
        options = powerOptionsTriHorario;
      } else {
        options = [];
      }
      const currentValue = powerSelect.value;
      powerSelect.innerHTML =
        '<option value="" disabled selected>Selecione...</option>' +
        options
          .map((opt) => `<option value="${opt.value}">${opt.label}</option>`)
          .join("");
      // Se o valor atual ainda existir, mantém selecionado
      if (options.some((opt) => opt.value === currentValue)) {
        powerSelect.value = currentValue;
      }
    }
    tariffRadios.forEach((radio) => {
      radio.addEventListener("change", updatePowerOptions);
    });
    // Inicializa ao carregar
    updatePowerOptions();
  }

  // Execute após o DOM estar pronto e o formulário estar na página
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupDynamicPowerOptions);
  } else {
    setupDynamicPowerOptions();
  }

  // Atualiza os cards ao marcar/desmarcar checkboxes de desconto
  [
    "directDebit",
    "electronicInvoice",
    "additionalServices",
    "debitoDireto",
    "faturaEletronica",
  ].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("change", function () {
        const power = getNumericValue("power");
        const tariffType =
          document.querySelector('input[name="tariffType"]:checked')?.value ||
          "simples";
        updateCardValues(power, tariffType);
      });
    }
  });
});

// Adiciona o CSS do spinner ao head se não existir
if (!document.getElementById('custom-loader-style')) {
  const style = document.createElement('style');
  style.id = 'custom-loader-style';
  style.innerHTML = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  .custom-gradient-btn {
    background: linear-gradient(90deg, #130035 0%, #0f58d0 60%, #3e45ab 100%);
    border: none;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(16,0,53,0.08);
  }
  .custom-gradient-btn:hover, .custom-gradient-btn:focus {
    filter: brightness(1.08) saturate(1.1);
    box-shadow: 0 4px 16px rgba(16,0,53,0.13);
  }`;
  document.head.appendChild(style);
}

// Função para notificação fixa no topo
function showTopNotification(message) {
  let notif = document.getElementById('top-success-notification');
  if (!notif) {
    notif = document.createElement('div');
    notif.id = 'top-success-notification';
    notif.style.position = 'fixed';
    notif.style.top = '0';
    notif.style.left = '50%';
    notif.style.transform = 'translateX(-50%)';
    notif.style.background = '#FFD700';
    notif.style.color = '#7c5700';
    notif.style.fontWeight = 'bold';
    notif.style.borderRadius = '0 0 1.5rem 1.5rem';
    notif.style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)';
    notif.style.fontSize = '1.1rem';
    notif.style.textAlign = 'center';
    notif.style.margin = '0 auto';
    notif.style.maxWidth = '420px';
    notif.style.padding = '1rem 2rem';
    notif.style.zIndex = '9999';
    notif.style.opacity = '0';
    notif.style.transition = 'opacity 0.4s';
    document.body.appendChild(notif);
  }
  notif.textContent = message;
  notif.style.opacity = '1';
  notif.style.display = 'block';
  setTimeout(() => {
    notif.style.opacity = '0';
    setTimeout(() => { notif.style.display = 'none'; }, 400);
  }, 2500);
}
