import { COMPANIES, POWER_COSTS, TARIFF_VALUES, GAS_PRICES } from './config/constants.js';
import { getPowerCost, calculateSavings } from './utils/calculations.js';
import { 
    getNumericValue, 
    updateTariffFields, 
    updateGasSection, 
    updateCardValues, 
    displayResults 
} from './utils/ui.js';

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tariff fields
    const initialTariffType = document.querySelector('input[name="tariffType"]:checked')?.value || 'simples';
    updateTariffFields(initialTariffType);
    
    // Initialize card values
    const power = getNumericValue('power');
    updateCardValues(power, initialTariffType);
    
    // Add events for tariff radio buttons
    document.querySelectorAll('input[name="tariffType"]').forEach(radio => {
        radio.addEventListener('change', function() {
            updateTariffFields(this.value);
            updateCardValues(getNumericValue('power'), this.value);
        });
    });
    
    // Add event for gas switch
    const simulationType = document.getElementById('simulationType');
    if (simulationType) {
        simulationType.addEventListener('change', function() {
            updateGasSection(this.checked);
        });
    }
    
    // Add event for power input
    const powerInput = document.getElementById('power');
    if (powerInput) {
        powerInput.addEventListener('input', function() {
            const power = getNumericValue('power');
            const tariffType = document.querySelector('input[name="tariffType"]:checked')?.value || 'simples';
            updateCardValues(power, tariffType);
        });
    }
    
    // Add event for form submission
    const form = document.getElementById('simulatorForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values with null checks
            const tariffTypeRadio = document.querySelector('input[name="tariffType"]:checked');
            const tariffType = tariffTypeRadio ? tariffTypeRadio.value : 'simples';
            const power = getNumericValue('power');
            const calculationDays = getNumericValue('calculationDays', 30);
            const energyDiscount = getNumericValue('energyDiscount');
            const gasDiscount = getNumericValue('gasDiscount');
            const includeGas = document.getElementById('simulationType')?.checked || false;
            
            // Get consumption values based on tariff type
            let consumption = {};
            switch(tariffType) {
                case 'simples':
                    consumption = {
                        simples: {
                            value: getNumericValue('valueSimples'),
                            amount: getNumericValue('consumptionSimples')
                        }
                    };
                    break;
                    
                case 'biHorario':
                    consumption = {
                        ponta: {
                            value: getNumericValue('valueBiHorarioPonta'),
                            amount: getNumericValue('consumptionBiHorarioPonta')
                        },
                        foraPonta: {
                            value: getNumericValue('valueBiHorarioForaPonta'),
                            amount: getNumericValue('consumptionBiHorarioForaPonta')
                        }
                    };
                    break;
                    
                case 'triHorario':
                    consumption = {
                        ponta: {
                            value: getNumericValue('valueTriHorarioPonta'),
                            amount: getNumericValue('consumptionTriHorarioPonta')
                        },
                        cheia: {
                            value: getNumericValue('valueTriHorarioCheia'),
                            amount: getNumericValue('consumptionTriHorarioCheia')
                        },
                        vazio: {
                            value: getNumericValue('valueTriHorarioVazio'),
                            amount: getNumericValue('consumptionTriHorarioVazio')
                        }
                    };
                    break;
            }
            
            // Calculate and display results
            const results = calculateSavings(consumption, tariffType, power, 0, calculationDays, energyDiscount, gasDiscount);
            displayResults(results, calculationDays, energyDiscount, gasDiscount);
        });
    }
}); 