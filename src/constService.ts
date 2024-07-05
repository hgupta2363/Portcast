import { CurrencyColumns } from "./schema/currency";

export const columnsData: CurrencyColumns[] = [
    { key: 'id', name: 'Id' },
    { key: 'symbol', name: 'Currency Symbol' },
    { key: 'name', name: 'Name' },
    { key: 'marketCapUsd', name: 'Market Cap In USD' },
    { key: 'priceUsd', name: 'Price(USD)' },
];

export const sortingOptions = [
    { name: 'sort by name asc', value: 1 },
    { name: 'sort by name desc', value: 2 },
    { name: 'sort by symbol asc', value: 3 },
    { name: 'sort by symbol desc', value: 4 },
    { name: 'Normal', value: 0 },
];