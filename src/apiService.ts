export const getCurrencyData = async (signal: AbortSignal, limit: number, offset: number) => {
  const response = await fetch(
    `https://api.coincap.io/v2/assets?limit=${limit}&offset=${offset}`, { signal }
  );
  const responseData = await response.json();
  return responseData;
};

export const getCurrencyDetails = async (signal: AbortSignal, id: string) => {
  const response = await fetch(
    `https://api.coincap.io/v2/assets/${id}`, { signal }
  );
  const responseData = await response.json();
  return responseData;
};
