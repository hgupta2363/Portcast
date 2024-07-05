export interface CurrencyData {
    id: string;
    symbol: string;
    name: string;
    marketCapUsd: string;
    priceUsd: string;
    supply?: string;
    volumeUsd24Hr?: string;
}

export interface CurrencyColumns {
    key: keyof CurrencyData;
    name: string;
}
