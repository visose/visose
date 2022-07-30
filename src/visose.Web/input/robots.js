'use strict';

(() => {
    const selectElement = document.getElementById('robots');
    const priceElement = document.getElementById('price');
    const sElement = document.getElementById('s');

    const calcPrice = count => {
        const { init, decay, round } = robotsPricing;
       
        const r = Math.exp(decay);
        const sum = init * (Math.pow(r, count) - 1) / (r - 1);
        return Math.floor(sum / round) * round;
    }

    const updateText = () => {
        const count = selectElement.selectedIndex + 1;
        const price = calcPrice(count);

        const formatter = new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP',
            minimumFractionDigits: 0
        });

        const priceText = formatter.format(price);
        priceElement.innerText = `${priceText} / year`;
        sElement.innerText = count == 1 ? "" : "s";
    }

    updateText();
    selectElement.onchange = updateText;
    window.addEventListener('pagehide', () => selectElement.selectedIndex = 0, false);
})();