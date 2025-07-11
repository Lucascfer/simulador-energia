import { createHeader } from "./Header.js";
import { createProviderCards } from "./ProviderCards.js";
import { createSimulatorForm } from "./SimulatorForm.js";
import { createResultsContainer } from "./Results.js";

export function createApp() {
  return `
    <!DOCTYPE html>
    <html lang="pt">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Simulador de Economia - Scriptai</title>
        <link rel="preload" href="assets/css/styles.css" as="style" />
        <link rel="preload" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" as="style" />
        <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" as="style" />
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
        <link href="assets/css/styles.css" rel="stylesheet" />
      </head>
      <body class="bg-gray-50">
        ${createHeader()}

        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="text-center mb-12">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">
              Simulador de Economia - Scriptai
            </h1>
            <p class="text-xl text-gray-600">
              Preencha os campos abaixo para calcular o custo total e a economia
            </p>
          </div>

          <div class="max-w-4xl mx-auto p-6">
            ${createProviderCards()}

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Formulário -->
              <div class="bg-white rounded-lg shadow-lg p-6">
                ${createSimulatorForm()}
              </div>

              <!-- Resultados -->
              ${createResultsContainer()}
            </div>
          </div>
        </main>

        <!-- Botão de abrir formulário extra -->
        <div class="flex flex-col items-center justify-center my-12">
          <button id="openExtraFormBtn" style="background: linear-gradient(90deg, #130035 0%, #0f58d0 60%, #3e45ab 100%); border: none; font-weight: 600; box-shadow: 0 2px 8px rgba(16,0,53,0.08); color: #fff;" class="bg-white text-orange-500 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition text-lg flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-orange-400 border-2 border-orange-500">
            <i class="fas fa-edit " style="color:#fff;"></i> Cadastrar Cliente & Contrato
          </button>
        </div>
        <script type="module" src="assets/js/script.js"></script>
      </body>
    </html>
  `;
}
