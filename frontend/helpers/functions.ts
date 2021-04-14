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

export const onlyNumber = (value: string): string => {
    return value.replace(/\D/g, "")
}

export const cellPhoneMask = (number: string): string => {
    return number.replace(/\D/g, "")                 //Remove tudo o que não é dígito
        .replace(/^(\d\d)(\d)/g, "($1) $2") //Coloca parênteses em volta dos dois primeiros dígitos
        .replace(/(\d{5})(\d)/, "$1-$2")
        .substring(0, 15);   //Coloca hífen entre o quarto e o quinto dígitos
}

export const moneyMask = (value: string): string => {
    let v = value.replace(/\D/g, '');
    v = (Number(v) / 100).toFixed(2) + '';
    v = v.replace(".", ",");
    v = v.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
    return v;
}

export const moneyMaskToNumber = (value: string): number => {
    let v = value.replace(/\D/g, '');
    return Number((Number(v) / 100).toFixed(2));
}

export const cpfMask = (value: string): string => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
};

export const cnpjMask = (value: string): string => {
    return value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2");
};

export const cpfCnpjMask = (value: string): string => (value.length <= 14 ? cpfMask(value) : cnpjMask(value));
