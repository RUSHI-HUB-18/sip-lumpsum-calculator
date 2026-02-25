// ===== THEME MANAGEMENT =====
function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) {
        document.documentElement.setAttribute('data-theme', saved);
    } else {
        // Default to light
        document.documentElement.setAttribute('data-theme', 'light');
    }
    updateToggleIcon();
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateToggleIcon();

    // Redraw charts if visible
    redrawVisibleCharts();
}

function updateToggleIcon() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const icon = document.getElementById('toggle-icon');
    if (icon) icon.textContent = isDark ? '🌙' : '☀️';
}

// ===== MOBILE NAV =====
function toggleNav() {
    const links = document.getElementById('nav-links');
    links.classList.toggle('open');
}

// Close nav when clicking a link (mobile)
document.addEventListener('click', (e) => {
    const links = document.getElementById('nav-links');
    const hamburger = document.querySelector('.nav-hamburger');
    if (links && !links.contains(e.target) && !hamburger?.contains(e.target)) {
        links.classList.remove('open');
    }
});

// ===== FORMAT CURRENCY (Indian System) =====
function formatCurrency(num) {
    const isNeg = num < 0;
    num = Math.abs(Math.round(num));
    let str = num.toString();
    let result = '';

    if (str.length > 3) {
        result = str.substring(str.length - 3);
        str = str.substring(0, str.length - 3);
        while (str.length > 2) {
            result = str.substring(str.length - 2) + ',' + result;
            str = str.substring(0, str.length - 2);
        }
        result = str + ',' + result;
    } else {
        result = str;
    }

    return (isNeg ? '-' : '') + '₹' + result;
}

function formatShort(num) {
    if (num >= 10000000) return '₹' + (num / 10000000).toFixed(1) + ' Cr';
    if (num >= 100000) return '₹' + (num / 100000).toFixed(1) + ' L';
    if (num >= 1000) return '₹' + (num / 1000).toFixed(1) + 'K';
    return '₹' + Math.round(num);
}

// ===== INPUT VALIDATION =====
function validateInput(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    const val = parseFloat(input.value);

    if (input.value.trim() === '' || isNaN(val)) {
        input.classList.add('error');
        error.textContent = 'Please enter a valid number';
        error.classList.add('visible');
        return false;
    }

    if (val <= 0) {
        input.classList.add('error');
        error.textContent = 'Value must be greater than 0';
        error.classList.add('visible');
        return false;
    }

    input.classList.remove('error');
    error.classList.remove('visible');
    return true;
}

function clearValidation(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input) input.classList.remove('error');
    if (error) error.classList.remove('visible');
}

// ===== DOUGHNUT CHART =====
function drawDoughnut(canvasId, segments) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const size = 280;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size / 2 + 'px';
    canvas.style.height = size / 2 + 'px';
    ctx.scale(dpr, dpr);

    const w = size / 2;
    const cx = w / 2;
    const cy = w / 2;
    const outerR = w / 2 - 4;
    const innerR = outerR * 0.62;
    const total = segments.reduce((s, seg) => s + seg.value, 0);
    const gap = 0.04;

    ctx.clearRect(0, 0, w, w);

    let startAngle = -Math.PI / 2;

    segments.forEach(seg => {
        const slice = (seg.value / total) * (2 * Math.PI - gap * segments.length);
        const endAngle = startAngle + slice;

        ctx.beginPath();
        ctx.arc(cx, cy, outerR, startAngle, endAngle);
        ctx.arc(cx, cy, innerR, endAngle, startAngle, true);
        ctx.closePath();
        ctx.fillStyle = seg.color;
        ctx.fill();

        startAngle = endAngle + gap;
    });
}

function updateLegend(legendId, segments) {
    const el = document.getElementById(legendId);
    if (!el) return;
    const total = segments.reduce((s, seg) => s + seg.value, 0);

    el.innerHTML = segments.map(s => {
        const pct = ((s.value / total) * 100).toFixed(1);
        return `
            <div class="legend-row">
                <div class="l-color" style="background:${s.color}"></div>
                <div class="l-info">
                    <span class="l-name">${s.label}</span>
                    <span class="l-val">${formatCurrency(s.value)}<span class="l-pct">(${pct}%)</span></span>
                </div>
            </div>`;
    }).join('');
}

