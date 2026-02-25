let currentMode = 'both';
let currentCalc = 'investment';

// ===== MAIN TAB SWITCH =====
function switchCalculator(type) {
    currentCalc = type;
    document.querySelectorAll('.main-tab').forEach(t => t.classList.remove('active'));
    document.getElementById('main-tab-' + type).classList.add('active');

    document.querySelectorAll('.calc-section').forEach(s => s.classList.remove('active'));
    document.getElementById('section-' + type).classList.add('active');
}

// ===== INVESTMENT MODE TABS =====
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

    if (document.getElementById('results').classList.contains('visible')) {
        calculate();
    }
}

// ===== FORMAT CURRENCY (Indian) =====
function formatCurrency(num) {
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

function formatShort(num) {
    if (num >= 10000000) return '₹' + (num / 10000000).toFixed(1) + ' Cr';
    if (num >= 100000) return '₹' + (num / 100000).toFixed(1) + ' L';
    if (num >= 1000) return '₹' + (num / 1000).toFixed(1) + 'K';
    return '₹' + num.toFixed(0);
}

// ===== PIE CHART DRAWING =====
function drawPieChart(canvasId, segments, centerValue) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 10;
    const innerRadius = radius * 0.6;

    ctx.clearRect(0, 0, width, height);

    const total = segments.reduce((sum, s) => sum + s.value, 0);
    let startAngle = -Math.PI / 2;

    segments.forEach((segment, i) => {
        const sliceAngle = (segment.value / total) * 2 * Math.PI;
        const endAngle = startAngle + sliceAngle;

        // Draw slice
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
        ctx.closePath();
        ctx.fillStyle = segment.color;
        ctx.fill();

        // Gap between segments
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, endAngle - 0.02, endAngle + 0.02);
        ctx.arc(centerX, centerY, innerRadius, endAngle + 0.02, endAngle - 0.02, true);
        ctx.closePath();
        ctx.fillStyle = '#050d0a';
        ctx.fill();

        startAngle = endAngle;
    });
}

function updateChartLegend(legendId, segments) {
    const legend = document.getElementById(legendId);
    const total = segments.reduce((sum, s) => sum + s.value, 0);

    legend.innerHTML = segments.map(s => {
        const pct = ((s.value / total) * 100).toFixed(1);
        return `
            <div class="legend-item">
                <div class="legend-color" style="background:${s.color}"></div>
                <div class="legend-info">
                    <span class="legend-label">${s.label}</span>
                    <span class="legend-value">${formatCurrency(s.value)}<span class="legend-pct">(${pct}%)</span></span>
                </div>
            </div>
        `;
    }).join('');
}

// ===== INVESTMENT CALCULATOR =====
function calculate() {
    const amount = parseFloat(document.getElementById('amount').value);
    const rate = parseFloat(document.getElementById('rate').value) / 100;
    const years = parseFloat(document.getElementById('years').value);
    const stepup = parseFloat(document.getElementById('stepup').value || 0) / 100;

    if (isNaN(amount) || isNaN(rate) || isNaN(years) || amount <= 0 || rate <= 0 || years <= 0) return;

    const monthlyRate = rate / 12;

    // Lumpsum
    const lumpsumFV = amount * Math.pow((1 + rate), years);
    const lumpsumProfit = lumpsumFV - amount;

    // SIP with Step-up
    let sipFV = 0, totalInvested = 0, currentSIP = amount;

    for (let y = 0; y < years; y++) {
        for (let m = 0; m < 12; m++) {
            let monthsLeft = (years - y) * 12 - m;
            sipFV += currentSIP * Math.pow((1 + monthlyRate), monthsLeft);
            totalInvested += currentSIP;
        }
        currentSIP *= (1 + stepup);
    }

    const sipProfit = sipFV - totalInvested;

    // Show results
    const resultsEl = document.getElementById('results');
    resultsEl.classList.remove('visible');
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

        // Lumpsum Pie Chart
        const lsSegments = [
            { label: 'Invested', value: amount, color: '#10b981' },
            { label: 'Returns', value: lumpsumProfit, color: '#22d3ee' }
        ];
        drawPieChart('ls-pie-chart', lsSegments);
        document.getElementById('ls-chart-total').textContent = formatShort(lumpsumFV);
        updateChartLegend('ls-chart-legend', lsSegments);
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

        // SIP Pie Chart
        const sipSegments = [
            { label: 'Invested', value: totalInvested, color: '#10b981' },
            { label: 'Returns', value: sipProfit, color: '#22d3ee' }
        ];
        drawPieChart('sip-pie-chart', sipSegments);
        document.getElementById('sip-chart-total').textContent = formatShort(sipFV);
        updateChartLegend('sip-chart-legend', sipSegments);

        // Growth metrics
        const multiplier = (sipFV / totalInvested).toFixed(2);
        const growthPct = ((sipFV / totalInvested - 1) * 100).toFixed(1);
        document.getElementById('multiplier').textContent = multiplier + 'x';
        document.getElementById('growth-pct').textContent = '+' + growthPct + '% returns';

        const progressPct = Math.min((sipProfit / sipFV) * 100, 95);
        setTimeout(() => {
            document.getElementById('progress-bar').style.width = progressPct + '%';
        }, 100);
    }
}

// ===== EMI CALCULATOR =====
function calculateEMI() {
    const loan = parseFloat(document.getElementById('emi-loan').value);
    const rate = parseFloat(document.getElementById('emi-rate').value) / 100 / 12;
    const tenureYears = parseFloat(document.getElementById('emi-tenure').value);
    const tenure = tenureYears * 12;

    if (isNaN(loan) || isNaN(rate) || isNaN(tenure) || loan <= 0 || rate <= 0 || tenure <= 0) return;

    // EMI = P × r × (1+r)^n / ((1+r)^n - 1)
    const emi = loan * rate * Math.pow(1 + rate, tenure) / (Math.pow(1 + rate, tenure) - 1);
    const totalPayment = emi * tenure;
    const totalInterest = totalPayment - loan;

    // Show results
    const resultsEl = document.getElementById('emi-results');
    resultsEl.classList.remove('visible');
    void resultsEl.offsetWidth;
    resultsEl.classList.add('visible');

    document.getElementById('emi-monthly').textContent = formatCurrency(emi);
    document.getElementById('emi-principal').textContent = formatCurrency(loan);
    document.getElementById('emi-interest').textContent = formatCurrency(totalInterest);
    document.getElementById('emi-total').textContent = formatCurrency(totalPayment);

    // EMI Pie Chart
    const emiSegments = [
        { label: 'Principal', value: loan, color: '#10b981' },
        { label: 'Interest', value: totalInterest, color: '#fb7185' }
    ];
    drawPieChart('emi-pie-chart', emiSegments);
    document.getElementById('emi-chart-total').textContent = formatShort(totalPayment);
    updateChartLegend('emi-chart-legend', emiSegments);

    // Stacked bar
    const principalPct = (loan / totalPayment * 100).toFixed(1);
    const interestPct = (totalInterest / totalPayment * 100).toFixed(1);

    setTimeout(() => {
        document.getElementById('principal-bar').style.width = principalPct + '%';
        document.getElementById('interest-bar').style.width = interestPct + '%';
    }, 100);

    document.getElementById('principal-pct').textContent = principalPct + '%';
    document.getElementById('interest-pct').textContent = interestPct + '%';
}

// ===== KEYBOARD SUPPORT =====
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('#section-investment input').forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') calculate();
        });
    });

    document.querySelectorAll('#section-emi input').forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') calculateEMI();
        });
    });
});
