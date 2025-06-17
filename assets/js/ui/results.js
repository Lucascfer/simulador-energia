import { setupExportButtons } from '../components/ExportResults.js';

export function displayResults(
  results,
  calculationDays,
  energyDiscount,
  gasDiscount,
  energyConsumption,
  gasConsumption
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
    gasDiscount,
    energyConsumption,
    gasConsumption
  );
  animateResultsCards();
  setupExportButtons();
}

function generateResultsHTML(
  results,
  currentResult,
  calculationDays,
  energyDiscount,
  gasDiscount,
  energyConsumption,
  gasConsumption
) {
  return `
    <div class="w-full" 
         data-energy-consumption='${JSON.stringify(energyConsumption)}'
         data-gas-consumption='${gasConsumption}'>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold text-gray-800">
          <i class="fas fa-chart-bar text-electric mr-2"></i> Resultados
        </h2>
        <div class="flex gap-2">
          <button id="exportImage" class="px-4 py-2 bg-electric text-white rounded-lg hover:bg-electric-dark transition-colors">
            <i class="fas fa-image mr-2"></i>Exportar Imagem
          </button>
          <button id="exportPDF" class="px-4 py-2 bg-electric text-white rounded-lg hover:bg-electric-dark transition-colors">
            <i class="fas fa-file-pdf mr-2"></i>Exportar PDF
          </button>
        </div>
      </div>
      
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
          <div class="text-lg font-bold">€${currentResult.total.toFixed(2)}</div>
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
      const savingsPercentage = ((savings / currentResult.total) * 100).toFixed(1);
      const isSaving = savings > 0;

      return `
        <div class="result-card mb-4 p-4 rounded-lg border ${
          index === 0
            ? "border-savings bg-green-50"
            : "border-gray-200 bg-white"
        }">
          <div class="flex justify-between items-center mb-1">
            <div class="flex items-center">
              <input type="checkbox" id="export-${result.company.replace(/\s/g, '')}" data-company="${result.company}" class="mr-2 form-checkbox h-4 w-4 text-electric" checked>
              <label for="export-${result.company.replace(/\s/g, '')}" class="font-bold text-gray-800">${result.company}</label>
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