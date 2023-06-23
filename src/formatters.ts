// Phone: returns formatted phone number (xx) xxxx-xxxx or (xx) xxxxx-xxxx (depending on the number of digits)
export function formatPhone(phone: string): string {
    const digitsOnly = phone.replace(/\D/g, "");
    const isElevenDigits = digitsOnly.length === 11;
    const formattedPhone = digitsOnly.replace(
        /(\d{2})(\d{4,5})(\d{4})$/,
        isElevenDigits ? "($1) $2-$3" : "($1) $2-$3"
    );
    return formattedPhone;
}

// CEP: returns formatted CEP xxxxx-xxx
export function formatCEP(cep: string): string {
    const digitsOnly = cep.replace(/\D/g, "");
    const formattedCEP = digitsOnly.replace(/(\d{5})(\d{3})$/, "$1-$2");
    return formattedCEP;
}
