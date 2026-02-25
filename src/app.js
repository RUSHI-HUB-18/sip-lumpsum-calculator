/* ================================================================
   RUSHI FINANCE TOOLS — Complete Application
   ================================================================ */

/* ===== THEME ===== */
function initTheme() { const s = localStorage.getItem('theme'); document.documentElement.setAttribute('data-theme', s || 'light'); updIcon() }
function togTheme() { const c = document.documentElement.getAttribute('data-theme'); const n = c === 'dark' ? 'light' : 'dark'; document.documentElement.setAttribute('data-theme', n); localStorage.setItem('theme', n); updIcon(); recolor() }
function updIcon() { const d = document.documentElement.getAttribute('data-theme') === 'dark'; document.querySelectorAll('.theme-icon').forEach(e => e.textContent = d ? '🌙' : '☀️') }
function isDark() { return document.documentElement.getAttribute('data-theme') === 'dark' }

/* ===== NAV ===== */
function togNav() { document.getElementById('nav-links')?.classList.toggle('open') }
document.addEventListener('click', e => { const nl = document.getElementById('nav-links'); const hb = document.querySelector('.hamburger'); if (nl && !nl.contains(e.target) && !hb?.contains(e.target)) nl.classList.remove('open') })

/* ===== FORMAT ===== */
function fmt(n) { const neg = n < 0; n = Math.abs(Math.round(n)); let s = n.toString(), r = ''; if (s.length > 3) { r = s.slice(-3); s = s.slice(0, -3); while (s.length > 2) { r = s.slice(-2) + ',' + r; s = s.slice(0, -2) } r = s + ',' + r } else r = s; return (neg ? '-' : '') + '₹' + r }
function fmtS(n) { if (n >= 1e7) return '₹' + (n / 1e7).toFixed(1) + ' Cr'; if (n >= 1e5) return '₹' + (n / 1e5).toFixed(1) + ' L'; if (n >= 1e3) return '₹' + (n / 1e3).toFixed(1) + 'K'; return '₹' + Math.round(n) }

/* ===== VALIDATION ===== */
function vld(id, eid) { const i = document.getElementById(id), e = document.getElementById(eid); if (!i || !e) return true; const v = parseFloat(i.value); if (i.value.trim() === '' || isNaN(v)) { i.classList.add('err'); e.textContent = 'Enter a valid number'; e.classList.add('show'); return false } if (v <= 0) { i.classList.add('err'); e.textContent = 'Must be greater than 0'; e.classList.add('show'); return false } i.classList.remove('err'); e.classList.remove('show'); return true }
function clrV(id, eid) { document.getElementById(id)?.classList.remove('err'); document.getElementById(eid)?.classList.remove('show') }

/* ===== CHARTS ===== */
let charts = {};
function getColors() { return isDark() ? { g: '#00d4a0', b: '#7c86ff', r: '#ff6b6b', a: '#fbbf24', p: '#a78bfa', c: '#22d3ee', o: '#fb923c', grid: 'rgba(255,255,255,0.06)', txt: '#9299b4' } : { g: '#00b386', b: '#5b6cff', r: '#eb5757', a: '#f5a623', p: '#8b5cf6', c: '#06b6d4', o: '#f97316', grid: 'rgba(0,0,0,0.06)', txt: '#8c92a8' } }

function mkDoughnut(id, labels, data, colors) {
    const ctx = document.getElementById(id); if (!ctx) return; if (charts[id]) charts[id].destroy();
    charts[id] = new Chart(ctx, { type: 'doughnut', data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 0, hoverOffset: 6 }] }, options: { responsive: true, maintainAspectRatio: true, cutout: '65%', plugins: { legend: { display: false }, tooltip: { backgroundColor: isDark() ? '#252a42' : '#fff', titleColor: isDark() ? '#eee' : '#333', bodyColor: isDark() ? '#ccc' : '#555', borderColor: isDark() ? '#333' : '#e4e7ee', borderWidth: 1, padding: 10, cornerRadius: 8, callbacks: { label: ctx => ctx.label + ': ' + fmt(ctx.raw) } } }, animation: { animateRotate: true, duration: 800 } } })
}

function mkLine(id, labels, datasets) {
    const ctx = document.getElementById(id); if (!ctx) return; const c = getColors(); if (charts[id]) charts[id].destroy();
    charts[id] = new Chart(ctx, { type: 'line', data: { labels, datasets }, options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { labels: { color: c.txt, font: { size: 11, family: 'Inter' }, usePointStyle: true, pointStyle: 'circle', padding: 12 } }, tooltip: { mode: 'index', intersect: false, backgroundColor: isDark() ? '#252a42' : '#fff', titleColor: isDark() ? '#eee' : '#333', bodyColor: isDark() ? '#ccc' : '#555', borderColor: isDark() ? '#333' : '#e4e7ee', borderWidth: 1, padding: 10, cornerRadius: 8, callbacks: { label: ctx => ctx.dataset.label + ': ' + fmt(ctx.raw) } } }, scales: { x: { grid: { color: c.grid }, ticks: { color: c.txt, font: { size: 10 } } }, y: { grid: { color: c.grid }, ticks: { color: c.txt, font: { size: 10 }, callback: v => fmtS(v) } } }, animation: { duration: 1000 }, elements: { point: { radius: 3, hoverRadius: 5 }, line: { tension: .3 } } } })
}

function recolor() { Object.keys(charts).forEach(id => { const ch = charts[id]; if (!ch) return; const c = getColors(); if (ch.config.type === 'line') { ch.options.scales.x.grid.color = c.grid; ch.options.scales.x.ticks.color = c.txt; ch.options.scales.y.grid.color = c.grid; ch.options.scales.y.ticks.color = c.txt; ch.options.plugins.legend.labels.color = c.txt } ch.update() }) }

/* ===== SHOW RESULTS ===== */
function showRes(id) { const el = document.getElementById(id); if (!el) return; el.classList.remove('show'); void el.offsetWidth; el.classList.add('show') }

/* ===== TOAST ===== */
function showToast(msg, icon = '✅') {
    let t = document.getElementById('app-toast');
    if (!t) { t = document.createElement('div'); t.id = 'app-toast'; t.className = 'toast'; document.body.appendChild(t) }
    t.innerHTML = `<span class="toast-icon">${icon}</span>${msg}`;
    t.classList.remove('show'); void t.offsetWidth; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2800)
}

