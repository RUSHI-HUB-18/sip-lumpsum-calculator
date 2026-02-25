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
function vld(id, eid) { const i = document.getElementById(id), e = document.getElementById(eid), v = parseFloat(i.value); if (i.value.trim() === '' || isNaN(v)) { i.classList.add('err'); e.textContent = 'Enter a valid number'; e.classList.add('show'); return false } if (v <= 0) { i.classList.add('err'); e.textContent = 'Must be greater than 0'; e.classList.add('show'); return false } i.classList.remove('err'); e.classList.remove('show'); return true }
function clrV(id, eid) { document.getElementById(id)?.classList.remove('err'); document.getElementById(eid)?.classList.remove('show') }

/* ===== CHARTS ===== */
let charts = {};
function getColors() { return isDark() ? { g: '#00d4a0', b: '#7c86ff', r: '#ff6b6b', a: '#fbbf24', p: '#a78bfa', c: '#22d3ee', grid: 'rgba(255,255,255,0.06)', txt: '#9299b4' } : { g: '#00b386', b: '#5b6cff', r: '#eb5757', a: '#f5a623', p: '#8b5cf6', c: '#06b6d4', grid: 'rgba(0,0,0,0.06)', txt: '#8c92a8' } }

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
function showRes(id) { const el = document.getElementById(id); el.classList.remove('show'); void el.offsetWidth; el.classList.add('show') }

/* ===== SIP CALCULATOR ===== */
function calcSIP() {
    const f = [['sip-amt', 'e-sip-amt'], ['sip-rate', 'e-sip-rate'], ['sip-yrs', 'e-sip-yrs']];
    let ok = true; f.forEach(([i, e]) => { if (!vld(i, e)) ok = false }); if (!ok) return;
    const amt = parseFloat(document.getElementById('sip-amt').value);
    const rate = parseFloat(document.getElementById('sip-rate').value) / 100;
    const yrs = parseFloat(document.getElementById('sip-yrs').value);
    const su = parseFloat(document.getElementById('sip-su')?.value || 0) / 100;
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
    window._lastSIP = { inv, fv, profit, pct, yrs, amt, rate: rate * 100, su: su * 100 }; showRes('sip-res')
}
function rstSIP() { ['sip-amt', 'sip-rate', 'sip-yrs', 'sip-su'].forEach(id => { const e = document.getElementById(id); if (e) { e.value = id === 'sip-su' ? '0' : ''; e.classList.remove('err') } });['e-sip-amt', 'e-sip-rate', 'e-sip-yrs'].forEach(id => document.getElementById(id)?.classList.remove('show')); document.getElementById('sip-res')?.classList.remove('show') }

/* ===== LUMPSUM CALCULATOR ===== */
function calcLS() {
    const f = [['ls-amt', 'e-ls-amt'], ['ls-rate', 'e-ls-rate'], ['ls-yrs', 'e-ls-yrs']];
    let ok = true; f.forEach(([i, e]) => { if (!vld(i, e)) ok = false }); if (!ok) return;
    const amt = parseFloat(document.getElementById('ls-amt').value);
    const rate = parseFloat(document.getElementById('ls-rate').value) / 100;
    const yrs = parseFloat(document.getElementById('ls-yrs').value);
    const fv = amt * Math.pow(1 + rate, yrs), profit = fv - amt, pct = ((profit / amt) * 100).toFixed(1);
    const yearly = []; for (let y = 1; y <= yrs; y++)yearly.push({ inv: amt, fv: Math.round(amt * Math.pow(1 + rate, y)) });
    document.getElementById('r-ls-inv').textContent = fmt(amt);
    document.getElementById('r-ls-fv').textContent = fmt(fv);
    document.getElementById('r-ls-pr').textContent = fmt(profit);
    document.getElementById('r-ls-pct').textContent = '+' + pct + '%';
    const c = getColors();
    mkDoughnut('ch-ls-d', ['Invested', 'Returns'], [amt, profit], [c.g, c.b]);
    mkLine('ch-ls-l', yearly.map((_, i) => 'Yr ' + (i + 1)), [{ label: 'Invested', data: yearly.map(() => amt), borderColor: c.g, backgroundColor: c.g + '20', fill: true }, { label: 'Value', data: yearly.map(y => y.fv), borderColor: c.b, backgroundColor: c.b + '20', fill: true }]);
    window._lastLS = { inv: amt, fv, profit, pct, yrs, rate: rate * 100 }; showRes('ls-res')
}
function rstLS() { ['ls-amt', 'ls-rate', 'ls-yrs'].forEach(id => { const e = document.getElementById(id); if (e) { e.value = ''; e.classList.remove('err') } });['e-ls-amt', 'e-ls-rate', 'e-ls-yrs'].forEach(id => document.getElementById(id)?.classList.remove('show')); document.getElementById('ls-res')?.classList.remove('show') }

