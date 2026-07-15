import { useSiteSettings } from './use-site-settings';

// Tasa de conversión aproximada USD a MXN (puedes actualizar esto con una API real)
const USD_TO_MXN_RATE = 17.5;

// Meses de temporada alta: julio (6), agosto (7), diciembre (11)
const HIGH_SEASON_MONTHS = [6, 7, 11]; // 0-indexed months

// Función de prueba para verificar el formato
export const testCurrencyFormat = () => {
    const testAmount = 299;
    const converted = Math.round(testAmount * USD_TO_MXN_RATE);
    console.log('Original USD:', testAmount);
    console.log('Converted MXN:', converted);
    console.log('Formatted with separator:', converted.toLocaleString('en-US'));
    return converted.toLocaleString('en-US');
};

// Función para determinar si una fecha es temporada alta
export const isHighSeason = (date: Date): boolean => {
    const month = date.getMonth();
    return HIGH_SEASON_MONTHS.includes(month);
};

// Función para determinar el nivel de precio
export const getPriceLevel = (date: Date): 'low' | 'medium' | 'high' => {
    const month = date.getMonth();
    const dayOfWeek = date.getDay(); // 0 = domingo, 6 = sábado
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Domingo o sábado
    
    // Temporada alta (julio, agosto, diciembre)
    if (HIGH_SEASON_MONTHS.includes(month)) {
        return 'high';
    }
    
    // Fines de semana en temporada normal
    if (isWeekend) {
        return 'high';
    }
    
    // Entre semana en temporada normal
    return 'medium';
};

// Función para calcular precio según nivel con variación
export const getSeasonalPrice = (basePriceUSD: number, date: Date): number => {
    const level = getPriceLevel(date);
    
    // Agregar variación basada en el día para que no se vean tan fijos
    const dayVariation = (date.getDate() % 7 - 3) * 5; // Variación de -15 a +15
    
    switch (level) {
        case 'low':
            return Math.round(basePriceUSD * 0.7 + dayVariation); // 30% más barato + variación
        case 'medium':
            return Math.round(basePriceUSD * 1.0 + dayVariation); // Precio base + variación
        case 'high':
            return Math.round(basePriceUSD * 1.3 + dayVariation); // 30% más caro + variación
        default:
            return basePriceUSD + dayVariation;
    }
};

export function useCurrencyConversion() {
    const { settings } = useSiteSettings();

    const convertCurrency = (amountUSD: number): { amount: number; symbol: string; code: string } => {
        if (settings.currency === 'MXN') {
            const amountMXN = Math.round(amountUSD * USD_TO_MXN_RATE);
            return {
                amount: amountMXN,
                symbol: '$',
                code: 'MXN'
            };
        }
        
        return {
            amount: amountUSD,
            symbol: '$',
            code: 'USD'
        };
    };

    const formatPrice = (amountUSD: number): string => {
        const { amount, symbol } = convertCurrency(amountUSD);
        return `${symbol}${amount.toLocaleString('en-US')}`;
    };

    const formatPriceWithCode = (amountUSD: number): string => {
        const { amount, symbol, code } = convertCurrency(amountUSD);
        return `${symbol}${amount.toLocaleString('en-US')} ${code}`;
    };

    const formatSeasonalPrice = (basePriceUSD: number, date: Date, isSelected: boolean = false): { price: string; level: 'low' | 'medium' | 'high'; colorClass: string } => {
        const seasonalPriceUSD = getSeasonalPrice(basePriceUSD, date);
        const { amount, symbol } = convertCurrency(seasonalPriceUSD);
        const level = getPriceLevel(date);
        
        let colorClass = 'text-foreground'; // Negro por defecto (medium)
        
        if (isSelected) {
            // Colores con mejor contraste cuando está seleccionado
            switch (level) {
                case 'low':
                    colorClass = 'text-green-200'; // Verde claro para contraste
                    break;
                case 'high':
                    colorClass = 'text-red-200'; // Rojo claro para contraste
                    break;
                case 'medium':
                default:
                    colorClass = 'text-primary-foreground/80'; // Blanco con opacidad
                    break;
            }
        } else {
            // Colores normales cuando no está seleccionado
            switch (level) {
                case 'low':
                    colorClass = 'text-green-600'; // Verde para precios baratos
                    break;
                case 'high':
                    colorClass = 'text-red-600'; // Rojo para precios altos
                    break;
                case 'medium':
                default:
                    colorClass = 'text-foreground'; // Negro para precios medios
                    break;
            }
        }
        
        return {
            price: `${symbol}${amount.toLocaleString('en-US')}`,
            level: level,
            colorClass: colorClass
        };
    };

    return {
        convertCurrency,
        formatPrice,
        formatPriceWithCode,
        formatSeasonalPrice,
        isHighSeason,
        getSeasonalPrice,
        getPriceLevel,
        currentCurrency: settings.currency
    };
}
