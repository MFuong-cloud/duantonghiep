export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone) && !isNaN(Number(phone));
};

export const isValidEmailOrPhone = (value: string): boolean => {
    return isValidEmail(value) || isValidPhone(value);
};

export const isValidPrice = (price: number): boolean => {
    return price >= 0 && price <= 100000000;
};

export const isValidString = (str: string, minLength: number = 1, maxLength: number = 255): boolean => {
    const trimmed = str.trim();
    return trimmed.length >= minLength && trimmed.length <= maxLength;
};
