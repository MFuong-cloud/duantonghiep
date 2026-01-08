export const PRICE_RANGES = [
    { label: "Tất cả giá", value: "all" },
    { label: "Dưới 50k", value: "0-50000" },
    { label: "50k - 100k", value: "50000-100000" },
    { label: "100k - 200k", value: "100000-200000" },
    { label: "Trên 200k", value: "200000-inf" },
] as const;

export const SORT_OPTIONS = [
    { label: "Mới nhất", value: "default" },
    { label: "Giá: Thấp đến Cao", value: "asc" },
    { label: "Giá: Cao đến Thấp", value: "desc" },
] as const;

export type PriceRangeValue = typeof PRICE_RANGES[number]['value'];
export type SortOptionValue = typeof SORT_OPTIONS[number]['value'];