/* ===== MOCK FUND DATA ===== */
const FUNDS = [
    { id: 'large', name: 'Large Cap Fund', rate: 11, desc: 'Invests in top 100 companies. Lower risk, stable returns. Ideal for conservative investors seeking steady growth.' },
    { id: 'mid', name: 'Mid Cap Fund', rate: 13, desc: 'Invests in mid-sized companies (rank 101-250). Moderate risk with higher growth potential than large caps.' },
    { id: 'small', name: 'Small Cap Fund', rate: 15, desc: 'Invests in smaller companies (rank 251+). Higher risk but potentially highest returns. Needs longer horizon.' },
    { id: 'index', name: 'Index Fund (Nifty 50)', rate: 10, desc: 'Passively tracks the Nifty 50 index. Lowest expense ratio, great for beginners. Market-matching returns.' },
    { id: 'flexi', name: 'Flexi Cap Fund', rate: 12, desc: 'Invests across all market caps. Fund manager allocates dynamically based on market conditions.' },
    { id: 'elss', name: 'ELSS Tax Saver', rate: 12.5, desc: '3-year lock-in with tax benefits under Section 80C. Dual benefit of tax saving and wealth creation.' }
];

function onFundSelect(selectId, rateId) {
    const sel = document.getElementById(selectId);
    const rateInput = document.getElementById(rateId);
    const fundInfo = document.getElementById(selectId + '-info');
    if (!sel) return;
    const fund = FUNDS.find(f => f.id === sel.value);
    if (fund) {
        if (rateInput) rateInput.value = fund.rate;
        if (fundInfo) { fundInfo.textContent = fund.desc; fundInfo.classList.add('show') }
    } else {
        if (fundInfo) fundInfo.classList.remove('show');
    }
}

/* ===================================================================
   SIP CALCULATOR (with Step-up, Fund selector, Scenario, Inflation)
   =================================================================== */
function calcSIP() {
    const f = [['sip-amt', 'e-sip-amt'], ['sip-rate', 'e-sip-rate'], ['sip-yrs', 'e-sip-yrs']];
    let ok = true; f.forEach(([i, e]) => { if (!vld(i, e)) ok = false }); if (!ok) return;
    const amt = parseFloat(document.getElementById('sip-amt').value);
    const rate = parseFloat(document.getElementById('sip-rate').value) / 100;
    const yrs = parseFloat(document.getElementById('sip-yrs').value);
    const su = parseFloat(document.getElementById('sip-su')?.value || 0) / 100;
    const infRate = parseFloat(document.getElementById('sip-inf')?.value || 0) / 100;
    const mr = rate / 12;
    let fv = 0, inv = 0, cur = amt, yearly = [];
    for (let y = 0; y < yrs; y++) { for (let m = 0; m < 12; m++) { fv += cur * Math.pow(1 + mr, (yrs - y) * 12 - m); inv += cur } cur *= (1 + su); yearly.push({ inv: Math.round(inv), fv: Math.round(fv) }) }
    const profit = fv - inv, pct = ((profit / inv) * 100).toFixed(1);
    document.getElementById('r-sip-inv').textContent = fmt(inv);
    document.getElementById('r-sip-fv').textContent = fmt(fv);
    document.getElementById('r-sip-pr').textContent = fmt(profit);
    document.getElementById('r-sip-pct').textContent = '+' + pct + '%';
    const c = getColors();
    mkDoughnut('ch-sip-d', ['Invested', 'Returns'], [inv, profit], [c.g, c.b]);
    const lbls = yearly.map((_, i) => 'Yr ' + (i + 1));
    mkLine('ch-sip-l', lbls, [{ label: 'Invested', data: yearly.map(y => y.inv), borderColor: c.g, backgroundColor: c.g + '20', fill: true }, { label: 'Value', data: yearly.map(y => y.fv), borderColor: c.b, backgroundColor: c.b + '20', fill: true }]);

    // Inflation adjusted
    if (infRate > 0) {
        const realValue = fv / Math.pow(1 + infRate, yrs);
        const lossPercent = ((1 - realValue / fv) * 100).toFixed(1);
        const infDiv = document.getElementById('sip-inflation-results');
        if (infDiv) {
            document.getElementById('r-sip-nominal').textContent = fmt(fv);
            document.getElementById('r-sip-real').textContent = fmt(realValue);
            document.getElementById('r-sip-loss').textContent = lossPercent + '%';
            document.getElementById('sip-inf-note').textContent = `"${fmt(fv)} in ${yrs} years will be worth approximately ${fmt(realValue)} in today's purchasing power — a ${lossPercent}% loss due to inflation."`;
            infDiv.style.display = 'block';
            // Inflation chart
            mkLine('ch-sip-inf', lbls, [
                { label: 'Nominal Value', data: yearly.map(y => y.fv), borderColor: c.b, backgroundColor: c.b + '20', fill: true },
                { label: 'Real Value', data: yearly.map((y, i) => Math.round(y.fv / Math.pow(1 + infRate, i + 1))), borderColor: c.a, backgroundColor: c.a + '20', fill: true }
            ]);
        }
    } else {
        const infDiv = document.getElementById('sip-inflation-results');
        if (infDiv) infDiv.style.display = 'none';
    }

    // Scenario Simulator
    buildScenario(amt, yrs, su);

    window._lastSIP = { inv, fv, profit, pct, yrs, amt, rate: rate * 100, su: su * 100 }; showRes('sip-res')
}

function buildScenario(amt, yrs, su) {
    const scenarios = [
        { name: 'Conservative', rate: 0.08, color: 'c' },
        { name: 'Moderate', rate: 0.12, color: 'a' },
        { name: 'Aggressive', rate: 0.15, color: 'r' }
    ];
    const c = getColors();
    const colorMap = { c: c.c, a: c.a, r: c.r };
    const lbls = [];
    const datasets = [];
    const finalAmounts = [];

    scenarios.forEach(sc => {
        const mr = sc.rate / 12;
        let fv = 0, inv = 0, cur = amt, yearlyData = [];
        for (let y = 0; y < yrs; y++) {
            for (let m = 0; m < 12; m++) { fv += cur * Math.pow(1 + mr, (yrs - y) * 12 - m); inv += cur }
            cur *= (1 + su);
            yearlyData.push(Math.round(fv));
        }
        finalAmounts.push({ name: sc.name, rate: (sc.rate * 100) + '%', invested: inv, fv: Math.round(fv), profit: Math.round(fv - inv) });
        datasets.push({
            label: sc.name + ' (' + (sc.rate * 100) + '%)',
            data: yearlyData,
            borderColor: colorMap[sc.color],
            backgroundColor: colorMap[sc.color] + '15',
            fill: false,
            borderWidth: 2
        });
    });

    for (let y = 1; y <= yrs; y++) lbls.push('Yr ' + y);

    const scenarioChart = document.getElementById('ch-sip-scenario');
    if (scenarioChart) mkLine('ch-sip-scenario', lbls, datasets);

    // Update scenario table
    const tbody = document.getElementById('scenario-tbody');
    if (tbody) {
        tbody.innerHTML = finalAmounts.map(fa => `<tr><td>${fa.name}</td><td>${fa.rate}</td><td>${fmt(fa.invested)}</td><td style="font-weight:700;color:var(--green)">${fmt(fa.fv)}</td><td>${fmt(fa.profit)}</td></tr>`).join('');
    }

    const scenarioSection = document.getElementById('sip-scenario-section');
    if (scenarioSection) scenarioSection.style.display = 'block';
}

