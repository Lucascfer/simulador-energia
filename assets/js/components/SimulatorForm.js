export function createSimulatorForm() {
  return `
    <form id="simulatorForm" class="space-y-6">
      <!-- Configurações de Fatura e Serviços (Collapsible Section) -->
      

      <!-- Tipo de Simulação -->
      <div>
        <label class="block text-lg font-semibold text-gray-900 mb-4">Tipo de Consumo</label>
        <div class="switch-container">
          <div class="switch-content">
            <div class="switch-option">
              <i class="fas fa-bolt"></i>
              <span>Energia</span>
            </div>
            <label class="switch">
              <input type="checkbox" id="simulationType" />
              <span class="slider"></span>
            </label>
            <div class="switch-option">
              <i class="fas fa-fire"></i>
              <span>Energia e Gás</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Seção de Gás Natural -->
      <div id="gasSection" class="gas-section hidden">
        <h3 class="text-lg font-semibold mb-4">Consumo de Gás Natural</h3>
        
        <!-- Escalão Selection -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Escalão</label>
          <div class="flex gap-4">
            ${[1, 2, 3, 4]
              .map(
                (escalao) => `
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  name="gasEscalao"
                  value="${escalao}"
                  class="form-radio h-4 w-4 text-electric"
                  ${escalao === 1 ? "checked" : ""}
                />
                <span class="ml-2">${escalao}</span>
              </label>
            `
              )
              .join("")}
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="gasConsumption" class="block text-sm font-medium text-gray-700 mb-1">Consumo de Gás (kWh)</label>
            <input
              type="number"
              id="gasConsumption"
              name="gasConsumption"
              min="0"
              step="0.000001"
              class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus:border-electric"
            />
          </div>
          <div>
            <label for="gasValue" class="block text-sm font-medium text-gray-700 mb-1">Valor do Gás (€/kWh)</label>
            <input
              type="number"
              id="gasValue"
              name="gasValue"
              min="0"
              step="0.000001"
              class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus:border-electric"
            />
          </div>
        </div>

        <div class="mt-4">
          <label for="gasFixedTerm" class="block text-sm font-medium text-gray-700 mb-1">Termo Fixo (€/dia)</label>
          <input
            type="number"
            id="gasFixedTerm"
            name="gasFixedTerm"
            min="0"
            step="0.000001"
            class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus:border-electric"
          />
        </div>
      </div>

      <!-- Tipo de Tarifário -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-4">Tipo de Tarifário</h3>
        <div class="tariff-options">
          <label class="tariff-option">
            <input type="radio" name="tariffType" value="simples" class="tariff-radio" checked />
            <div class="tariff-content">
              <div class="tariff-circle"></div>
              <div class="tariff-text">Simples</div>
            </div>
          </label>
          <label class="tariff-option">
            <input type="radio" name="tariffType" value="biHorario" class="tariff-radio" />
            <div class="tariff-content">
              <div class="tariff-circle"></div>
              <div class="tariff-text">Bi-horário</div>
            </div>
          </label>
          <label class="tariff-option opacity-50">
            <input type="radio" name="tariffType" value="triHorario" class="tariff-radio" disabled/>
            <div class="tariff-content">
              <div class="tariff-circle"></div>
              <div class="tariff-text">Tri-horário</div>
            </div>
          </label>
        </div>
      </div>

      <!-- Campos Simples -->
      <div id="simplesFields" class="consumption-section">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="consumptionSimples" class="block text-sm font-medium text-gray-700 mb-2">Consumo Mensal (kWh)</label>
            <input
              type="number"
              id="consumptionSimples"
              name="consumptionSimples"
              step="0.000001"
              class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus:border-electric"
              required
            />
          </div>
          <div>
            <label for="valueSimples" class="block text-sm font-medium text-gray-700 mb-2">Valor por kWh (€)</label>
            <input
              type="number"
              step="0.000001"
              id="valueSimples"
              name="valueSimples"
              class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus:border-electric"
              required
            />
          </div>
        </div>
        <div class="mt-4">
          <label for="energyDiscount" class="block text-sm font-medium text-gray-700 mb-2">Desconto no kWh (%)</label>
          <input
            type="number"
            id="energyDiscount"
            name="energyDiscount"
            min="0"
            max="100"
            step="0.000001"
            class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus:border-electric"
            placeholder="Ex: 5"
          />
        </div>
      </div>

      <!-- Campos Bi-horário -->
      <div id="biHorarioFields" class="hidden consumption-section">
        <div class="space-y-4">
          <div class="mb-2">
            <h4 class="text-md font-semibold text-gray-700">Período Fora do Vazio</h4>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="consumptionBiHorarioForaVazio" class="block text-sm font-medium text-gray-700 mb-2">Consumo (kWh)</label>
              <input
                type="number"
                id="consumptionBiHorarioForaVazio"
                name="consumptionBiHorarioForaVazio"
                step="0.000001"
                class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus:border-electric"
              />
            </div>
            <div>
              <label for="valueBiHorarioForaVazio" class="block text-sm font-medium text-gray-700 mb-2">Valor (€/kWh)</label>
              <input
                type="number"
                step="0.000001"
                id="valueBiHorarioForaVazio"
                name="valueBiHorarioForaVazio"
                class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus:border-electric"
              />
            </div>
          </div>
          <div class="mt-2">
            <label for="energyDiscountForaVazio" class="block text-sm font-medium text-gray-700 mb-2">Desconto Fora do Vazio (%)</label>
            <input
              type="number"
              id="energyDiscountForaVazio"
              name="energyDiscountForaVazio"
              min="0"
              max="100"
              step="0.000001"
              class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus:border-electric"
              placeholder="Ex: 5"
            />
          </div>

          <div class="mb-2">
            <h4 class="text-md font-semibold text-gray-700">Período de Vazio</h4>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="consumptionBiHorarioVazio" class="block text-sm font-medium text-gray-700 mb-2">Consumo (kWh)</label>
              <input
                type="number"
                id="consumptionBiHorarioVazio"
                name="consumptionBiHorarioVazio"
                step="0.000001"
                class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus:border-electric"
              />
            </div>
            <div>
              <label for="valueBiHorarioVazio" class="block text-sm font-medium text-gray-700 mb-2">Valor (€/kWh)</label>
              <input
                type="number"
                step="0.000001"
                id="valueBiHorarioVazio"
                name="valueBiHorarioVazio"
                class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus:border-electric"
              />
            </div>
          </div>
          <div class="mt-2">
            <label for="energyDiscountVazio" class="block text-sm font-medium text-gray-700 mb-2">Desconto Vazio (%)</label>
            <input
              type="number"
              id="energyDiscountVazio"
              name="energyDiscountVazio"
              min="0"
              max="100"
              step="0.000001"
              class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus:border-electric"
              placeholder="Ex: 5"
            />
          </div>
        </div>
      </div>

      <!-- Campos Tri-horário -->
      <div id="triHorarioFields" class="hidden consumption-section">
        <div class="space-y-4">
          <div class="mb-2">
            <h4 class="text-md font-semibold text-gray-700">Período Ponta</h4>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="consumptionTriHorarioPonta" class="block text-sm font-medium text-gray-700 mb-2">Consumo (kWh)</label>
              <input
                type="number"
                id="consumptionTriHorarioPonta"
                name="consumptionTriHorarioPonta"
                step="0.000001"
                class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus:border-electric"
              />
            </div>
            <div>
              <label for="valueTriHorarioPonta" class="block text-sm font-medium text-gray-700 mb-2">Valor Ponta (€/kWh)</label>
              <input
                type="number"
                step="0.000001"
                id="valueTriHorarioPonta"
                name="valueTriHorarioPonta"
                class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus:border-electric"
              />
            </div>
          </div>
          <div class="mt-2">
            <label for="energyDiscountPonta" class="block text-sm font-medium text-gray-700 mb-2">Desconto Ponta (%)</label>
            <input
              type="number"
              id="energyDiscountPonta"
              name="energyDiscountPonta"
              min="0"
              max="100"
              step="0.000001"
              class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus:border-electric"
              placeholder="Ex: 5"
            />
          </div>

          <div class="mb-2">
            <h4 class="text-md font-semibold text-gray-700">Período Cheia</h4>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="consumptionTriHorarioCheia" class="block text-sm font-medium text-gray-700 mb-2">Consumo (kWh)</label>
              <input
                type="number"
                id="consumptionTriHorarioCheia"
                name="consumptionTriHorarioCheia"
                step="0.000001"
                class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus:border-electric"
              />
            </div>
            <div>
              <label for="valueTriHorarioCheia" class="block text-sm font-medium text-gray-700 mb-2">Valor Cheia (€/kWh)</label>
              <input
                type="number"
                step="0.000001"
                id="valueTriHorarioCheia"
                name="valueTriHorarioCheia"
                class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus:border-electric"
              />
            </div>
          </div>
          <div class="mt-2">
            <label for="energyDiscountCheia" class="block text-sm font-medium text-gray-700 mb-2">Desconto Cheia (%)</label>
            <input
              type="number"
              id="energyDiscountCheia"
              name="energyDiscountCheia"
              min="0"
              max="100"
              step="0.000001"
              class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus:border-electric"
              placeholder="Ex: 5"
            />
          </div>

          <div class="mb-2">
            <h4 class="text-md font-semibold text-gray-700">Período Vazio</h4>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="consumptionTriHorarioVazio" class="block text-sm font-medium text-gray-700 mb-2">Consumo (kWh)</label>
              <input
                type="number"
                id="consumptionTriHorarioVazio"
                name="consumptionTriHorarioVazio"
                step="0.000001"
                class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus:border-electric"
              />
            </div>
            <div>
              <label for="valueTriHorarioVazio" class="block text-sm font-medium text-gray-700 mb-2">Valor Vazio (€/kWh)</label>
              <input
                type="number"
                step="0.000001"
                id="valueTriHorarioVazio"
                name="valueTriHorarioVazio"
                class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus:border-electric"
              />
            </div>
          </div>
          <div class="mt-2">
            <label for="energyDiscountVazio" class="block text-sm font-medium text-gray-700 mb-2">Desconto Vazio (%)</label>
            <input
              type="number"
              id="energyDiscountVazio"
              name="energyDiscountVazio"
              min="0"
              max="100"
              step="0.000001"
              class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus:border-electric"
              placeholder="Ex: 5"
            />
          </div>
        </div>
      </div>

      <!-- Potência -->
      <div class="consumption-power">
        <div>
          <label for="power" class="block text-sm font-medium text-gray-700 mb-2">Potência Contratada (kVA)</label>
          <select
            id="power"
            name="power"
            class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus:border-electric"
            required
          >
            <option value="" disabled selected>Selecione...</option>
            <option value="1.15">1.15 kVA</option>
            <option value="2.30">2.30 kVA</option>
            <option value="3.45">3.45 kVA</option>
            <option value="4.60">4.60 kVA</option>
            <option value="5.75">5.75 kVA</option>
            <option value="6.90">6.90 kVA</option>
            <option value="10.35">10.35 kVA</option>
            <option value="13.80">13.80 kVA</option>
            <option value="17.25">17.25 kVA</option>
            <option value="20.70">20.70 kVA</option>
          </select>
        </div>
        <div>
          <label for="powerValue" class="block text-sm font-medium text-gray-700 mb-2">Valor da Potência (€/dia)</label>
          <input
            type="number"
            step="0.000001"
            id="powerValue"
            name="powerValue"
            class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus:border-electric"
            required
          />
        </div>
        <div class="col-span-2">
          <label for="powerDiscount" class="block text-sm font-medium text-gray-700 mb-2">Desconto na Potência (%)</label>
          <input
            type="number"
            id="powerDiscount"
            name="powerDiscount"
            min="0"
            max="100"
            step="0.000001"
            class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus:border-electric"
            placeholder="Ex: 5"
          />
        </div>
      </div>

      <!-- Período de Cálculo -->
      <div>
        <label for="calculationDays" class="block text-sm font-medium text-gray-700 mb-2">Período de Cálculo (dias)</label>
        <input
          type="number"
          id="calculationDays"
          name="calculationDays"
          value="30"
          min="1"
          step="1"
          class="input-highlight w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric focus:border-electric"
          required
        />
      </div>

      <div class="billing-services-section">
        <div class="section-header" id="billingServicesHeader">
          <label class="block text-lg font-semibold text-gray-900">Configurações de Fatura e Serviços</label>
          <i class="fas fa-chevron-right toggle-icon"></i>
        </div>
        <div class="section-content space-y-4 mb-6 hidden">
          <div class="switch-container">
            <div class="switch-content">
              <div class="switch-option">
                <i class="fas fa-credit-card"></i>
                <span>Débito Direto</span>
              </div>
              <label class="switch">
                <input type="checkbox" id="directDebit" checked />
                <span class="slider"></span>
              </label>
            </div>
          </div>

          <div class="switch-container">
            <div class="switch-content">
              <div class="switch-option">
                <i class="fas fa-envelope"></i>
                <span>Fatura Eletrónica</span>
              </div>
              <label class="switch">
                <input type="checkbox" id="electronicInvoice" checked />
                <span class="slider"></span>
              </label>
            </div>
          </div>

          <div class="switch-container">
            <div class="switch-content">
              <div class="switch-option">
                <i class="fas fa-concierge-bell"></i>
                <span>Serviços Adicionais</span>
              </div>
              <label class="switch">
                <input type="checkbox" id="additionalServices" />
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        class="w-full bg-electric text-white py-3 px-6 rounded-lg hover:bg-electric-dark transition-colors duration-200"
      >
        <i class="fas fa-calculator mr-2"></i>Calcular Poupança
      </button>
    </form>
  `;
}