/* ===== EMI CALCULATOR ===== */
function calcEMI() {
    const f = [['emi-amt', 'e-emi-amt'], ['emi-rate', 'e-emi-rate'], ['emi-yrs', 'e-emi-yrs']];
    let ok = true; f.forEach(([i, e]) => { if (!vld(i, e)) ok = false }); if (!ok) return;
    const P = parseFloat(document.getElementById('emi-amt').value);
    const r = parseFloat(document.getElementById('emi-rate').value) / 100 / 12;
    const n = parseFloat(document.getElementById('emi-yrs').value) * 12;
    const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const total = emi * n, interest = total - P, pPct = ((P / total) * 100).toFixed(1);
    // Year-by-year balance
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

/* ===== GOAL CALCULATOR ===== */
function calcGoal() {
    const f = [['goal-amt', 'e-goal-amt'], ['goal-rate', 'e-goal-rate'], ['goal-yrs', 'e-goal-yrs']];
    let ok = true; f.forEach(([i, e]) => { if (!vld(i, e)) ok = false }); if (!ok) return;
    const target = parseFloat(document.getElementById('goal-amt').value);
    const rate = parseFloat(document.getElementById('goal-rate').value) / 100;
    const yrs = parseFloat(document.getElementById('goal-yrs').value);
    const mr = rate / 12, n = yrs * 12;
    const sip = target * mr / (Math.pow(1 + mr, n) - 1);
    const lumpsum = target / Math.pow(1 + rate, yrs);
    const sipTotal = sip * n, sipReturns = target - sipTotal;
    const lsReturns = target - lumpsum;
    document.getElementById('r-goal-sip').textContent = fmt(sip) + '/mo';
    document.getElementById('r-goal-ls').textContent = fmt(lumpsum);
    document.getElementById('r-goal-inv').textContent = fmt(sipTotal);
    document.getElementById('r-goal-ret').textContent = fmt(sipReturns);
    const c = getColors();
    mkDoughnut('ch-goal-d', ['You Invest', 'Market Returns'], [sipTotal, sipReturns], [c.g, c.b]);
    const yearly = []; let acc = 0, cur = sip; for (let y = 1; y <= yrs; y++) { for (let m = 0; m < 12; m++)acc += cur * Math.pow(1 + mr, (yrs - y + 1) * 12 - m + (12 - m)); yearly.push(Math.round(target * y / yrs)) }
    // Simpler: just show linear target vs SIP growth
    const sipYearly = []; let sv = 0; cur = sip; for (let y = 0; y < yrs; y++) { for (let m = 0; m < 12; m++) { sv += cur * Math.pow(1 + mr, (yrs - y) * 12 - m) } sipYearly.push(Math.round(sv)); sv = 0; cur = sip }
    // Recalculate properly
    const growthData = []; let cumFV = 0, cumInv = 0; cur = sip;
    for (let y = 0; y < yrs; y++) { for (let m = 0; m < 12; m++) { cumFV += cur * Math.pow(1 + mr, (yrs - y) * 12 - m); cumInv += cur } growthData.push({ fv: Math.round(cumFV), inv: Math.round(cumInv) }) }
    mkLine('ch-goal-l', growthData.map((_, i) => 'Yr ' + (i + 1)), [{ label: 'SIP Growth', data: growthData.map(g => g.fv), borderColor: c.g, backgroundColor: c.g + '20', fill: true }, { label: 'Target', data: growthData.map(() => target), borderColor: c.a, borderDash: [5, 5], backgroundColor: 'transparent', fill: false }]);
    window._lastGoal = { sip, lumpsum, target, yrs, rate: rate * 100 }; showRes('goal-res')
}
function rstGoal() { ['goal-amt', 'goal-rate', 'goal-yrs'].forEach(id => { const e = document.getElementById(id); if (e) { e.value = ''; e.classList.remove('err') } });['e-goal-amt', 'e-goal-rate', 'e-goal-yrs'].forEach(id => document.getElementById(id)?.classList.remove('show')); document.getElementById('goal-res')?.classList.remove('show') }

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
    // Corpus needed (present value of annuity at retirement, adjusted for inflation during retirement)
    const realRate = (rate - inf) / (1 + inf);
    let corpus = 0;
    if (realRate > 0) { corpus = futureAnnualExp * (1 - Math.pow(1 + realRate, -yrsInRetire)) / realRate }
    else { corpus = futureAnnualExp * yrsInRetire }
    // SIP needed
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
function copyLink() { navigator.clipboard?.writeText(location.href).then(() => alert('Link copied!')).catch(() => { }) }

/* ===== EXPORT CSV ===== */
function exportCSV(type) {
    let csv = '', fname = '';
    if (type === 'sip' && window._lastSIP) { const d = window._lastSIP; csv = 'Metric,Value\nMonthly SIP,' + d.amt + '\nReturn Rate,' + d.rate + '%\nDuration,' + d.yrs + ' years\nStep-up,' + d.su + '%\nTotal Invested,' + Math.round(d.inv) + '\nFuture Value,' + Math.round(d.fv) + '\nProfit,' + Math.round(d.profit) + '\nProfit %,' + d.pct + '%'; fname = 'SIP_Report.csv' }
    else if (type === 'ls' && window._lastLS) { const d = window._lastLS; csv = 'Metric,Value\nInvestment,' + Math.round(d.inv) + '\nReturn Rate,' + d.rate + '%\nDuration,' + d.yrs + ' years\nFuture Value,' + Math.round(d.fv) + '\nProfit,' + Math.round(d.profit) + '\nProfit %,' + d.pct + '%'; fname = 'Lumpsum_Report.csv' }
    else if (type === 'emi' && window._lastEMI) { const d = window._lastEMI; csv = 'Metric,Value\nLoan Amount,' + Math.round(d.P) + '\nRate,' + d.rate.toFixed(1) + '%\nTenure,' + d.yrs + ' years\nMonthly EMI,' + Math.round(d.emi) + '\nTotal Interest,' + Math.round(d.interest) + '\nTotal Payment,' + Math.round(d.total); fname = 'EMI_Report.csv' }
    else return;
    const blob = new Blob([csv], { type: 'text/csv' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = fname; a.click()
}

function exportPDF() { window.print() }

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    document.querySelectorAll('input[type="number"]').forEach(inp => {
        inp.addEventListener('input', () => { const eid = 'e-' + inp.id; clrV(inp.id, eid) });
        inp.addEventListener('keypress', e => { if (e.key === 'Enter') { const fn = inp.closest('.card')?.querySelector('.btn-go'); fn?.click() } })
    })
})
