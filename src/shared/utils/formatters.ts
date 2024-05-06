const currencyFormatter =  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });

export default currencyFormatter;


export function decimalToPercentage(decimal: number): number {
  return (decimal * 100);
}
