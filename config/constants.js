// Companies and their configurations
export const COMPANIES = ['EDP', 'Endesa', 'Repsol'];

// Power costs table (€/kVA/day)
export const POWER_COSTS = {
    'EDP': {
        '1.15': 0.0950,
        '2.30': 0.0900,
        '3.45': 0.0850,
        '4.60': 0.0800,
        '5.75': 0.0750,
        '6.90': 0.0700,
        '10.35': 0.0650,
        '13.80': 0.0600,
        '17.25': 0.0550,
        '20.70': 0.0500
    },
    'Endesa': {
        '1.15': 0.0850,
        '2.30': 0.0800,
        '3.45': 0.0750,
        '4.60': 0.0700,
        '5.75': 0.0650,
        '6.90': 0.0600,
        '10.35': 0.0550,
        '13.80': 0.0500,
        '17.25': 0.0450,
        '20.70': 0.0400
    },
    'Repsol': {
        '1.15': 0.1050,
        '2.30': 0.1000,
        '3.45': 0.0950,
        '4.60': 0.0900,
        '5.75': 0.0850,
        '6.90': 0.0800,
        '10.35': 0.0750,
        '13.80': 0.0700,
        '17.25': 0.0650,
        '20.70': 0.0600
    }
};

// Tariff values
export const TARIFF_VALUES = {
    'EDP': {
        'simples': 0.1650,
        'biHorario': { vazio: 0.1250, foraVazio: 0.1850 },
        'triHorario': { vazio: 0.10, ponta: 0.20, cheia: 0.15 }
    },
    'Endesa': {
        'simples': 0.1550,
        'biHorario': { vazio: 0.1150, foraVazio: 0.1750 },
        'triHorario': { vazio: 0.09, ponta: 0.19, cheia: 0.14 }
    },
    'Repsol': {
        'simples': 0.1750,
        'biHorario': { vazio: 0.1350, foraVazio: 0.1950 },
        'triHorario': { vazio: 0.11, ponta: 0.21, cheia: 0.16 }
    }
};

// Natural gas reference prices (€/m³)
export const GAS_PRICES = {
    'EDP': 0.065,
    'Endesa': 0.063,
    'Repsol': 0.067
}; 