function rstSIP() {
    ['sip-amt', 'sip-rate', 'sip-yrs', 'sip-su', 'sip-inf'].forEach(id => { const e = document.getElementById(id); if (e) { e.value = (id === 'sip-su' || id === 'sip-inf') ? '0' : ''; e.classList.remove('err') } });
    ['e-sip-amt', 'e-sip-rate', 'e-sip-yrs'].forEach(id => document.getElementById(id)?.classList.remove('show'));
    const fundSel = document.getElementById('sip-fund');
    if (fundSel) { fundSel.value = ''; const info = document.getElementById('sip-fund-info'); if (info) info.classList.remove('show'); }
    document.getElementById('sip-res')?.classList.remove('show');
    const infDiv = document.getElementById('sip-inflation-results'); if (infDiv) infDiv.style.display = 'none';
    const scDiv = document.getElementById('sip-scenario-section'); if (scDiv) scDiv.style.display = 'none';
}

/* ===== LUMPSUM CALCULATOR ===== */
function calcLS() {
    const f = [['ls-amt', 'e-ls-amt'], ['ls-rate', 'e-ls-rate'], ['ls-yrs', 'e-ls-yrs']];
    let ok = true; f.forEach(([i, e]) => { if (!vld(i, e)) ok = false }); if (!ok) return;
    const amt = parseFloat(document.getElementById('ls-amt').value);
    const rate = parseFloat(document.getElementById('ls-rate').value) / 100;
    const yrs = parseFloat(document.getElementById('ls-yrs').value);
    const infRate = parseFloat(document.getElementById('ls-inf')?.value || 0) / 100;
    const fv = amt * Math.pow(1 + rate, yrs), profit = fv - amt, pct = ((profit / amt) * 100).toFixed(1);
    const yearly = []; for (let y = 1; y <= yrs; y++) yearly.push({ inv: amt, fv: Math.round(amt * Math.pow(1 + rate, y)) });
    document.getElementById('r-ls-inv').textContent = fmt(amt);
    document.getElementById('r-ls-fv').textContent = fmt(fv);
    document.getElementById('r-ls-pr').textContent = fmt(profit);
    document.getElementById('r-ls-pct').textContent = '+' + pct + '%';
    const c = getColors();
    mkDoughnut('ch-ls-d', ['Invested', 'Returns'], [amt, profit], [c.g, c.b]);
    const lbls = yearly.map((_, i) => 'Yr ' + (i + 1));
    mkLine('ch-ls-l', lbls, [{ label: 'Invested', data: yearly.map(() => amt), borderColor: c.g, backgroundColor: c.g + '20', fill: true }, { label: 'Value', data: yearly.map(y => y.fv), borderColor: c.b, backgroundColor: c.b + '20', fill: true }]);

    // Inflation adjusted
    if (infRate > 0) {
        const realValue = fv / Math.pow(1 + infRate, yrs);
        const lossPercent = ((1 - realValue / fv) * 100).toFixed(1);
        const infDiv = document.getElementById('ls-inflation-results');
        if (infDiv) {
            document.getElementById('r-ls-nominal').textContent = fmt(fv);
            document.getElementById('r-ls-real').textContent = fmt(realValue);
            document.getElementById('r-ls-loss').textContent = lossPercent + '%';
            document.getElementById('ls-inf-note').textContent = `"${fmt(fv)} in ${yrs} years will be worth approximately ${fmt(realValue)} in today's purchasing power."`;
            infDiv.style.display = 'block';
            mkLine('ch-ls-inf', lbls, [
                { label: 'Nominal Value', data: yearly.map(y => y.fv), borderColor: c.b, backgroundColor: c.b + '20', fill: true },
                { label: 'Real Value', data: yearly.map((y, i) => Math.round(y.fv / Math.pow(1 + infRate, i + 1))), borderColor: c.a, backgroundColor: c.a + '20', fill: true }
            ]);
        }
    } else {
        const infDiv = document.getElementById('ls-inflation-results'); if (infDiv) infDiv.style.display = 'none';
    }

    // Lumpsum Scenario
    buildLumpsumScenario(amt, yrs);

    window._lastLS = { inv: amt, fv, profit, pct, yrs, rate: rate * 100 }; showRes('ls-res')
}

function buildLumpsumScenario(amt, yrs) {
    const scenarios = [
        { name: 'Conservative', rate: 0.08, color: 'c' },
        { name: 'Moderate', rate: 0.12, color: 'a' },
        { name: 'Aggressive', rate: 0.15, color: 'r' }
    ];
    const c = getColors();
    const colorMap = { c: c.c, a: c.a, r: c.r };
    const lbls = [];
    const datasets = [];
    const finalAmounts = [];

    scenarios.forEach(sc => {
        const yearlyData = [];
        for (let y = 1; y <= yrs; y++) yearlyData.push(Math.round(amt * Math.pow(1 + sc.rate, y)));
        finalAmounts.push({ name: sc.name, rate: (sc.rate * 100) + '%', invested: amt, fv: yearlyData[yearlyData.length - 1], profit: yearlyData[yearlyData.length - 1] - amt });
        datasets.push({ label: sc.name + ' (' + (sc.rate * 100) + '%)', data: yearlyData, borderColor: colorMap[sc.color], backgroundColor: colorMap[sc.color] + '15', fill: false, borderWidth: 2 });
    });

    for (let y = 1; y <= yrs; y++) lbls.push('Yr ' + y);
    const scChart = document.getElementById('ch-ls-scenario');
    if (scChart) mkLine('ch-ls-scenario', lbls, datasets);
    const tbody = document.getElementById('ls-scenario-tbody');
    if (tbody) tbody.innerHTML = finalAmounts.map(fa => `<tr><td>${fa.name}</td><td>${fa.rate}</td><td>${fmt(fa.invested)}</td><td style="font-weight:700;color:var(--green)">${fmt(fa.fv)}</td><td>${fmt(fa.profit)}</td></tr>`).join('');
    const scSection = document.getElementById('ls-scenario-section');
    if (scSection) scSection.style.display = 'block';
}