// ===== SIP CALCULATOR =====
function calculateSIP() {
    // Validate
    const fields = [
        ['sip-amount', 'err-sip-amount'],
        ['sip-rate', 'err-sip-rate'],
        ['sip-years', 'err-sip-years']
    ];

    let valid = true;
    fields.forEach(([inp, err]) => {
        if (!validateInput(inp, err)) valid = false;
    });

    // Step-up is optional, validate only if filled
    const stepupVal = document.getElementById('sip-stepup')?.value;
    if (stepupVal && parseFloat(stepupVal) < 0) {
        document.getElementById('sip-stepup').classList.add('error');
        document.getElementById('err-sip-stepup').textContent = 'Cannot be negative';
        document.getElementById('err-sip-stepup').classList.add('visible');
        valid = false;
    }

    if (!valid) return;

    const amount = parseFloat(document.getElementById('sip-amount').value);
    const rate = parseFloat(document.getElementById('sip-rate').value) / 100;
    const years = parseFloat(document.getElementById('sip-years').value);
    const stepup = parseFloat(document.getElementById('sip-stepup')?.value || 0) / 100;
    const monthlyRate = rate / 12;

    let sipFV = 0, totalInvested = 0, currentSIP = amount;

    for (let y = 0; y < years; y++) {
        for (let m = 0; m < 12; m++) {
            const monthsLeft = (years - y) * 12 - m;
            sipFV += currentSIP * Math.pow(1 + monthlyRate, monthsLeft);
            totalInvested += currentSIP;
        }
        currentSIP *= (1 + stepup);
    }

    const profit = sipFV - totalInvested;
    const profitPct = ((profit / totalInvested) * 100).toFixed(1);

    // Update UI
    document.getElementById('res-sip-invested').textContent = formatCurrency(totalInvested);
    document.getElementById('res-sip-value').textContent = formatCurrency(sipFV);
    document.getElementById('res-sip-profit').textContent = formatCurrency(profit);
    document.getElementById('res-sip-pct').textContent = '+' + profitPct + '%';

    // Chart
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const segments = [
        { label: 'Invested', value: totalInvested, color: isDark ? '#00d4a0' : '#00b386' },
        { label: 'Returns', value: profit, color: isDark ? '#7c85ff' : '#5b6cff' }
    ];
    drawDoughnut('sip-chart', segments);
    document.getElementById('sip-chart-total').textContent = formatShort(sipFV);
    updateLegend('sip-legend', segments);

    // Show results
    const results = document.getElementById('sip-results');
    results.classList.remove('visible');
    void results.offsetWidth;
    results.classList.add('visible');
}

function resetSIP() {
    ['sip-amount', 'sip-rate', 'sip-years', 'sip-stepup'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.value = ''; el.classList.remove('error'); }
    });
    ['err-sip-amount', 'err-sip-rate', 'err-sip-years', 'err-sip-stepup'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('visible');
    });
    document.getElementById('sip-results')?.classList.remove('visible');
}

// ===== LUMPSUM CALCULATOR =====
function calculateLumpsum() {
    const fields = [
        ['ls-amount', 'err-ls-amount'],
        ['ls-rate', 'err-ls-rate'],
        ['ls-years', 'err-ls-years']
    ];

    let valid = true;
    fields.forEach(([inp, err]) => {
        if (!validateInput(inp, err)) valid = false;
    });
    if (!valid) return;

    const amount = parseFloat(document.getElementById('ls-amount').value);
    const rate = parseFloat(document.getElementById('ls-rate').value) / 100;
    const years = parseFloat(document.getElementById('ls-years').value);

    const futureValue = amount * Math.pow(1 + rate, years);
    const profit = futureValue - amount;
    const profitPct = ((profit / amount) * 100).toFixed(1);

    // Update UI
    document.getElementById('res-ls-invested').textContent = formatCurrency(amount);
    document.getElementById('res-ls-value').textContent = formatCurrency(futureValue);
    document.getElementById('res-ls-profit').textContent = formatCurrency(profit);
    document.getElementById('res-ls-pct').textContent = '+' + profitPct + '%';

    // Chart
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const segments = [
        { label: 'Invested', value: amount, color: isDark ? '#00d4a0' : '#00b386' },
        { label: 'Returns', value: profit, color: isDark ? '#7c85ff' : '#5b6cff' }
    ];
    drawDoughnut('ls-chart', segments);
    document.getElementById('ls-chart-total').textContent = formatShort(futureValue);
    updateLegend('ls-legend', segments);

    // Show results
    const results = document.getElementById('ls-results');
    results.classList.remove('visible');
    void results.offsetWidth;
    results.classList.add('visible');
}

function resetLumpsum() {
    ['ls-amount', 'ls-rate', 'ls-years'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.value = ''; el.classList.remove('error'); }
    });
    ['err-ls-amount', 'err-ls-rate', 'err-ls-years'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('visible');
    });
    document.getElementById('ls-results')?.classList.remove('visible');
}

// ===== REDRAW CHARTS ON THEME CHANGE =====
function redrawVisibleCharts() {
    // SIP
    const sipResults = document.getElementById('sip-results');
    if (sipResults?.classList.contains('visible')) {
        calculateSIP();
    }
    // Lumpsum
    const lsResults = document.getElementById('ls-results');
    if (lsResults?.classList.contains('visible')) {
        calculateLumpsum();
    }
}

// ===== KEYBOARD SUPPORT =====
document.addEventListener('DOMContentLoaded', () => {
    initTheme();

    // SIP inputs → Enter
    document.querySelectorAll('#sip-amount, #sip-rate, #sip-years, #sip-stepup').forEach(el => {
        if (el) {
            el.addEventListener('keypress', e => { if (e.key === 'Enter') calculateSIP(); });
            el.addEventListener('input', () => {
                const errId = 'err-' + el.id;
                clearValidation(el.id, errId);
            });
        }
    });

    // Lumpsum inputs → Enter
    document.querySelectorAll('#ls-amount, #ls-rate, #ls-years').forEach(el => {
        if (el) {
            el.addEventListener('keypress', e => { if (e.key === 'Enter') calculateLumpsum(); });
            el.addEventListener('input', () => {
                const errId = 'err-' + el.id;
                clearValidation(el.id, errId);
            });
        }
    });
});
