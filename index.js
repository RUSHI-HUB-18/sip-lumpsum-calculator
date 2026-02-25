let currentMode = 'both';

function setMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + mode).classList.add('active');

    const stepupGroup = document.getElementById('stepup-group');
    const amountLabel = document.getElementById('amount-label');

    if (mode === 'lumpsum') {
        stepupGroup.style.display = 'none';
        amountLabel.textContent = 'Lumpsum Amount';
    } else if (mode === 'sip') {
        stepupGroup.style.display = 'block';
        amountLabel.textContent = 'Monthly SIP Amount';
    } else {
        stepupGroup.style.display = 'block';
        amountLabel.textContent = 'Monthly SIP / Lumpsum Amount';
    }

    // Recalculate if results are visible
    if (document.getElementById('results').classList.contains('visible')) {
        calculate();
    }
}

function formatCurrency(num) {
    // Indian numbering system
    const formatted = num.toFixed(0);
    let result = '';
    const parts = formatted.split('.');
    let intPart = parts[0];
    const isNegative = intPart.startsWith('-');
    if (isNegative) intPart = intPart.substring(1);

    if (intPart.length > 3) {
        result = intPart.substring(intPart.length - 3);
        intPart = intPart.substring(0, intPart.length - 3);
        while (intPart.length > 2) {
            result = intPart.substring(intPart.length - 2) + ',' + result;
            intPart = intPart.substring(0, intPart.length - 2);
        }
        result = intPart + ',' + result;
    } else {
        result = intPart;
    }

    return (isNegative ? '-' : '') + '₹' + result;
}

function calculate() {
    const amount = parseFloat(document.getElementById('amount').value);
    const rate = parseFloat(document.getElementById('rate').value) / 100;
    const years = parseFloat(document.getElementById('years').value);
    const stepup = parseFloat(document.getElementById('stepup').value || 0) / 100;

    if (isNaN(amount) || isNaN(rate) || isNaN(years) || amount <= 0 || rate <= 0 || years <= 0) {
        return;
    }

    const monthlyRate = rate / 12;

    // Lumpsum
    const lumpsumFV = amount * Math.pow((1 + rate), years);
    const lumpsumProfit = lumpsumFV - amount;

    // SIP with Step-up
    let sipFV = 0;
    let totalInvested = 0;
    let currentSIP = amount;

    for (let y = 0; y < years; y++) {
        for (let m = 0; m < 12; m++) {
            let monthsLeft = (years - y) * 12 - m;
            sipFV += currentSIP * Math.pow((1 + monthlyRate), monthsLeft);
            totalInvested += currentSIP;
        }
        currentSIP = currentSIP * (1 + stepup);
    }

    const sipProfit = sipFV - totalInvested;

    // Show results
    const resultsEl = document.getElementById('results');
    resultsEl.classList.remove('visible');

    // Force reflow for re-animation
    void resultsEl.offsetWidth;
    resultsEl.classList.add('visible');

    // Lumpsum section
    const lsSection = document.getElementById('lumpsum-results');
    const lsTitle = document.getElementById('lumpsum-title');
    if (currentMode === 'sip') {
        lsSection.style.display = 'none';
    } else {
        lsSection.style.display = 'block';
        lsTitle.style.display = currentMode === 'lumpsum' ? 'none' : 'block';
        document.getElementById('ls-invested').textContent = formatCurrency(amount);
        document.getElementById('ls-value').textContent = formatCurrency(lumpsumFV);
        document.getElementById('ls-profit').textContent = formatCurrency(lumpsumProfit);
    }

    // SIP section
    const sipSection = document.getElementById('sip-results');
    const sipTitle = document.getElementById('sip-title');
    if (currentMode === 'lumpsum') {
        sipSection.style.display = 'none';
    } else {
        sipSection.style.display = 'block';
        sipTitle.style.display = currentMode === 'sip' ? 'none' : 'block';
        document.getElementById('sip-invested').textContent = formatCurrency(totalInvested);
        document.getElementById('sip-value').textContent = formatCurrency(sipFV);
        document.getElementById('sip-profit').textContent = formatCurrency(sipProfit);

        // Growth metrics
        const multiplier = (sipFV / totalInvested).toFixed(2);
        const growthPct = ((sipFV / totalInvested - 1) * 100).toFixed(1);
        document.getElementById('multiplier').textContent = multiplier + 'x';
        document.getElementById('growth-pct').textContent = '+' + growthPct + '% returns';

        // Animate progress bar (capped at 100%)
        const progressPct = Math.min((sipProfit / sipFV) * 100, 95);
        setTimeout(() => {
            document.getElementById('progress-bar').style.width = progressPct + '%';
        }, 100);
    }
}

// Allow Enter key to calculate
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') calculate();
        });
    });
});
