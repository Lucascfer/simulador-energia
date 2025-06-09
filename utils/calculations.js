import { POWER_COSTS, TARIFF_VALUES, GAS_PRICES } from '../config/constants.js';

// Function to get power cost based on contracted power
export function getPowerCost(company, power) {
    if (!power || power <= 0) return POWER_COSTS[company]['1.15'];

    const availablePowers = Object.keys(POWER_COSTS[company]).map(Number).sort((a, b) => a - b);
    
    // Find the closest power value or the largest available value less than the input
    let selectedPowerCost = POWER_COSTS[company]['1.15']; // Default value
    for (let i = 0; i < availablePowers.length; i++) {
        if (power === availablePowers[i]) {
            selectedPowerCost = POWER_COSTS[company][String(availablePowers[i])];
            break;
        } else if (power > availablePowers[i]) {
            selectedPowerCost = POWER_COSTS[company][String(availablePowers[i])];
        } else {
            break;
        }
    }
    
    return selectedPowerCost;
}

// Function to calculate savings
export function calculateSavings(consumption, tariffType, power, powerCost, calculationDays, energyDiscount, gasDiscount) {
    const fixedCostPerKvaPerDay = getPowerCost('EDP', power);
    
    const variableCostsBiHorario = {
        'EDP': { day: 0.1850, night: 0.1250 },
        'Endesa': { day: 0.1750, night: 0.1150 },
        'Repsol': { day: 0.1950, night: 0.1350 }
    };
    
    const variableCostsTriHorario = {
        'EDP': { peak: 0.20, full: 0.15, off: 0.10 },
        'Endesa': { peak: 0.19, full: 0.14, off: 0.09 },
        'Repsol': { peak: 0.21, full: 0.16, off: 0.11 }
    };
    
    const variableCostsSimples = {
        'EDP': 0.1650,
        'Endesa': 0.1550,
        'Repsol': 0.1750
    };

    // Get gas consumption
    const gasConsumption = parseFloat(document.getElementById('gasConsumption')?.value) || 0;
    const gasValue = parseFloat(document.getElementById('gasValue')?.value) || 0;
    
    const companies = ['EDP', 'Endesa', 'Repsol'];
    const results = [];
    
    companies.forEach(company => {
        let totalCost;
        let gasCost = 0;
        
        // Energy cost calculation
        const companyPowerCost = getPowerCost(company, power);
        
        switch(tariffType) {
            case 'simples':
                const energyCost = consumption.simples.amount * variableCostsSimples[company];
                const fixedCost = calculationDays * companyPowerCost * power;
                totalCost = energyCost + fixedCost;
                break;
                
            case 'biHorario':
                const dayCost = consumption.ponta.amount * variableCostsBiHorario[company].day;
                const nightCost = consumption.foraPonta.amount * variableCostsBiHorario[company].night;
                const fixedCostBi = calculationDays * companyPowerCost * power;
                totalCost = dayCost + nightCost + fixedCostBi;
                break;
                
            case 'triHorario':
                const peakCost = consumption.ponta.amount * variableCostsTriHorario[company].peak;
                const fullCost = consumption.cheia.amount * variableCostsTriHorario[company].full;
                const offCost = consumption.vazio.amount * variableCostsTriHorario[company].off;
                const fixedCostTri = calculationDays * companyPowerCost * power;
                totalCost = peakCost + fullCost + offCost + fixedCostTri;
                break;
        }

        // Apply energy discount if any
        if (energyDiscount > 0) {
            totalCost = totalCost * (1 - energyDiscount / 100);
        }

        // Gas cost calculation
        if (gasConsumption > 0) {
            if (gasValue > 0) {
                gasCost = gasConsumption * gasValue;
            } else {
                gasCost = gasConsumption * GAS_PRICES[company];
            }

            if (gasDiscount > 0) {
                gasCost = gasCost * (1 - gasDiscount / 100);
            }
        }
        
        results.push({
            company: company,
            total: parseFloat((totalCost + gasCost).toFixed(2)),
            energyCost: parseFloat(totalCost.toFixed(2)),
            gasCost: parseFloat(gasCost.toFixed(2)),
            isCurrent: false
        });
    });
    
    // Sort by total cost (ascending)
    results.sort((a, b) => a.total - b.total);
    
    return results;
} 