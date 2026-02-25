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
   Premium Conversational Intelligence Engine
   ================================================================= */
const GEMINI_KEY_STORE = 'rushi_gemini_api_key';
const GEMINI_MODEL = 'gemini-2.5-flash-lite';
let aiChatHistory = [];
let aiTurnCount = 0;
let aiLastOpeners = [];
let aiTopicsDiscussed = [];

// Built-in demo key (obfuscated) — works out of the box for visitors
const _dk = () => {
    const p = ['QUl6YVN5RDR', 'YaE1nWEpZ', 'TVdZMDBiN0ww', 'SkZ4VmVHYXpu', 'ckxEamtn'];
    return atob(p.join(''));
};
function getDemoKey() { try { return _dk(); } catch (e) { return ''; } }

const AI_SYSTEM_PROMPT = `You are Rushi AI — a warm, sharp, and genuinely helpful financial advisor built into the Rushi Finance Tools platform. You talk like a real person — specifically, like that one brilliant friend who works in finance and always gives you straight, caring advice over coffee. NOT like a chatbot. NOT like a template engine.

═══════════════════════════════════
CORE IDENTITY & PERSONALITY
═══════════════════════════════════

You are:
- Confident but never condescending — you make complex finance feel like common sense
- Naturally warm — you care about the person, not just their numbers
- Occasionally witty — not forced humor, just natural lightness when appropriate
- Honest — if a plan has a flaw, you say so tactfully; if a goal is ambitious, you're upfront about it while being encouraging
- Opinionated (mildly) — you have genuine takes, like "step-up SIPs are underrated" or "most people underestimate inflation"
- Adaptive — casual greeting gets a casual reply; serious planning question gets professional warmth

You are NOT:
- A FAQ chatbot
- A template engine that formats the same response structure
- A corporate AI that says "I understand your query"
- A calculator that just spits numbers

═══════════════════════════════════
RESPONSE FRAMEWORK (Not a rigid template — a flexible guide)
═══════════════════════════════════

When the user shares a CLEAR GOAL WITH NUMBERS:

Step 1 — CONNECT (1-2 sentences max)
React to their actual goal, not to the fact that they asked you something. Show that you understand WHY this matters to them.

Step 2 — DELIVER (the math, woven into words)
Don't dump numbers in a table. Thread them into a natural narrative. Show the key result prominently, with secondary details supporting it.

Step 3 — EXPLAIN (the "so what?" layer)
This is what separates you from a calculator. Briefly explain:
  - What return rate you assumed and why it's reasonable
  - What this means in practical terms
  - Any risk the user should be aware of
  - One relevant insight (inflation, step-up benefit, tax angle, etc.)

Step 4 — ENGAGE (one follow-up)
End with ONE natural next step: a question, a suggestion, or a pointer to a relevant tool on the platform. Never end with "Let me know if you have questions!" — that's generic.

---

When the user message is VAGUE or LACKS NUMBERS:

❌ NEVER say: "I need more specific numbers", "Could you provide more details?", "I understood your query but..."
✅ INSTEAD, respond with warmth and specificity:

Example BAD response:
"I understood your query but need more specific numbers to calculate. Please provide the investment amount and duration."

Example GOOD response:
"That's a great goal to have! To map out a real plan for you, it'd help to know two things — roughly what amount you're targeting, and when do you need it by? Even a rough idea works, we can always fine-tune."

---

When the user GREETS you or makes small talk:

Be human. Match their energy. Keep it brief (2-3 sentences max). Then gently open the door to finances without being pushy.

Example: "Hey! Good to have you here. What's on your mind today — thinking about investments, planning something specific, or just curious about how money can work harder for you?"

---

When the user asks something OUTSIDE FINANCE:

Don't be robotic about redirecting. Be playful.
"Ha, I wish I knew the answer to that! My expertise is pretty much limited to making money grow and not letting inflation eat it. 😄 Got a financial question I can sink my teeth into?"

═══════════════════════════════════
CALCULATION ACCURACY — NON-NEGOTIABLE
═══════════════════════════════════

Always use Indian rupees (₹) with Indian number formatting.
- "1 crore" = ₹1,00,00,000
- "50 lakh" = ₹50,00,000
- "10K" = ₹10,000

Core formulas:
- SIP Future Value: FV = P × [((1+r)^n - 1) / r] × (1+r), where r = annual_rate/12, n = years×12
- Lumpsum: FV = P × (1+r)^n
- Reverse SIP (Goal): SIP = Target × r / ((1+r)^n - 1)
- EMI: EMI = P × r × (1+r)^n / ((1+r)^n - 1)

When showing scenarios, use 3 tiers but DON'T format them identically every time:
- Conservative (~8-9%): debt-heavy hybrid funds, lower risk
- Moderate (~11-12%): diversified equity, balanced risk
- Aggressive (~14-15%): small/mid cap, higher risk but higher potential

═══════════════════════════════════
THE EXPLANATION LAYER — YOUR DIFFERENTIATOR
═══════════════════════════════════

After presenting numbers, add real advisory value:

- Risk context: "Conservative here means mostly debt funds — safe floor, not your target"
- Assumption transparency: "I'm using 12% because that's what broad equity has delivered over 15-20 years, but markets don't move in straight lines"
- Inflation awareness: "₹1 crore in 20 years won't buy what ₹1 crore buys today — in real terms, it's closer to ₹30-35 lakhs"
- Tax angles: Mention Section 80C (ELSS), LTCG above ₹1.25L, indexation on debt funds — only when relevant, never as a checklist
- Step-up insight: "If you bump your SIP by just 10% each year, the end result changes dramatically"

═══════════════════════════════════
FORMATTING RULES
═══════════════════════════════════

- Use **bold** for key numbers and critical terms
- Bullet points ONLY for 3+ items — otherwise write naturally
- 2-4 short paragraphs max. No walls of text.
- Maximum 1-2 emojis per response. Many responses need zero emojis.
- Never center text. Never use ALL CAPS for emphasis.

═══════════════════════════════════
HARD RULES — VIOLATING THESE IS A FAILURE
═══════════════════════════════════

1. NEVER start two responses with the same phrase or structure
2. NEVER use these dead phrases: "I understood your query", "Here's the breakdown", "Let me calculate that for you", "Based on your input", "Great question!", "Absolutely!", "Sure thing!", "Here's what I found"
3. NEVER produce responses that look like they were filled into a template
4. NEVER give raw numbers without context about what they mean
5. NEVER ignore greetings or emotional context
6. NEVER end with generic "Let me know if you have any questions"
7. NEVER repeat the user's question back to them ("You want to invest 10,000 per month...")
8. NEVER list more than 3 scenarios — 3 is the max

═══════════════════════════════════
EXAMPLE RESPONSES — STUDY THESE CAREFULLY
═══════════════════════════════════

User: "I want 1 crore in 15 years"
GOOD: "A crore in 15 years — that's actually very achievable with the right discipline. At a moderate equity return of around 12%, you'd need to put away roughly **₹15,200/month** in a SIP. That's it. No lottery, no crypto, just steady investing.

For context, if you go more conservative (8%), you'd need about ₹22,000/month, and if you're comfortable with small-cap or aggressive funds (~15%), it drops to around ₹11,500/month. The sweet spot for most people is somewhere in the moderate range.

One thing worth thinking about — if you start at ₹15K and increase it by 10% each year (your salary probably grows more than that), you'd actually blow past ₹1 crore comfortably. Want me to run the step-up numbers?"

User: "hi"
GOOD: "Hey! 👋 What's cooking — got a financial goal in mind, or just exploring? I'm all ears either way."

User: "I want to invest money"
GOOD: "Love that you're thinking about investing — it's honestly the best financial decision you can make early on. To sketch out something meaningful for you, it'd help to know a couple of things: roughly how much you're looking to invest each month (or as a one-time amount), and do you have a specific goal or timeline in mind? Even a rough number helps me give you something actionable."

User: "Is SIP better or lumpsum?"
GOOD: "This one comes up a lot, and honestly — it depends on your situation more than on which is 'objectively better.'

**SIP wins** when you have regular income and want to build wealth steadily. The big advantage? Rupee cost averaging smooths out market volatility, so you don't need to worry about timing.

**Lumpsum wins** when you have a chunk sitting idle (like a bonus or inheritance) and markets aren't at an obvious peak. Historically, lumpsum invested early tends to give better returns simply because the money is working longer.

My take? Most people benefit from SIPs for discipline, with occasional lumpsum topups when they get windfalls. Are you deciding between the two right now, or more curious about the concept?"

═══════════════════════════════════
SELF-CHECK (RUN THIS BEFORE EVERY RESPONSE)
═══════════════════════════════════

Ask yourself:
1. "Would a real financial advisor text this to a friend?" — if no, rewrite it
2. "Does this sound like my LAST response?" — if yes, restructure it
3. "Am I giving advice or just outputting formatted data?" — if just data, add the why
4. "Is there a single sentence in here that sounds robotic?" — if yes, rephrase it
5. "Does this feel like a real conversation or a form submission?" — aim for conversation

You're not a calculator with a chat interface. You're a trusted advisor who happens to be exceptional at math.`;