function rstLS() {
    ['ls-amt', 'ls-rate', 'ls-yrs', 'ls-inf'].forEach(id => { const e = document.getElementById(id); if (e) { e.value = id === 'ls-inf' ? '0' : ''; e.classList.remove('err') } });
    ['e-ls-amt', 'e-ls-rate', 'e-ls-yrs'].forEach(id => document.getElementById(id)?.classList.remove('show'));
    const fundSel = document.getElementById('ls-fund'); if (fundSel) { fundSel.value = ''; }
    document.getElementById('ls-res')?.classList.remove('show');
    const infDiv = document.getElementById('ls-inflation-results'); if (infDiv) infDiv.style.display = 'none';
    const scDiv = document.getElementById('ls-scenario-section'); if (scDiv) scDiv.style.display = 'none';
}

/* ===== EMI CALCULATOR ===== */
function calcEMI() {
    const f = [['emi-amt', 'e-emi-amt'], ['emi-rate', 'e-emi-rate'], ['emi-yrs', 'e-emi-yrs']];
    let ok = true; f.forEach(([i, e]) => { if (!vld(i, e)) ok = false }); if (!ok) return;
    const P = parseFloat(document.getElementById('emi-amt').value);
    const r = parseFloat(document.getElementById('emi-rate').value) / 100 / 12;
    const n = parseFloat(document.getElementById('emi-yrs').value) * 12;
    const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const total = emi * n, interest = total - P, pPct = ((P / total) * 100).toFixed(1);
    const yearly = []; let bal = P;
    for (let y = 1; y <= n / 12; y++) { let yInt = 0, yPrin = 0; for (let m = 0; m < 12 && bal > 0; m++) { const mi = bal * r; const mp = emi - mi; yInt += mi; yPrin += mp; bal -= mp } yearly.push({ bal: Math.max(0, Math.round(bal)), paid: Math.round(P - Math.max(0, bal)) }) }
    document.getElementById('r-emi-emi').textContent = fmt(emi);
    document.getElementById('r-emi-p').textContent = fmt(P);
    document.getElementById('r-emi-i').textContent = fmt(interest);
    document.getElementById('r-emi-t').textContent = fmt(total);
    document.getElementById('r-emi-pct').textContent = pPct + '%';
    const c = getColors();
    mkDoughnut('ch-emi-d', ['Principal', 'Interest'], [P, interest], [c.g, c.r]);
    mkLine('ch-emi-l', yearly.map((_, i) => 'Yr ' + (i + 1)), [{ label: 'Balance', data: yearly.map(y => y.bal), borderColor: c.r, backgroundColor: c.r + '20', fill: true }, { label: 'Paid Off', data: yearly.map(y => y.paid), borderColor: c.g, backgroundColor: c.g + '20', fill: true }]);
    window._lastEMI = { emi, P, interest, total, yrs: n / 12, rate: r * 12 * 100 }; showRes('emi-res')
}
function rstEMI() { ['emi-amt', 'emi-rate', 'emi-yrs'].forEach(id => { const e = document.getElementById(id); if (e) { e.value = ''; e.classList.remove('err') } });['e-emi-amt', 'e-emi-rate', 'e-emi-yrs'].forEach(id => document.getElementById(id)?.classList.remove('show')); document.getElementById('emi-res')?.classList.remove('show') }

/* ===== GOAL CALCULATOR (with step-up) ===== */
function calcGoal() {
    const f = [['goal-amt', 'e-goal-amt'], ['goal-rate', 'e-goal-rate'], ['goal-yrs', 'e-goal-yrs']];
    let ok = true; f.forEach(([i, e]) => { if (!vld(i, e)) ok = false }); if (!ok) return;
    const target = parseFloat(document.getElementById('goal-amt').value);
    const rate = parseFloat(document.getElementById('goal-rate').value) / 100;
    const yrs = parseFloat(document.getElementById('goal-yrs').value);
    const su = parseFloat(document.getElementById('goal-su')?.value || 0) / 100;
    const mr = rate / 12, n = yrs * 12;

    // Reverse SIP calculation - with step-up requires iterative approach
    let sip;
    if (su > 0) {
        // With step-up: use iterative approach
        // FV = sum over y=0..(yrs-1) of [ sip*(1+su)^y * sum over m=0..11 of (1+mr)^((yrs-y)*12-m) ]
        let multiplier = 0;
        for (let y = 0; y < yrs; y++) {
            for (let m = 0; m < 12; m++) {
                multiplier += Math.pow(1 + su, y) * Math.pow(1 + mr, (yrs - y) * 12 - m);
            }
        }
        sip = target / multiplier;
    } else {
        sip = target * mr / (Math.pow(1 + mr, n) - 1);
    }

    const lumpsum = target / Math.pow(1 + rate, yrs);
    // Calculate total invested
    let totalInv = 0, curSip = sip;
    for (let y = 0; y < yrs; y++) { totalInv += curSip * 12; curSip *= (1 + su); }
    const sipReturns = target - totalInv;

    document.getElementById('r-goal-sip').textContent = fmt(sip) + '/mo';
    document.getElementById('r-goal-ls').textContent = fmt(lumpsum);
    document.getElementById('r-goal-inv').textContent = fmt(totalInv);
    document.getElementById('r-goal-ret').textContent = fmt(sipReturns);
    document.getElementById('r-goal-profit').textContent = fmt(sipReturns);
    const c = getColors();
    mkDoughnut('ch-goal-d', ['You Invest', 'Market Returns'], [totalInv, sipReturns], [c.g, c.b]);

    const growthData = []; let cumFV = 0, cumInv = 0; curSip = sip;
    for (let y = 0; y < yrs; y++) { for (let m = 0; m < 12; m++) { cumFV += curSip * Math.pow(1 + mr, (yrs - y) * 12 - m); cumInv += curSip } curSip *= (1 + su); growthData.push({ fv: Math.round(cumFV), inv: Math.round(cumInv) }) }
    mkLine('ch-goal-l', growthData.map((_, i) => 'Yr ' + (i + 1)), [{ label: 'SIP Growth', data: growthData.map(g => g.fv), borderColor: c.g, backgroundColor: c.g + '20', fill: true }, { label: 'Target', data: growthData.map(() => target), borderColor: c.a, borderDash: [5, 5], backgroundColor: 'transparent', fill: false }]);
    window._lastGoal = { sip, lumpsum, target, yrs, rate: rate * 100, totalInv, sipReturns }; showRes('goal-res')
}
function rstGoal() { ['goal-amt', 'goal-rate', 'goal-yrs', 'goal-su'].forEach(id => { const e = document.getElementById(id); if (e) { e.value = (id === 'goal-su') ? '0' : ''; e.classList.remove('err') } });['e-goal-amt', 'e-goal-rate', 'e-goal-yrs'].forEach(id => document.getElementById(id)?.classList.remove('show')); document.getElementById('goal-res')?.classList.remove('show') }

