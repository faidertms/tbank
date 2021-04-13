

export const formatValueNumeric = (value: number = 0, formatter: string, decimal: number = 2): any => {
    switch (formatter) {
        case "money":
            const nuberFormat = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: decimal });
            return nuberFormat.format(value);
        case "percentage":
            return `${(value * 1).toFixed(2)}%`
        case "percentageDecimal":
            return `${(value * 100).toFixed(2)}%`
        default:
            return value;
    }
}