function getGeminiKey() {
    return localStorage.getItem(GEMINI_KEY_STORE) || getDemoKey();
}
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
    const userKey = localStorage.getItem(GEMINI_KEY_STORE);
    const hasDemo = !!getDemoKey();
    if (userKey) {
        apiSetup.innerHTML = `<div class="api-status connected"><span class="api-dot green"></span> Gemini AI Connected (Your Key) <button class="api-change-btn" onclick="promptAPIKey()">Change Key</button> <button class="api-change-btn" onclick="resetToDemo()" style="margin-left:6px">Use Default</button></div>`;
    } else if (hasDemo) {
        apiSetup.innerHTML = `<div class="api-status connected"><span class="api-dot green"></span> Gemini AI Connected <button class="api-change-btn" onclick="showOwnKeySetup()">Use Your Own Key</button></div>`;
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

function resetToDemo() {
    localStorage.removeItem(GEMINI_KEY_STORE);
    renderAPIKeyUI();
    showToast('Switched to default AI key ✅');
}

function showOwnKeySetup() {
    const apiSetup = document.getElementById('ai-api-setup');
    if (!apiSetup) return;
    apiSetup.innerHTML = `
        <div class="api-setup-card">
            <div class="api-setup-title">🔑 Use Your Own Gemini API Key</div>
            <p class="api-setup-desc">For unlimited usage, connect your own free API key from Google AI Studio.</p>
            <div class="api-key-input-row">
                <input type="password" id="api-key-input" placeholder="Paste your Gemini API key here..." class="api-key-field">
                <button class="btn btn-go api-save-btn" onclick="saveAPIKey()">Connect</button>
            </div>
            <p class="api-note" style="margin-top:8px"><a onclick="resetToDemo()" style="color:var(--green);cursor:pointer;text-decoration:underline">← Back to default key</a></p>
        </div>`;
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
    let html = md;
    // Bold: **text** → <strong>text</strong>
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Italic: *text* → <em>text</em>
    html = html.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
    // Bullet lists: * item or - item
    html = html.replace(/^[\*\-]\s+(.+)$/gm, '<li>$1</li>');
    html = html.replace(/((<li>.*<\/li>\n?)+)/gs, match => '<ul>' + match + '</ul>');
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

// Detect the type of user message for dynamic context injection
function classifyUserMessage(text) {
    const lower = text.toLowerCase().trim();
    // Greeting
    if (/^(hi|hello|hey|howdy|namaste|yo|sup|good\s*(morning|afternoon|evening)|hii+)[\s!.,?]*$/i.test(lower)) return 'greeting';
    // Has specific numbers
    if (/\d/.test(lower) && /(lakh|crore|invest|sip|month|year|emi|loan|₹|rs|rupee|return|percent|%|save|target|goal|retire)/i.test(lower)) return 'goal_with_numbers';
    // Finance question without numbers
    if (/(sip|lumpsum|mutual fund|invest|stock|nifty|tax|elss|ppf|fd|nps|debt|equity|index|return|risk|inflation|retire|emi|loan|portfolio|save)/i.test(lower)) return 'finance_question';
    // General question
    return 'general';
}

// Build per-turn meta-instruction to enforce variety
function buildTurnContext(userText) {
    aiTurnCount++;
    const msgType = classifyUserMessage(userText);
    const parts = [];

    // Track topics
    if (msgType === 'goal_with_numbers' || msgType === 'finance_question') {
        aiTopicsDiscussed.push(userText.substring(0, 60));
        if (aiTopicsDiscussed.length > 10) aiTopicsDiscussed = aiTopicsDiscussed.slice(-10);
    }

    // add variety enforcement
    parts.push(`[TURN #${aiTurnCount} | Message type: ${msgType}]`);

    if (aiLastOpeners.length > 0) {
        parts.push(`Your last ${Math.min(aiLastOpeners.length, 3)} opening phrases were: ${aiLastOpeners.slice(-3).map(o => '"' + o + '"').join(', ')}. You MUST start this response differently — use a completely new sentence structure and opening word.`);
    }

    if (msgType === 'greeting') {
        parts.push('This is a casual greeting. Keep your response SHORT (2-3 sentences max). Be warm and natural. Gently invite them to share what they need help with.');
    } else if (msgType === 'goal_with_numbers') {
        parts.push('The user has shared a specific financial goal with numbers. Follow the CONNECT → DELIVER → EXPLAIN → ENGAGE framework from your system instructions, but make it feel natural, not templated.');
    } else if (msgType === 'finance_question') {
        parts.push('This is a financial question or concept without specific numbers. Give a clear, insightful answer. If you can make it more useful by asking for their specific numbers, do so naturally at the end.');
    } else {
        parts.push('This might be off-topic or very general. Handle it naturally per your system instructions.');
    }

    if (aiTurnCount > 2) {
        parts.push('IMPORTANT: Vary your response structure. If your last response used bullet points, this one should use flowing paragraphs. If you used a question to end last time, try ending with an insight or suggestion this time.');
    }

    return parts.join('\n');
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

    // Build dynamic context for this turn
    const turnContext = buildTurnContext(text);

    // The actual user message is wrapped with turn context as hidden instruction
    const enrichedUserMessage = `${text}\n\n---\n[SYSTEM CONTEXT — invisible to the user, for your internal use only]\n${turnContext}`;

    // Add to history (store original text for display, enriched for API)
    aiChatHistory.push({ role: 'user', parts: [{ text: enrichedUserMessage }] });
    // Keep only last 20 messages for context window
    if (aiChatHistory.length > 20) aiChatHistory = aiChatHistory.slice(-20);

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
        const body = {
            system_instruction: { parts: [{ text: AI_SYSTEM_PROMPT }] },
            contents: aiChatHistory,
            generationConfig: {
                temperature: 0.9,
                topP: 0.95,
                topK: 50,
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
        const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Hmm, something went wrong on my end. Could you try sending that again?';

        // Track the opening phrase to enforce variety
        const firstSentence = aiText.split(/[.!?\n]/)[0]?.trim() || '';
        aiLastOpeners.push(firstSentence.substring(0, 50));
        if (aiLastOpeners.length > 5) aiLastOpeners = aiLastOpeners.slice(-5);

        // Store clean version in history (without the enriched context)
        aiChatHistory[aiChatHistory.length - 1] = { role: 'user', parts: [{ text }] };
        aiChatHistory.push({ role: 'model', parts: [{ text: aiText }] });

        // Remove typing indicator and add response
        document.getElementById(typingId)?.remove();
        const responseHtml = markdownToHtml(aiText);
        messages.innerHTML += `<div class="ai-msg bot">${responseHtml}</div>`;
    } catch (err) {
        document.getElementById(typingId)?.remove();
        let errorMessage = `<span style="color:var(--red)">⚠️ ${escapeHtml(err.message)}</span>`;
        if (err.message.includes('API key') || err.message.includes('API_KEY')) {
            errorMessage += `<br><br>Your API key might be invalid or expired. <a onclick="promptAPIKey()" style="color:var(--green);cursor:pointer;text-decoration:underline">Update your API key</a>`;
        } else if (err.message.includes('quota') || err.message.includes('429')) {
            errorMessage += `<br><br>Looks like the API rate limit was hit. Wait a few seconds and try again.`;
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

/* =================================================================
   TAX CALCULATOR — Old vs New Regime (FY 2025-26)
   ================================================================= */
function calcTax() {
    const income = pNum('tax-income');
    if (!income || income <= 0) { showToast('Please enter a valid income', '⚠️'); return; }

    const ageGroup = document.getElementById('tax-age')?.value || 'general';
    const ded80c = Math.min(pNum('tax-80c') || 0, 150000);
    const ded80d = Math.min(pNum('tax-80d') || 0, ageGroup === 'general' ? 25000 : 50000);
    const dedHRA = pNum('tax-hra') || 0;
    const ded80ccd = Math.min(pNum('tax-80ccd') || 0, 50000);
    const dedOther = pNum('tax-other') || 0;
    const stdDed = parseInt(document.getElementById('tax-std')?.value || '75000');

    // Old regime calculation
    const totalDeductions = ded80c + ded80d + dedHRA + ded80ccd + dedOther + stdDed;
    const oldTaxable = Math.max(income - totalDeductions, 0);
    const oldTaxResult = calcOldRegimeTax(oldTaxable, ageGroup);

    // New regime calculation (FY 2025-26)
    const newStdDed = 75000; // Standard deduction in new regime
    const newTaxable = Math.max(income - newStdDed, 0);
    const newTaxResult = calcNewRegimeTax(newTaxable);

    // Display results
    document.getElementById('tax-results').style.display = 'block';
    document.getElementById('old-taxable').textContent = fmtINR(oldTaxable);
    document.getElementById('old-tax').textContent = fmtINR(oldTaxResult.total);
    document.getElementById('old-effective').textContent = income > 0 ? (oldTaxResult.total / income * 100).toFixed(1) + '%' : '0%';
    document.getElementById('new-taxable').textContent = fmtINR(newTaxable);
    document.getElementById('new-tax').textContent = fmtINR(newTaxResult.total);
    document.getElementById('new-effective').textContent = income > 0 ? (newTaxResult.total / income * 100).toFixed(1) + '%' : '0%';

    // Winner banner
    const savings = Math.abs(oldTaxResult.total - newTaxResult.total);
    const winnerBanner = document.getElementById('tax-winner-banner');
    if (oldTaxResult.total < newTaxResult.total) {
        winnerBanner.innerHTML = `🏆 <strong>Old Regime saves you ${fmtINR(savings)}</strong> — Go with Old Regime!`;
        winnerBanner.className = 'tax-winner-banner winner-old';
    } else if (newTaxResult.total < oldTaxResult.total) {
        winnerBanner.innerHTML = `🏆 <strong>New Regime saves you ${fmtINR(savings)}</strong> — Go with New Regime!`;
        winnerBanner.className = 'tax-winner-banner winner-new';
    } else {
        winnerBanner.innerHTML = `⚖️ <strong>Both regimes result in the same tax</strong>`;
        winnerBanner.className = 'tax-winner-banner winner-tie';
    }

    // Savings card
    const savingsCard = document.getElementById('tax-savings-card');
    const savingsText = document.getElementById('tax-savings-text');
    savingsText.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;text-align:center">
            <div><div style="font-size:13px;color:var(--text-2)">Your Deductions Used</div><div style="font-size:20px;font-weight:700;color:var(--green)">${fmtINR(totalDeductions)}</div></div>
            <div><div style="font-size:13px;color:var(--text-2)">Tax Saved vs No Deductions</div><div style="font-size:20px;font-weight:700;color:var(--green)">${fmtINR(Math.max(0, calcOldRegimeTax(Math.max(income - stdDed, 0), ageGroup).total - oldTaxResult.total))}</div></div>
        </div>`;

    // Slab breakdowns
    document.getElementById('old-slab-details').innerHTML = renderSlabBreakdown(oldTaxResult.slabs);
    document.getElementById('new-slab-details').innerHTML = renderSlabBreakdown(newTaxResult.slabs);

    // Chart
    createDoughnutChart('tax-chart', [oldTaxResult.total, newTaxResult.total], ['Old Regime Tax', 'New Regime Tax'], ['#f43f5e', '#3b82f6']);

    document.getElementById('tax-results').scrollIntoView({ behavior: 'smooth' });
}

function calcOldRegimeTax(taxable, ageGroup) {
    let slabs = [];
    let exemptLimit = 250000;
    if (ageGroup === 'senior') exemptLimit = 300000;
    if (ageGroup === 'supersenior') exemptLimit = 500000;

    const oldSlabs = [
        { min: 0, max: exemptLimit, rate: 0 },
        { min: exemptLimit, max: 500000, rate: 5 },
        { min: 500000, max: 1000000, rate: 20 },
        { min: 1000000, max: Infinity, rate: 30 }
    ];

    let tax = 0;
    for (const slab of oldSlabs) {
        if (taxable > slab.min) {
            const tier = Math.min(taxable, slab.max) - slab.min;
            const t = tier * slab.rate / 100;
            tax += t;
            if (slab.rate > 0 || tier > 0) {
                slabs.push({ range: `₹${fmtShort(slab.min)} - ${slab.max === Infinity ? 'Above' : '₹' + fmtShort(slab.max)}`, rate: slab.rate + '%', tax: fmtINR(t) });
            }
        }
    }

    // Rebate u/s 87A
    if (taxable <= 500000) tax = 0;

    const cess = tax * 0.04;
    return { base: tax, cess, total: Math.round(tax + cess), slabs };
}

function calcNewRegimeTax(taxable) {
    const newSlabs = [
        { min: 0, max: 400000, rate: 0 },
        { min: 400000, max: 800000, rate: 5 },
        { min: 800000, max: 1200000, rate: 10 },
        { min: 1200000, max: 1600000, rate: 15 },
        { min: 1600000, max: 2000000, rate: 20 },
        { min: 2000000, max: 2400000, rate: 25 },
        { min: 2400000, max: Infinity, rate: 30 }
    ];

    let tax = 0, slabs = [];
    for (const slab of newSlabs) {
        if (taxable > slab.min) {
            const tier = Math.min(taxable, slab.max) - slab.min;
            const t = tier * slab.rate / 100;
            tax += t;
            if (slab.rate > 0 || tier > 0) {
                slabs.push({ range: `₹${fmtShort(slab.min)} - ${slab.max === Infinity ? 'Above' : '₹' + fmtShort(slab.max)}`, rate: slab.rate + '%', tax: fmtINR(t) });
            }
        }
    }

    // Rebate u/s 87A (new regime — up to ₹12 lakh, marginal relief)
    if (taxable <= 1200000) tax = 0;

    const cess = tax * 0.04;
    return { base: tax, cess, total: Math.round(tax + cess), slabs };
}

function fmtShort(n) {
    if (n >= 10000000) return (n / 10000000).toFixed(1) + 'Cr';
    if (n >= 100000) return (n / 100000).toFixed(1) + 'L';
    if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
    return n.toString();
}

function renderSlabBreakdown(slabs) {
    if (!slabs.length) return '<div style="color:var(--text-2);font-size:13px">No tax applicable</div>';
    return slabs.map(s => `
        <div class="slab-row">
            <span class="slab-range">${s.range}</span>
            <span class="slab-rate">${s.rate}</span>
            <span class="slab-tax">${s.tax}</span>
        </div>`).join('');
}

function shareTax(method) {
    const old = document.getElementById('old-tax')?.textContent || '—';
    const nw = document.getElementById('new-tax')?.textContent || '—';
    const text = `💰 Income Tax Comparison\n🏛️ Old Regime: ${old}\n🆕 New Regime: ${nw}\n\nCalculated at: ${location.href}`;
    shareGeneric(method, text);
}

function exportTaxCSV() {
    const rows = [['Regime', 'Taxable Income', 'Total Tax', 'Effective Rate'],
    ['Old', document.getElementById('old-taxable')?.textContent, document.getElementById('old-tax')?.textContent, document.getElementById('old-effective')?.textContent],
    ['New', document.getElementById('new-taxable')?.textContent, document.getElementById('new-tax')?.textContent, document.getElementById('new-effective')?.textContent]
    ];
    downloadCSV(rows, 'tax_comparison.csv');
}

/* =================================================================
   FD / RD CALCULATOR
   ================================================================= */
let currentFDRDMode = 'fd';

function switchFDRD(mode) {
    currentFDRDMode = mode;
    document.getElementById('fd-form').style.display = mode === 'fd' ? 'block' : 'none';
    document.getElementById('rd-form').style.display = mode === 'rd' ? 'block' : 'none';
    document.getElementById('fd-tab').classList.toggle('active', mode === 'fd');
    document.getElementById('rd-tab').classList.toggle('active', mode === 'rd');
    document.getElementById('fdrd-results').style.display = 'none';
}

function calcFD() {
    const principal = pNum('fd-amount');
    const rate = parseFloat(document.getElementById('fd-rate')?.value);
    const years = parseFloat(document.getElementById('fd-tenure')?.value);
    const freq = parseInt(document.getElementById('fd-compound')?.value || '4');

    if (!principal || principal <= 0) { showToast('Enter a valid deposit amount', '⚠️'); return; }
    if (!rate || rate <= 0 || rate > 30) { showToast('Enter a valid interest rate', '⚠️'); return; }
    if (!years || years <= 0 || years > 30) { showToast('Enter a valid tenure', '⚠️'); return; }

    const r = rate / 100;
    const maturity = principal * Math.pow(1 + r / freq, freq * years);
    const interest = maturity - principal;
    const totalReturn = (interest / principal * 100).toFixed(1);
    const effectiveYield = (Math.pow(maturity / principal, 1 / years) - 1) * 100;

    showFDRDResults(principal, interest, maturity, totalReturn, effectiveYield, years, 'FD');
}

function calcRD() {
    const monthly = pNum('rd-amount');
    const rate = parseFloat(document.getElementById('rd-rate')?.value);
    const years = parseFloat(document.getElementById('rd-tenure')?.value);

    if (!monthly || monthly <= 0) { showToast('Enter a valid monthly amount', '⚠️'); return; }
    if (!rate || rate <= 0 || rate > 30) { showToast('Enter a valid interest rate', '⚠️'); return; }
    if (!years || years <= 0 || years > 30) { showToast('Enter a valid tenure', '⚠️'); return; }

    const n = years * 4; // quarterly compounding
    const r = rate / 400; // quarterly rate
    const totalMonths = years * 12;
    const totalInvested = monthly * totalMonths;

    // RD maturity formula (quarterly compounding)
    let maturity = 0;
    for (let i = 0; i < totalMonths; i++) {
        const monthsRemaining = totalMonths - i;
        const quartersRemaining = monthsRemaining / 3;
        maturity += monthly * Math.pow(1 + r, quartersRemaining);
    }

    const interest = maturity - totalInvested;
    const totalReturn = (interest / totalInvested * 100).toFixed(1);
    const effectiveYield = totalInvested > 0 ? (Math.pow(maturity / totalInvested, 1 / years) - 1) * 100 : 0;

    showFDRDResults(totalInvested, interest, maturity, totalReturn, effectiveYield, years, 'RD');
}

function showFDRDResults(invested, interest, maturity, returnPct, effectYield, years, type) {
    const results = document.getElementById('fdrd-results');
    results.style.display = 'block';
    document.getElementById('fdrd-result-title').textContent = `📊 ${type} Returns`;
    document.getElementById('fdrd-label-invested').textContent = type === 'FD' ? 'Deposit Amount' : 'Total Invested';
    document.getElementById('fdrd-invested').textContent = fmtINR(Math.round(invested));
    document.getElementById('fdrd-interest').textContent = fmtINR(Math.round(interest));
    document.getElementById('fdrd-maturity').textContent = fmtINR(Math.round(maturity));
    document.getElementById('fdrd-return-pct').textContent = returnPct + '%';
    document.getElementById('fdrd-effective-yield').textContent = effectYield.toFixed(2) + '% p.a.';

    // Doughnut chart
    createDoughnutChart('fdrd-doughnut-chart', [Math.round(invested), Math.round(interest)],
        [type === 'FD' ? 'Deposit' : 'Invested', 'Interest Earned'], ['#3b82f6', '#00c897']);

    // Line chart — growth over years
    const labels = [];
    const values = [];
    for (let y = 0; y <= years; y++) {
        labels.push('Year ' + y);
        if (type === 'FD') {
            const freq = parseInt(document.getElementById('fd-compound')?.value || '4');
            const rate = parseFloat(document.getElementById('fd-rate')?.value) / 100;
            values.push(Math.round(invested * Math.pow(1 + rate / freq, freq * y)));
        } else {
            const monthly = pNum('rd-amount');
            const rate = parseFloat(document.getElementById('rd-rate')?.value);
            const r = rate / 400;
            const months = y * 12;
            let val = 0;
            for (let i = 0; i < months; i++) {
                val += monthly * Math.pow(1 + r, (months - i) / 3);
            }
            values.push(Math.round(val));
        }
    }
    createLineChart('fdrd-line-chart', labels, values, `${type} Growth`);

    results.scrollIntoView({ behavior: 'smooth' });
}

function shareFDRD(method) {
    const inv = document.getElementById('fdrd-invested')?.textContent || '—';
    const mat = document.getElementById('fdrd-maturity')?.textContent || '—';
    const int = document.getElementById('fdrd-interest')?.textContent || '—';
    const type = currentFDRDMode.toUpperCase();
    const text = `🏦 ${type} Calculation\n💰 Invested: ${inv}\n📈 Interest: ${int}\n🎯 Maturity: ${mat}\n\nCalculated at: ${location.href}`;
    shareGeneric(method, text);
}

function exportFDRDCSV() {
    const rows = [['Metric', 'Value'],
    ['Type', currentFDRDMode.toUpperCase()],
    ['Invested', document.getElementById('fdrd-invested')?.textContent],
    ['Interest', document.getElementById('fdrd-interest')?.textContent],
    ['Maturity', document.getElementById('fdrd-maturity')?.textContent],
    ['Return %', document.getElementById('fdrd-return-pct')?.textContent]
    ];
    downloadCSV(rows, `${currentFDRDMode}_calculation.csv`);
}

function shareGeneric(method, text) {
    const url = encodeURIComponent(location.href);
    const enc = encodeURIComponent(text);
    if (method === 'whatsapp') window.open(`https://wa.me/?text=${enc}`);
    else if (method === 'twitter') window.open(`https://twitter.com/intent/tweet?text=${enc}`);
    else if (method === 'copy') { navigator.clipboard?.writeText(text); showToast('Copied! 📋'); }
}

function downloadCSV(rows, filename) {
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    showToast('CSV downloaded! 📊');
}

/* =================================================================
   PWA — Service Worker + Install Prompt
   ================================================================= */
let deferredInstallPrompt = null;

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('SW registered:', reg.scope))
            .catch(err => console.warn('SW registration failed:', err));
    }
}

window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredInstallPrompt = e;
    showInstallBanner();
});

function showInstallBanner() {
    if (document.getElementById('pwa-install-banner')) return;
    const banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.className = 'pwa-install-banner';
    banner.innerHTML = `
        <div class="pwa-install-inner">
            <span class="pwa-icon">📲</span>
            <div class="pwa-text">
                <strong>Install Rushi Finance</strong>
                <span>Add to home screen for quick access</span>
            </div>
            <button class="pwa-install-btn" onclick="installPWA()">Install</button>
            <button class="pwa-dismiss-btn" onclick="this.parentElement.parentElement.remove()">✕</button>
        </div>`;
    document.body.appendChild(banner);
    setTimeout(() => banner.classList.add('show'), 100);
}

async function installPWA() {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    const choice = await deferredInstallPrompt.userChoice;
    if (choice.outcome === 'accepted') showToast('App installed! 🎉');
    deferredInstallPrompt = null;
    document.getElementById('pwa-install-banner')?.remove();
}

/* =================================================================
   ANIMATED LANDING PAGE — Scroll Reveal + Animated Counters
   ================================================================= */
function initLandingAnimations() {
    // Only run on index/home page
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // Staggered hero animation
    hero.classList.add('hero-animated');

    // Scroll reveal for tool cards
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                entry.target.style.transitionDelay = (idx * 0.08) + 's';
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.tool-card').forEach(card => {
        card.classList.add('reveal-item');
        observer.observe(card);
    });

    // Animate counter numbers
    document.querySelectorAll('.stat-num').forEach(el => {
        const text = el.textContent.trim();
        const numMatch = text.match(/(\d+)/);
        if (numMatch) {
            const target = parseInt(numMatch[1]);
            const suffix = text.replace(numMatch[1], '');
            animateCounter(el, target, suffix);
        }
    });
}

function animateCounter(el, target, suffix) {
    let current = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = Math.floor(current) + suffix;
    }, 16);
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updateAuthUI();
    initAI();
    renderSavedItems();
    initLandingAnimations();
    registerServiceWorker();

    // Format new calc inputs
    ['tax-income', 'tax-80c', 'tax-80d', 'tax-hra', 'tax-80ccd', 'tax-other', 'fd-amount', 'rd-amount'].forEach(id => {
        const inp = document.getElementById(id);
        if (inp) inp.addEventListener('input', () => { inp.value = fmtInput(inp.value); });
    });

    document.querySelectorAll('input[type="number"]').forEach(inp => {
        inp.addEventListener('input', () => { const eid = 'e-' + inp.id; clrV(inp.id, eid) });
        inp.addEventListener('keypress', e => { if (e.key === 'Enter') { const fn = inp.closest('.card')?.querySelector('.btn-go'); fn?.click() } })
    });
});
