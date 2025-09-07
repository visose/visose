import pricingData from "../../../../shared/pricing.json" assert { type: "json" };

const { maxRobots } = pricingData;

export const robotPrices = Array.from({ length: maxRobots }, (_, i) => {
  const price = calcPrice(i + 1);
  return priceText(price);
});

function calcPrice(count: number) {
  const { init, decay, round } = pricingData;
  const r = Math.exp(decay);
  const sum = (init * (Math.pow(r, count) - 1)) / (r - 1);
  return Math.floor(sum / round) * round;
}

function priceText(price: number) {
  const formatter = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
  });

  return `${formatter.format(price)} / year`;
}
