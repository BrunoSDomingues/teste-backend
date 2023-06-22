// Phone and CEP formatters

// Phone: returns to format (xx) xxxx-xxxx or (xx) xxxxx-xxxx (depends on number of digits)
export function formatPhone(phone: string): string {
    return phone
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "($1)$2")
        .replace(/(\d{4})(\d)/, " $1-$2")
        .replace(/(\d{4})-(\d)(\d{4})/, "$1$2-$3")
        .replace(/(-\d{4})\d+?$/, "$1");
}

export function formatCEP(cep: string): string {
    return cep
        .replace(/\D/g, "")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .replace(/(-\d{3})\d+?$/, "$1");
}