/* ===== RETIREMENT CALCULATOR ===== */
function calcRetire() {
    const f = [['ret-age', 'e-ret-age'], ['ret-rage', 'e-ret-rage'], ['ret-exp', 'e-ret-exp'], ['ret-rate', 'e-ret-rate'], ['ret-inf', 'e-ret-inf']];
    let ok = true; f.forEach(([i, e]) => { if (!vld(i, e)) ok = false }); if (!ok) return;
    const curAge = parseFloat(document.getElementById('ret-age').value);
    const retAge = parseFloat(document.getElementById('ret-rage').value);
    const monthExp = parseFloat(document.getElementById('ret-exp').value);
    const rate = parseFloat(document.getElementById('ret-rate').value) / 100;
    const inf = parseFloat(document.getElementById('ret-inf').value) / 100;
    if (retAge <= curAge) { document.getElementById('ret-rage').classList.add('err'); document.getElementById('e-ret-rage').textContent = 'Must be after current age'; document.getElementById('e-ret-rage').classList.add('show'); return }
    const yrsToRetire = retAge - curAge;
    const lifeExp = 80; const yrsInRetire = lifeExp - retAge;
    const futureMonthExp = monthExp * Math.pow(1 + inf, yrsToRetire);
    const futureAnnualExp = futureMonthExp * 12;
    const realRate = (rate - inf) / (1 + inf);
    let corpus = 0;
    if (realRate > 0) { corpus = futureAnnualExp * (1 - Math.pow(1 + realRate, -yrsInRetire)) / realRate }
    else { corpus = futureAnnualExp * yrsInRetire }
    const mr = rate / 12; const n = yrsToRetire * 12;
    const sipNeeded = corpus * mr / (Math.pow(1 + mr, n) - 1);
    const totalInv = sipNeeded * n; const returns = corpus - totalInv;
    document.getElementById('r-ret-corpus').textContent = fmt(corpus);
    document.getElementById('r-ret-sip').textContent = fmt(sipNeeded) + '/mo';
    document.getElementById('r-ret-fexp').textContent = fmt(futureMonthExp) + '/mo';
    document.getElementById('r-ret-inv').textContent = fmt(totalInv);
    const c = getColors();
    mkDoughnut('ch-ret-d', ['Your Investment', 'Market Returns'], [totalInv, returns], [c.g, c.b]);
    const growthData = []; let cumFV = 0, cumInv = 0;
    for (let y = 0; y < yrsToRetire; y++) { for (let m = 0; m < 12; m++) { cumFV += sipNeeded * Math.pow(1 + mr, (yrsToRetire - y) * 12 - m); cumInv += sipNeeded } growthData.push({ fv: Math.round(cumFV), inv: Math.round(cumInv) }) }
    mkLine('ch-ret-l', growthData.map((_, i) => 'Yr ' + (i + 1)), [{ label: 'Corpus Growth', data: growthData.map(g => g.fv), borderColor: c.g, backgroundColor: c.g + '20', fill: true }, { label: 'Target', data: growthData.map(() => Math.round(corpus)), borderColor: c.a, borderDash: [5, 5], backgroundColor: 'transparent', fill: false }]);
    window._lastRet = { corpus, sipNeeded, futureMonthExp, totalInv, yrsToRetire }; showRes('ret-res')
}
function rstRetire() { ['ret-age', 'ret-rage', 'ret-exp', 'ret-rate', 'ret-inf'].forEach(id => { const e = document.getElementById(id); if (e) { e.value = ''; e.classList.remove('err') } });['e-ret-age', 'e-ret-rage', 'e-ret-exp', 'e-ret-rate', 'e-ret-inf'].forEach(id => document.getElementById(id)?.classList.remove('show')); document.getElementById('ret-res')?.classList.remove('show') }

/* ===== SHARE ===== */
function shareWA(type) {
    let t = '';
    if (type === 'sip' && window._lastSIP) { const d = window._lastSIP; t = `📈 SIP Calculator Result\n\nMonthly SIP: ${fmt(d.amt)}\nReturn Rate: ${d.rate}%\nDuration: ${d.yrs} years\nStep-up: ${d.su}%\n\n💰 Total Invested: ${fmt(d.inv)}\n📊 Future Value: ${fmt(d.fv)}\n✅ Profit: ${fmt(d.profit)} (+${d.pct}%)\n\nCalculate yours: ${location.href}` }
    else if (type === 'ls' && window._lastLS) { const d = window._lastLS; t = `💎 Lumpsum Result\n\nInvestment: ${fmt(d.inv)}\nReturn: ${d.rate}%\nDuration: ${d.yrs} years\n\n📊 Future Value: ${fmt(d.fv)}\n✅ Profit: ${fmt(d.profit)} (+${d.pct}%)\n\n${location.href}` }
    else if (type === 'emi' && window._lastEMI) { const d = window._lastEMI; t = `🏦 EMI Result\n\nLoan: ${fmt(d.P)}\nRate: ${d.rate.toFixed(1)}%\nTenure: ${d.yrs} years\n\n💳 Monthly EMI: ${fmt(d.emi)}\n📊 Total Interest: ${fmt(d.interest)}\n\n${location.href}` }
    else return;
    window.open('https://wa.me/?text=' + encodeURIComponent(t), '_blank')
}
function shareTW(type) {
    let t = '';
    if (type === 'sip' && window._lastSIP) { const d = window._lastSIP; t = `📈 My SIP of ${fmt(d.amt)}/mo at ${d.rate}% for ${d.yrs}yrs = ${fmt(d.fv)}! Profit: +${d.pct}% 🚀` }
    else if (type === 'ls' && window._lastLS) { const d = window._lastLS; t = `💎 Invested ${fmt(d.inv)} for ${d.yrs}yrs = ${fmt(d.fv)}! +${d.pct}% returns 📈` }
    else if (type === 'emi' && window._lastEMI) { const d = window._lastEMI; t = `🏦 Loan ${fmt(d.P)} at ${d.rate.toFixed(1)}% for ${d.yrs}yrs → EMI: ${fmt(d.emi)}/mo` }
    else return;
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(t + ' ' + location.href), '_blank')
}
function copyLink() { navigator.clipboard?.writeText(location.href).then(() => showToast('Link copied!')).catch(() => { }) }

/* ===== EXPORT CSV ===== */
function exportCSV(type) {
    let csv = '', fname = '';
    if (type === 'sip' && window._lastSIP) { const d = window._lastSIP; csv = 'Metric,Value\nMonthly SIP,' + d.amt + '\nReturn Rate,' + d.rate + '%\nDuration,' + d.yrs + ' years\nStep-up,' + d.su + '%\nTotal Invested,' + Math.round(d.inv) + '\nFuture Value,' + Math.round(d.fv) + '\nProfit,' + Math.round(d.profit) + '\nProfit %,' + d.pct + '%'; fname = 'SIP_Report.csv' }
    else if (type === 'ls' && window._lastLS) { const d = window._lastLS; csv = 'Metric,Value\nInvestment,' + Math.round(d.inv) + '\nReturn Rate,' + d.rate + '%\nDuration,' + d.yrs + ' years\nFuture Value,' + Math.round(d.fv) + '\nProfit,' + Math.round(d.profit) + '\nProfit %,' + d.pct + '%'; fname = 'Lumpsum_Report.csv' }
    else if (type === 'emi' && window._lastEMI) { const d = window._lastEMI; csv = 'Metric,Value\nLoan Amount,' + Math.round(d.P) + '\nRate,' + d.rate.toFixed(1) + '%\nTenure,' + d.yrs + ' years\nMonthly EMI,' + Math.round(d.emi) + '\nTotal Interest,' + Math.round(d.interest) + '\nTotal Payment,' + Math.round(d.total); fname = 'EMI_Report.csv' }
    else return;
    const blob = new Blob([csv], { type: 'text/csv' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = fname; a.click();
    showToast('CSV downloaded!', '📊')
}

function exportPDF() { window.print() }

/* =================================================================
   AUTH SYSTEM (localStorage-based)
   ================================================================= */
const AUTH_KEY = 'rushi_finance_users';
const SESSION_KEY = 'rushi_finance_session';

function getUsers() { try { return JSON.parse(localStorage.getItem(AUTH_KEY)) || [] } catch { return [] } }
function saveUsers(users) { localStorage.setItem(AUTH_KEY, JSON.stringify(users)) }
function getSession() { try { return JSON.parse(localStorage.getItem(SESSION_KEY)) } catch { return null } }
function setSession(user) { localStorage.setItem(SESSION_KEY, JSON.stringify({ email: user.email, name: user.name, loginTime: Date.now() })) }
function clearSession() { localStorage.removeItem(SESSION_KEY) }

function showAuthModal(mode = 'login') {
    const overlay = document.getElementById('auth-modal');
    if (!overlay) return;
    overlay.classList.add('show');
    switchAuthMode(mode);
}

function hideAuthModal() {
    const overlay = document.getElementById('auth-modal');
    if (overlay) overlay.classList.remove('show');
}

function switchAuthMode(mode) {
    document.getElementById('auth-login-form').style.display = mode === 'login' ? 'block' : 'none';
    document.getElementById('auth-signup-form').style.display = mode === 'signup' ? 'block' : 'none';
}

function doSignup() {
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const pass = document.getElementById('signup-pass').value;
    if (!name || !email || !pass) { showToast('Please fill all fields', '⚠️'); return }
    if (pass.length < 4) { showToast('Password too short', '⚠️'); return }
    const users = getUsers();
    if (users.find(u => u.email === email)) { showToast('Email already registered', '⚠️'); return }
    users.push({ name, email, pass: btoa(pass), savedItems: [], createdAt: Date.now() });
    saveUsers(users);
    setSession({ email, name });
    hideAuthModal();
    updateAuthUI();
    showToast('Welcome, ' + name + '! 🎉');
}

function doLogin() {
    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-pass').value;
    if (!email || !pass) { showToast('Please fill all fields', '⚠️'); return }
    const users = getUsers();
    const user = users.find(u => u.email === email && u.pass === btoa(pass));
    if (!user) { showToast('Invalid credentials', '❌'); return }
    setSession(user);
    hideAuthModal();
    updateAuthUI();
    showToast('Welcome back, ' + user.name + '! 👋');
}

function doLogout() {
    clearSession();
    updateAuthUI();
    const dd = document.getElementById('user-dropdown');
    if (dd) dd.classList.remove('show');
    showToast('Logged out successfully');
}

function toggleUserDropdown() {
    const dd = document.getElementById('user-dropdown');
    if (dd) dd.classList.toggle('show');
}

function updateAuthUI() {
    const session = getSession();
    const loginBtn = document.getElementById('nav-login-btn');
    const userMenu = document.getElementById('nav-user-menu');
    if (!loginBtn || !userMenu) return;

    if (session) {
        loginBtn.style.display = 'none';
        userMenu.style.display = 'inline-flex';
        const avatar = userMenu.querySelector('.user-avatar');
        if (avatar) avatar.textContent = session.name.charAt(0).toUpperCase();
        const ddName = document.getElementById('ud-name');
        const ddEmail = document.getElementById('ud-email');
        if (ddName) ddName.textContent = session.name;
        if (ddEmail) ddEmail.textContent = session.email;
    } else {
        loginBtn.style.display = '';
        userMenu.style.display = 'none';
    }
}

// Close dropdown on outside click
document.addEventListener('click', e => {
    const um = document.getElementById('nav-user-menu');
    const dd = document.getElementById('user-dropdown');
    if (um && dd && !um.contains(e.target)) dd.classList.remove('show');
});

/* ===== SAVE CALCULATION ===== */
function saveCalculation(type) {
    const session = getSession();
    if (!session) { showAuthModal('login'); return }
    let data;
    if (type === 'sip' && window._lastSIP) data = { type: 'SIP', ...window._lastSIP };
    else if (type === 'ls' && window._lastLS) data = { type: 'Lumpsum', ...window._lastLS };
    else if (type === 'emi' && window._lastEMI) data = { type: 'EMI', ...window._lastEMI };
    else if (type === 'goal' && window._lastGoal) data = { type: 'Goal', ...window._lastGoal };
    else if (type === 'retirement' && window._lastRet) data = { type: 'Retirement', ...window._lastRet };
    else { showToast('Calculate first', '⚠️'); return }

    const users = getUsers();
    const user = users.find(u => u.email === session.email);
    if (user) {
        data.savedAt = Date.now();
        data.id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        if (!user.savedItems) user.savedItems = [];
        user.savedItems.unshift(data);
        if (user.savedItems.length > 50) user.savedItems = user.savedItems.slice(0, 50);
        saveUsers(users);
        showToast('Calculation saved! 💾');
    }
}

function deleteSavedItem(itemId) {
    const session = getSession();
    if (!session) return;
    const users = getUsers();
    const user = users.find(u => u.email === session.email);
    if (user && user.savedItems) {
        user.savedItems = user.savedItems.filter(i => i.id !== itemId);
        saveUsers(users);
        renderSavedItems();
        showToast('Item deleted');
    }
}

function renderSavedItems() {
    const container = document.getElementById('saved-items-list');
    if (!container) return;
    const session = getSession();
    if (!session) {
        container.innerHTML = '<div class="empty-state"><span class="es-icon">🔒</span><div class="es-text">Login to view saved items</div><div class="es-sub">Your calculations will appear here</div></div>';
        return;
    }
    const users = getUsers();
    const user = users.find(u => u.email === session.email);
    const items = user?.savedItems || [];
    if (items.length === 0) {
        container.innerHTML = '<div class="empty-state"><span class="es-icon">📂</span><div class="es-text">No saved calculations</div><div class="es-sub">Save your calculations from any tool to see them here</div></div>';
        return;
    }
    container.innerHTML = items.map(item => {
        const date = new Date(item.savedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        let detail = '';
        if (item.type === 'SIP') detail = `${fmt(item.amt)}/mo for ${item.yrs}yrs → ${fmt(item.fv)}`;
        else if (item.type === 'Lumpsum') detail = `${fmt(item.inv)} for ${item.yrs}yrs → ${fmt(item.fv)}`;
        else if (item.type === 'EMI') detail = `Loan ${fmt(item.P)} → EMI ${fmt(item.emi)}/mo`;
        else if (item.type === 'Goal') detail = `Target ${fmt(item.target)} → SIP ${fmt(item.sip)}/mo`;
        else if (item.type === 'Retirement') detail = `Corpus ${fmt(item.corpus)} → SIP ${fmt(item.sipNeeded)}/mo`;
        return `<div class="saved-item"><div class="si-info"><div class="si-type">${item.type} Calculator</div><div class="si-detail">${detail}</div><div class="si-date">${date}</div></div><div class="si-actions"><button class="si-del" onclick="deleteSavedItem('${item.id}')" title="Delete">🗑️</button></div></div>`;
    }).join('');
}

/* =================================================================
   AI INVESTMENT ASSISTANT — Powered by Google Gemini 2.0 Flash
   ================================================================= */
const GEMINI_KEY_STORE = 'rushi_gemini_api_key';
const GEMINI_MODEL = 'gemini-2.0-flash';
let aiChatHistory = [];

const AI_SYSTEM_PROMPT = `You are Rushi AI — a warm, sharp, and genuinely helpful financial advisor who happens to live inside the Rushi Finance Tools platform. You talk like a real person, not a chatbot. Think of yourself as that one smart friend everyone wishes they had — the one who actually understands money and explains it without making you feel stupid.

YOUR PERSONALITY:
- You're confident but never condescending. You make complex finance feel simple.
- You're supportive and lightly motivational — when someone sets a goal, you genuinely cheer them on without being over-the-top.
- You adapt your tone naturally: casual greeting → casual reply. Serious planning question → professional but still warm.
- You have opinions. If someone's plan has a flaw, you mention it tactfully. If a goal is ambitious, you acknowledge that honestly while still being encouraging.
- You sound like a real human advisor who cares, not a template engine spitting out formatted blocks.

HOW YOU RESPOND:

When the user gives you a clear goal with numbers:
1. React naturally first (acknowledge their goal with genuine warmth — vary your reactions, never use the same opening twice in a conversation)
2. Present the calculation results clearly but weave them into a sentence, not a sterile table
3. Explain what the numbers actually mean in real-life terms — is this doable? What does this assume? What's the risk level?
4. End with ONE helpful follow-up — either a suggestion, a related question, or point them to a relevant tool on the platform

When the user's message is vague or lacks numbers:
- NEVER say anything like "I need more specific numbers" or "I understood your query but..."
- Instead, respond warmly and ask a natural follow-up question:
  "Love that you're thinking about this! To give you a solid plan, I'd need a couple of things — roughly how much are you looking to accumulate, and what's your time horizon? Even a ballpark works."

When the user just greets you or makes small talk:
- Be human. Say hey back. Be brief and friendly. Then gently steer toward how you can help with their finances.

CALCULATIONS — ACCURACY IS NON-NEGOTIABLE:
- Use Indian rupees (₹) with Indian number formatting (lakhs, crores)
- SIP Future Value: FV = P × [((1+r)^n - 1) / r] where r = annual_rate/12, n = years×12
- Lumpsum: FV = P × (1+r)^n
- Goal (reverse SIP): SIP = Target × r / ((1+r)^n - 1)
- When showing multiple scenarios, use 3 tiers: Conservative (~8%), Moderate (~12%), Aggressive (~15%) — but present them conversationally, not as a rigid template
- For amounts: "1 crore" = ₹1,00,00,000, "50 lakh" = ₹50,00,000, "10K" = ₹10,000

EXPLANATION LAYER — THIS IS WHAT MAKES YOU PREMIUM:
- After giving numbers, briefly explain the risk level in plain language ("Conservative assumes debt-heavy funds — think of it as the safe floor, not your target")
- Clarify your assumptions naturally ("I'm assuming 12% here, which is roughly what a good diversified equity fund has returned over the last 15-20 years")
- When relevant, mention inflation impact, tax implications (Section 80C, LTCG), or the power of step-up SIPs
- Make it feel like advisory guidance, not calculator output

FORMATTING:
- Use **bold** for key numbers and important terms
- Use bullet points only when listing 3+ items — otherwise weave info into natural sentences
- Keep responses concise: 2-4 short paragraphs max. No walls of text.
- Use at most 1-2 emojis per response, and only when they add warmth (not every message needs them)

THINGS YOU MUST NEVER DO:
- Never start two consecutive responses the same way
- Never use phrases like: "I understood your query", "Here's the breakdown", "Let me calculate that for you", "Based on your input"
- Never produce rigid template blocks with identical structure every time
- Never give numbers without context or explanation
- Never ignore a greeting or conversational message
- Never sound like a FAQ page or a form-fill bot
- If the user asks something outside finance, gently redirect: "Ha, I wish I could help with that! But my sweet spot is money stuff — investments, SIPs, retirement, loans. Got anything on that front?"

SELF-CHECK BEFORE EVERY RESPONSE:
Ask yourself: "Would a real, experienced financial advisor text this to a friend?" If the answer is no, rewrite it until it sounds human.

Remember: you're not a calculator with a chat interface. You're a trusted advisor who happens to be really good at math.`;


function getGeminiKey() { return localStorage.getItem(GEMINI_KEY_STORE) || '' }
function setGeminiKey(key) { localStorage.setItem(GEMINI_KEY_STORE, key) }

function initAI() {
    const input = document.getElementById('ai-input');
    const sendBtn = document.getElementById('ai-send');
    if (!input || !sendBtn) return;
    sendBtn.addEventListener('click', () => processAI());
    input.addEventListener('keypress', e => { if (e.key === 'Enter') processAI() });
    // Suggestion clicks
    document.querySelectorAll('.ai-suggestion').forEach(btn => {
        btn.addEventListener('click', () => { input.value = btn.textContent; processAI() })
    });
    // Show API key status
    renderAPIKeyUI();
}

function renderAPIKeyUI() {
    const apiSetup = document.getElementById('ai-api-setup');
    if (!apiSetup) return;
    const key = getGeminiKey();
    if (key) {
        apiSetup.innerHTML = `<div class="api-status connected"><span class="api-dot green"></span> Gemini AI Connected <button class="api-change-btn" onclick="promptAPIKey()">Change Key</button></div>`;
    } else {
        apiSetup.innerHTML = `
            <div class="api-setup-card">
                <div class="api-setup-title">🔑 Connect Google Gemini AI (Free!)</div>
                <p class="api-setup-desc">Get a free API key from Google AI Studio to power the AI assistant with real intelligence.</p>
                <div class="api-setup-steps">
                    <div class="api-step"><span class="step-num">1</span> Go to <a href="https://aistudio.google.com/apikey" target="_blank" class="api-link">aistudio.google.com/apikey</a></div>
                    <div class="api-step"><span class="step-num">2</span> Click "Create API Key" (free, no billing needed)</div>
                    <div class="api-step"><span class="step-num">3</span> Copy and paste your key below</div>
                </div>
                <div class="api-key-input-row">
                    <input type="password" id="api-key-input" placeholder="Paste your Gemini API key here..." class="api-key-field">
                    <button class="btn btn-go api-save-btn" onclick="saveAPIKey()">Connect</button>
                </div>
                <p class="api-note">🔒 Your key is stored only in your browser's localStorage. Never sent anywhere except Google's API.</p>
            </div>`;
    }
}

function promptAPIKey() {
    const key = prompt('Enter your Gemini API key:', getGeminiKey());
    if (key !== null && key.trim()) {
        setGeminiKey(key.trim());
        renderAPIKeyUI();
        showToast('API key updated! ✅');
    }
}

function saveAPIKey() {
    const input = document.getElementById('api-key-input');
    if (!input) return;
    const key = input.value.trim();
    if (!key) { showToast('Please enter a valid API key', '⚠️'); return; }
    setGeminiKey(key);
    renderAPIKeyUI();
    showToast('Gemini AI connected! 🎉');
}

function escapeHtml(str) { return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') }

function markdownToHtml(md) {
    // Convert markdown-like response to HTML
    let html = md;
    // Bold: **text** → <strong>text</strong>
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Italic: *text* → <em>text</em>
    html = html.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
    // Bullet lists: * item or - item
    html = html.replace(/^[\*\-]\s+(.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/gs, match => '<ul>' + match + '</ul>');
    // Numbered lists: 1. item
    html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
    // Headers: ## text
    html = html.replace(/^###\s+(.+)$/gm, '<h4 style="margin:8px 0 4px;font-size:14px;font-weight:700">$1</h4>');
    html = html.replace(/^##\s+(.+)$/gm, '<h3 style="margin:10px 0 4px;font-size:15px;font-weight:700">$1</h3>');
    // Code blocks
    html = html.replace(/`([^`]+)`/g, '<code style="background:var(--bg-2);padding:1px 5px;border-radius:4px;font-size:12px">$1</code>');
    // Line breaks
    html = html.replace(/\n\n/g, '<br><br>');
    html = html.replace(/\n/g, '<br>');
    return html;
}

async function processAI() {
    const input = document.getElementById('ai-input');
    const messages = document.getElementById('ai-messages');
    if (!input || !messages) return;
    const text = input.value.trim();
    if (!text) return;

    const apiKey = getGeminiKey();
    if (!apiKey) {
        showToast('Please connect your Gemini API key first! 🔑', '⚠️');
        return;
    }

    // Add user message
    messages.innerHTML += `<div class="ai-msg user">${escapeHtml(text)}</div>`;
    input.value = '';
    input.disabled = true;
    document.getElementById('ai-send').disabled = true;

    // Add typing indicator
    const typingId = 'typing-' + Date.now();
    messages.innerHTML += `<div class="ai-msg bot typing-indicator" id="${typingId}"><span class="dot-pulse"></span> Rushi AI is thinking...</div>`;
    messages.scrollTop = messages.scrollHeight;

    // Build conversation history for context
    aiChatHistory.push({ role: 'user', parts: [{ text }] });
    // Keep only last 20 messages for context window
    if (aiChatHistory.length > 20) aiChatHistory = aiChatHistory.slice(-20);

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
        const body = {
            system_instruction: { parts: [{ text: AI_SYSTEM_PROMPT }] },
            contents: aiChatHistory,
            generationConfig: {
                temperature: 0.85,
                topP: 0.92,
                topK: 40,
                maxOutputTokens: 2048
            }
        };

        const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!resp.ok) {
            const errData = await resp.json().catch(() => ({}));
            const errMsg = errData?.error?.message || `API Error (${resp.status})`;
            throw new Error(errMsg);
        }

        const data = await resp.json();
        const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I couldn\'t generate a response. Please try again.';

        // Add to history
        aiChatHistory.push({ role: 'model', parts: [{ text: aiText }] });

        // Remove typing indicator and add response
        document.getElementById(typingId)?.remove();
        const responseHtml = markdownToHtml(aiText);
        messages.innerHTML += `<div class="ai-msg bot">${responseHtml}</div>`;
    } catch (err) {
        document.getElementById(typingId)?.remove();
        let errorMessage = `<span style="color:var(--red)">⚠️ Error: ${escapeHtml(err.message)}</span>`;
        if (err.message.includes('API key')) {
            errorMessage += `<br><br>Your API key may be invalid. <a onclick="promptAPIKey()" style="color:var(--green);cursor:pointer;text-decoration:underline">Update your API key</a>`;
        }
        messages.innerHTML += `<div class="ai-msg bot">${errorMessage}</div>`;
        // Remove failed message from history
        aiChatHistory.pop();
    }

    input.disabled = false;
    document.getElementById('ai-send').disabled = false;
    input.focus();
    messages.scrollTop = messages.scrollHeight;
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updateAuthUI();
    initAI();
    renderSavedItems();

    document.querySelectorAll('input[type="number"]').forEach(inp => {
        inp.addEventListener('input', () => { const eid = 'e-' + inp.id; clrV(inp.id, eid) });
        inp.addEventListener('keypress', e => { if (e.key === 'Enter') { const fn = inp.closest('.card')?.querySelector('.btn-go'); fn?.click() } })
    });
});
