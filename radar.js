/* Radar de Mercado — cockpit da manhã */
(function () {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const STEEL = {
    id: 'aco',
    name: 'Aço',
    title: 'Aço — Pressão de custo em alta',
    move: '+3,7%',
    confidence: 'Alta',
    exposure: 'R$ 1,9 mi',
    contracts: '2',
    plants: '3',
    statusLabel: 'Alta atenção',
    priceUsd: 1248,
    priceBrl: 6415,
    fx: 5.14,
    chart: [1205, 1208, 1212, 1215, 1218, 1222, 1225, 1228, 1232, 1235, 1238, 1240, 1242, 1245, 1248],
    chartLabels: ['30/ago', '', '', '03/set', '', '', '06/set', '', '09/set', '', '12/set', '', '15/set', '17/set', '20/set'],
    chartAnnotations: [
      { i: 8, label: 'Baosteel ↑', sub: '+US$ 30/t lista' },
      { i: 11, label: 'Minério ↑', sub: 'Reposição China' },
    ],
    news: [
      {
        date: '11 set', impact: 'alta', impactLabel: 'Pressão de alta', source: 'IndexBox / BigMint',
        title: 'Baosteel eleva HRC em +200 CNY/t (~US$ 30/t) para outubro',
        why: 'Sinal de firmeza de preço na Ásia — produtores empurram a lista para cima.',
        url: 'https://www.indexbox.io/pt-br/blog/baosteel-raises-hot-rolled-coil-prices-by-30t-for-october-deliveries/',
      },
      {
        date: '08 set', impact: 'alta', impactLabel: 'Pressão de alta', source: 'IndexBox / BigMint',
        title: 'ArcelorMittal sobe HRC na Europa em +€20/t (entregas nov/26)',
        why: 'Ajuste de lista europeia reforça o viés de alta no HRC global.',
        url: 'https://www.indexbox.io/pt-br/blog/arcelormittal-raises-hrc-prices-by-eur20t-for-november-2026/',
      },
      {
        date: '17 set', impact: 'alta', impactLabel: 'Pressão de alta', source: 'Reuters / UOL',
        title: 'Minério sobe com reposição de estoques na China antes do feriado',
        why: 'Custo de matéria-prima dá suporte ao aço no curto prazo.',
        url: 'https://economia.uol.com.br/noticias/reuters/2026/09/17/minerio-de-ferro-sobe-com-reposicao-de-estoques-na-china-antes-de-feriado-nacional.htm',
      },
      {
        date: '18 set', impact: 'misto', impactLabel: 'Misto', source: 'Valor',
        title: 'Minério +0,70% em Dalian; demanda ainda frágil no médio prazo',
        why: 'Suporte de curto prazo, com cautela sobre a margem das usinas.',
        url: 'https://valor.globo.com/empresas/noticia/2026/09/18/minrio-de-ferro-avana-070-pontos-percentuais-na-bolsa-de-dalian.ghtml',
      },
      {
        date: '11 set', impact: 'ctx', impactLabel: 'Contexto BR', source: 'ADVFN',
        title: 'China dita rumos de Vale e siderúrgicas; minério perto de US$ 99/t',
        why: 'Mostra como o mercado externo chega ao custo de aço no Brasil.',
        url: 'https://br.advfn.com/jornal/2026/09/economia-investimentos-china-acao-vale-csn-mineracao-siderurgicas',
      },
    ],
    impacts: [
      { rank: 1, score: 92, priority: 'crit', name: 'Contrato A-14 · Planta Central', volume: '420 t', coverage: '18 dias', window: '0–7 dias', openPct: '62%', money: 'R$ 880 mil', reason: 'Maior volume aberto e reajuste sensível ao HRC', action: 'Revisar preço e antecipar 30% de outubro' },
      { rank: 2, score: 84, priority: 'crit', name: 'Contrato B-07 · Planta Sul', volume: '310 t', coverage: '9 dias', window: 'Hoje', openPct: '71%', money: 'R$ 540 mil', reason: 'Cobertura abaixo da política de 15 dias', action: 'Negociar cobertura adicional nesta semana' },
      { rank: 3, score: 71, priority: 'attn', name: 'Linha Utility · margem', volume: '185 t equiv.', coverage: '12 dias', window: '8–14 dias', openPct: '45%', money: 'R$ 320 mil', reason: 'Margem apertada, sensível a +3,7% no mês', action: 'Avaliar proteção parcial de margem' },
      { rank: 4, score: 48, priority: 'med', name: 'Planta Central · estoque operacional', volume: '210 t', coverage: '22 dias', window: '15–21 dias', openPct: '28%', money: 'R$ 160 mil', reason: 'Dentro da faixa, sob pressão se a alta persistir', action: 'Monitorar, sem compra emergencial' },
    ],
    kpis: [
      { lab: 'Exposição total', val: 'R$ 1,9 mi', hint: 'Volume aberto × variação', tone: 'hot' },
      { lab: 'Cobertura média', val: '14 dias', hint: 'Abaixo da meta de 20 dias', tone: 'warn' },
      { lab: 'Volume a decidir', val: '730 t', hint: 'Janela crítica · 10 dias', tone: 'warn' },
      { lab: 'Sem proteção', val: '58%', hint: 'Preço aberto ou indexado', tone: 'hot' },
      { lab: 'Impacto se +5%', val: '+R$ 960 mil', hint: 'Cenário ilustrativo', tone: '' },
    ],
  };

  const WATCH = {
    cambio: {
      tone: 'attn', pill: 'attn', pillLabel: 'Atenção',
      title: 'Câmbio — USD/BRL sob pressão',
      move: '+3,1%',
      verdict: 'Cabe na pauta de tesouraria em 48 horas. A reunião de compras continua no aço.',
      meta: ['Confiança alta', '5 dias', 'Dono · Tesouraria / Compras', 'Prazo · 48h'],
      changed: [
        'USD/BRL avançou 3,1% na semana.',
        'A volatilidade do dia ficou acima da média de 30 dias.',
        'A Linha Premium importa componente e sente o spot.',
      ],
      impacts: [
        { name: 'Linha Premium', meta: 'Componentes importados', money: 'R$ 780 mil' },
        { name: 'Posições abertas', meta: 'Hedge parcial · 40%', money: 'R$ 310 mil' },
      ],
      actions: [
        'Revisar posições abertas de câmbio.',
        'Avaliar hedge adicional da Linha Premium.',
        'Alinhar com Controladoria antes do fechamento.',
      ],
    },
    frete: {
      tone: 'warn', pill: 'attn', pillLabel: 'Operacional',
      title: 'Frete — Atraso na rota Santos → Sul',
      move: 'Lead time +12%',
      verdict: 'Quatro embarques com cobertura de 9 dias. Logística olha hoje. O alarme de custo segue no aço.',
      meta: ['Confiança média', '4 dias', 'Dono · Logística / PCP', 'Prazo · Hoje'],
      changed: [
        'O lead time da rota Santos → Sul subiu 12%.',
        'O congestionamento no porto persiste.',
        'A cobertura de estoque da Planta Sul caiu para 9 dias.',
      ],
      impacts: [
        { name: 'Embarque F-21', meta: 'ETA +3 dias', money: 'R$ 180 mil' },
        { name: 'Embarque F-22', meta: 'ETA +4 dias', money: 'R$ 160 mil' },
        { name: 'Embarque F-24', meta: 'Risco de falta · Planta Sul', money: 'R$ 150 mil' },
        { name: 'Embarque F-27', meta: 'Alternativa terrestre', money: 'R$ 130 mil' },
      ],
      actions: [
        'Revisar a rota terrestre alternativa.',
        'Priorizar os embarques F-21 e F-24.',
        'Alinhar a janela de recebimento com o PCP.',
      ],
    },
    energia: {
      tone: 'ok', pill: 'ok', pillLabel: 'Na faixa',
      title: 'Energia — Movimento dentro da banda',
      move: '+1,2%',
      verdict: 'O preço andou, mas ficou dentro do intervalo do contrato. Nenhuma cláusula de reajuste foi acionada.',
      meta: ['Confiança média', '3 dias', 'Dono · Facilities', 'Sem prazo'],
      changed: [
        'Energia +1,2% no período.',
        'A banda contratada da Planta Norte é de ±3%.',
        'Não há revisão de contrato nesta semana.',
      ],
      impacts: [
        { name: 'Planta Norte', meta: 'Contrato indexado · banda ±3%', money: 'R$ 180 mil' },
      ],
      actions: ['Manter o monitoramento semanal.'],
    },
    semi: {
      tone: 'ok', pill: 'keep', pillLabel: 'Monitorar',
      title: 'Semicondutores — Alta leve',
      move: '+0,4%',
      verdict: 'O movimento é pequeno e o lead time está estável. O estoque cobre 45 dias.',
      meta: ['Confiança média', '2 dias', 'Dono · Compras indiretos', 'Prazo · Semanal'],
      changed: [
        'Leve alta em componentes críticos.',
        'Lead time sem mudança relevante.',
      ],
      impacts: [
        { name: 'Eletrônica embarcada', meta: 'Estoque de 45 dias', money: 'R$ 95 mil' },
      ],
      actions: ['Manter a leitura semanal. Sem compra antecipada.'],
    },
    regulacao: {
      tone: 'ok', pill: 'ok', pillLabel: 'Estável',
      title: 'Regulação — Sem mudança material',
      move: '0%',
      verdict: 'Nada relevante nas últimas 72 horas no escopo acompanhado.',
      meta: ['Confiança alta', '72 horas', 'Dono · Jurídico', 'Sem prazo'],
      changed: ['Nenhuma alteração regulatória no recorte de ANP e meio ambiente.'],
      impacts: [
        { name: 'Escopo monitorado', meta: 'ANP e ambiental', money: '—' },
      ],
      actions: ['Sem ação nesta manhã.'],
    },
    demanda: {
      tone: 'attn', pill: 'keep', pillLabel: 'Monitorar',
      title: 'Demanda — Recuo na Região Sul',
      move: '−2,1%',
      verdict: 'O recuo pede revisão de forecast. Não pede compra emergencial de aço.',
      meta: ['Confiança alta', '10 dias', 'Dono · Comercial / PCP', 'Prazo · Esta semana'],
      changed: [
        'Demanda da Região Sul −2,1%.',
        'A Linha Utility concentra a elasticidade.',
      ],
      impacts: [
        { name: 'Região Sul', meta: 'Pipeline de 30 dias', money: 'R$ 350 mil' },
      ],
      actions: [
        'Revisar o forecast comercial do Sul.',
        'Alinhar a produção da Linha Utility.',
      ],
    },
    concorrencia: {
      tone: 'ok', pill: 'keep', pillLabel: 'Monitorar',
      title: 'Concorrência — Dois movimentos',
      move: '2 sinais',
      verdict: 'Entram no briefing comercial. Esta leitura não traz exposição em reais.',
      meta: ['Confiança média', '7 dias', 'Dono · Estratégia', 'Prazo · Semanal'],
      changed: [
        'Um concorrente anunciou capacidade nova.',
        'Outro reduziu o lead time comercial.',
      ],
      impacts: [
        { name: 'Share da Linha Utility', meta: 'Leitura qualitativa', money: '—' },
      ],
      actions: ['Incluir os dois movimentos no briefing comercial.'],
    },
  };

  let page = 'home';

  function setMenu(open) {
    $('#sidebar').classList.toggle('open', open);
    $('#scrim').classList.toggle('show', open);
    $('#scrim').hidden = !open;
    $('#mob-toggle').setAttribute('aria-expanded', open ? 'true' : 'false');
    $('#mob-toggle').setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }

  function navigate(next) {
    if (!next) return;
    page = next;
    $$('.page').forEach((el) => el.classList.toggle('active', el.dataset.page === next));
    $$('.nav-btn[data-page]').forEach((btn) => {
      const on = btn.dataset.page === next || (btn.dataset.page === 'home' && next === 'detail');
      btn.classList.toggle('active', on);
      if (on) btn.setAttribute('aria-current', 'page');
      else btn.removeAttribute('aria-current');
    });
    setMenu(false);
    $('.page.active')?.scrollTo(0, 0);
  }

  function newsPill(impact) {
    if (impact === 'alta') return 'crit';
    if (impact === 'misto') return 'med';
    return 'info';
  }

  function statusLabel(priority) {
    if (priority === 'crit') return 'Ação';
    if (priority === 'attn') return 'Atenção';
    return 'Monitorar';
  }

  function smoothPath(pts) {
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(pts.length - 1, i + 2)];
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
  }

  function priceChart(values, labels, annotations) {
    const w = 720;
    const h = 300;
    const padL = 52;
    const padR = 16;
    const padT = 36;
    const padB = 36;
    const min = Math.floor((Math.min(...values) - 8) / 5) * 5;
    const max = Math.ceil((Math.max(...values) + 16) / 5) * 5;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;
    const first = values[0];
    const lastV = values[values.length - 1];
    const delta = lastV - first;
    const deltaPct = ((delta / first) * 100).toFixed(1).replace('.', ',');
    const fx = STEEL.fx;
    const pts = values.map((v, i) => ({
      x: padL + (i / (values.length - 1)) * plotW,
      y: padT + (1 - (v - min) / (max - min)) * plotH,
      v,
      i,
      label: labels[i] || '',
    }));
    const path = smoothPath(pts);
    const area = `${path} L ${pts[pts.length - 1].x.toFixed(1)} ${(padT + plotH).toFixed(1)} L ${pts[0].x.toFixed(1)} ${(padT + plotH).toFixed(1)} Z`;
    const last = pts[pts.length - 1];
    const baseY = padT + (1 - (first - min) / (max - min)) * plotH;
    const yTicks = [];
    for (let s = 0; s <= 4; s++) {
      const val = min + ((max - min) * s) / 4;
      yTicks.push({ val: Math.round(val), y: padT + plotH - (s / 4) * plotH });
    }
    const grid = yTicks.map((t) => `
      <line class="c-grid" x1="${padL}" y1="${t.y}" x2="${padL + plotW}" y2="${t.y}"/>
      <text class="c-axis" x="${padL - 8}" y="${t.y + 4}" text-anchor="end">${t.val.toLocaleString('pt-BR')}</text>
    `).join('');
    const xLabels = pts.map((p) => p.label
      ? `<text class="c-axis" x="${p.x}" y="${h - 12}" text-anchor="middle">${p.label}</text>`
      : '').join('');
    const ann = Object.fromEntries(annotations.map((a) => [a.i, a]));
    const markers = pts.map((p) => {
      const mark = ann[p.i];
      if (!mark) return '';
      const tw = Math.max(78, mark.label.length * 6.6);
      return `
        <g>
          <line x1="${p.x}" y1="${padT + 18}" x2="${p.x}" y2="${padT + plotH}" class="c-event-line"/>
          <rect x="${p.x - tw / 2}" y="6" width="${tw}" height="18" rx="9" class="c-event-pill"/>
          <text x="${p.x}" y="18" text-anchor="middle" class="c-event-txt">${mark.label}</text>
        </g>`;
    }).join('');
    const dots = pts.map((p, i) => {
      const isLast = i === pts.length - 1;
      const isKey = isLast || i === 0 || ann[p.i] || i % 2 === 0;
      if (!isKey) return '';
      return `
        <g class="c-dot" data-i="${i}" data-v="${p.v}" data-label="${p.label}" data-brl="${Math.round(p.v * fx)}">
          ${isLast ? `<circle cx="${p.x}" cy="${p.y}" r="12" class="c-pulse"/>` : ''}
          <circle cx="${p.x}" cy="${p.y}" r="16" class="c-hit"/>
          <circle cx="${p.x}" cy="${p.y}" r="${isLast ? 6 : 4}" class="c-point ${isLast ? 'last' : ''}"/>
        </g>`;
    }).join('');

    return `
      <div class="chart-shell" id="hrc-chart">
        <div class="chart-toolbar">
          <div class="chart-stats">
            <div class="cs"><span class="lab">Abertura</span><strong>US$ ${first.toLocaleString('pt-BR')}</strong></div>
            <div class="cs hot"><span class="lab">Variação da curva</span><strong>+${deltaPct}% · +US$ ${delta}</strong></div>
            <div class="cs"><span class="lab">Faixa</span><strong>${Math.min(...values).toLocaleString('pt-BR')} – ${Math.max(...values).toLocaleString('pt-BR')}</strong></div>
          </div>
          <div class="chart-callout">
            <span class="lab">Último fechamento</span>
            <div class="cc-row"><strong>US$ ${lastV.toLocaleString('pt-BR')}</strong><span class="badge-up">▲ +${deltaPct}%</span></div>
            <em>≈ R$ ${Math.round(lastV * fx).toLocaleString('pt-BR')}/t · câmbio ${String(fx).replace('.', ',')}</em>
          </div>
        </div>
        <div class="chart-canvas-wrap">
          <div class="chart-tip" id="chart-tip" hidden></div>
          <svg class="line-chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="HRC de US$ ${first} para US$ ${lastV} por tonelada em 30 dias">
            <defs>
              <linearGradient id="g-hrc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#EF4444" stop-opacity=".32"/>
                <stop offset="100%" stop-color="#DC2626" stop-opacity="0"/>
              </linearGradient>
              <linearGradient id="g-line" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#F87171"/>
                <stop offset="100%" stop-color="#B91C1C"/>
              </linearGradient>
            </defs>
            ${grid}
            <line x1="${padL}" y1="${baseY}" x2="${padL + plotW}" y2="${baseY}" class="c-baseline"/>
            <text x="${padL + 6}" y="${baseY - 6}" class="c-baseline-lab">abertura ${first}</text>
            <path d="${area}" fill="url(#g-hrc)" class="c-area"/>
            <path d="${path}" fill="none" stroke="url(#g-line)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" class="c-line"/>
            ${markers}
            <circle cx="${pts[0].x}" cy="${pts[0].y}" r="4" class="c-point start"/>
            ${dots}
            ${xLabels}
          </svg>
        </div>
        <div class="chart-legend-row">
          <span><i class="lg-line"></i>Preço HRC</span>
          <span><i class="lg-base"></i>Abertura</span>
          <span><i class="lg-evt"></i>Evento</span>
          <span class="muted">Toque ou passe o mouse nos pontos</span>
        </div>
        <div class="chart-foot">
          <span>Referência HRC internacional · série aproximada de 30 dias</span>
          <span>20 set 2026</span>
        </div>
      </div>`;
  }

  function bindChart() {
    const tip = $('#chart-tip');
    const wrap = $('.chart-canvas-wrap');
    if (!tip || !wrap) return;
    const place = (el) => {
      const v = Number(el.dataset.v);
      const brl = Number(el.dataset.brl);
      const label = el.dataset.label;
      tip.hidden = false;
      tip.dataset.i = el.dataset.i;
      tip.innerHTML = `<strong>US$ ${v.toLocaleString('pt-BR')}/t</strong><span>≈ R$ ${brl.toLocaleString('pt-BR')}/t</span>${label ? `<em>${label}</em>` : ''}`;
      const box = wrap.getBoundingClientRect();
      const dot = el.querySelector('.c-point').getBoundingClientRect();
      const x = dot.left - box.left + dot.width / 2;
      const y = dot.top - box.top;
      tip.style.left = `${Math.min(Math.max(x, 70), box.width - 70)}px`;
      tip.style.top = `${Math.max(y, 36)}px`;
    };
    $$('#hrc-chart .c-dot').forEach((el) => {
      el.addEventListener('pointerenter', () => place(el));
      el.addEventListener('pointerleave', (e) => {
        if (e.pointerType === 'touch') return;
        tip.hidden = true;
      });
      el.addEventListener('pointerdown', (e) => {
        if (e.pointerType !== 'touch') return;
        if (!tip.hidden && tip.dataset.i === el.dataset.i) tip.hidden = true;
        else place(el);
      });
    });
  }

  function renderSteel() {
    const s = STEEL;
    const news = s.news.map((n) => `
      <article class="news-card">
        <div>
          <div class="top">
            <span class="pill ${newsPill(n.impact)}">${n.impactLabel}</span>
            <span class="when">${n.date} · ${n.source}</span>
          </div>
          <h3>${n.title}</h3>
          <p>${n.why}</p>
        </div>
        <a class="btn-enter" href="${n.url}" target="_blank" rel="noopener noreferrer">Abrir fonte</a>
      </article>`).join('');

    $('#detail-root').innerHTML = `
      <header class="page-hdr">
        <div>
          <p class="crumbs"><button type="button" data-page="home">← Radar</button> · ${s.name}</p>
          <h1>${s.title}</h1>
          <p class="sub">Referência internacional cruzada com a exposição simulada da Apex.</p>
        </div>
        <div class="hdr-actions"><span class="pill crit">${s.statusLabel}</span></div>
      </header>

      <div class="price-hero">
        <div class="price-now">
          <div class="lab">Preço HRC · referência internacional</div>
          <div class="big">US$ ${s.priceUsd.toLocaleString('pt-BR')}/t</div>
          <div class="brl">≈ R$ ${s.priceBrl.toLocaleString('pt-BR')}/t</div>
          <div class="meta">
            <span class="hot">${s.move} no mês</span>
            <span>Confiança · ${s.confidence}</span>
            <span>20 set 2026</span>
          </div>
          <p class="price-note">Conversão indicativa: US$ × ${String(s.fx).replace('.', ',')}. Sem frete, imposto ou prêmio de usina no Brasil.</p>
        </div>
        <div class="price-stats">
          <div class="metric"><div class="lab">Variação no mês</div><div class="val hot">${s.move}</div></div>
          <div class="metric"><div class="lab">Exposição Apex</div><div class="val">${s.exposure}</div></div>
          <div class="metric"><div class="lab">Contratos</div><div class="val">${s.contracts}</div></div>
          <div class="metric"><div class="lab">Plantas</div><div class="val">${s.plants}</div></div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-head-row">
          <div>
            <h3>Evolução do preço</h3>
            <p class="psub">HRC · 30 dias · dólares por tonelada</p>
          </div>
        </div>
        ${priceChart(s.chart, s.chartLabels, s.chartAnnotations)}
      </div>

      <div class="sec-head">
        <h2>O que move o preço</h2>
        <p>Cinco notícias do recorte. O link abre a fonte original.</p>
      </div>
      <div class="news-list">${news}</div>

      <div class="sec-head">
        <h2>Onde me afeta</h2>
        <p>Mercado, contrato, cobertura e a ordem em que olhar.</p>
      </div>
      <div class="impact-kpi-strip">
        ${s.kpis.map((k) => `
          <div class="impact-kpi ${k.tone}">
            <div class="lab">${k.lab}</div>
            <div class="val">${k.val}</div>
            <div class="hint">${k.hint}</div>
          </div>`).join('')}
      </div>

      <div class="impact-layout">
        <div class="panel">
          <h3>Ranking de prioridade</h3>
          <p class="psub">Score de 0 a 100 · cobertura, janela e preço aberto</p>
          <div class="prio-rank">
            ${s.impacts.map((it) => `
              <div class="prio-rank-row ${it.priority}">
                <div class="rank-n">${it.rank}</div>
                <div>
                  <div class="rank-top"><strong>${it.name}</strong><span class="money">${it.money}</span></div>
                  <div class="rank-bar"><i style="width:${it.score}%"></i></div>
                  <div class="rank-meta">
                    <span>Score ${it.score}</span>
                    <span>${it.volume}</span>
                    <span>Cobertura ${it.coverage}</span>
                    <span>Janela ${it.window}</span>
                  </div>
                </div>
              </div>`).join('')}
          </div>
        </div>
        <div class="panel">
          <h3>Fila de decisão</h3>
          <p class="psub">Três ações. O sistema sugere. Eduardo decide.</p>
          <div class="decision-queue">
            ${s.impacts.filter((it) => it.rank <= 3).map((it) => `
              <div class="decision-item ${it.priority}">
                <div class="d-rank">${it.rank}</div>
                <div>
                  <strong>${it.action}</strong>
                  <small>${it.reason}</small>
                  <div class="d-meta">
                    <span>${it.name.split('·')[0].trim()}</span>
                    <span>${it.money}</span>
                    <span>${it.window}</span>
                  </div>
                </div>
              </div>`).join('')}
          </div>
        </div>
      </div>

      <div class="panel">
        <h3>Mapa de exposição</h3>
        <p class="psub">A-14 e B-07 somam as 730 toneladas da janela crítica.</p>
        <div class="exposure-table-wrap">
          <table class="exposure-table">
            <thead>
              <tr>
                <th>Unidade</th>
                <th class="num">Volume</th>
                <th class="num">Cobertura</th>
                <th class="num">Aberto</th>
                <th>Janela</th>
                <th class="num">Impacto</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${s.impacts.map((it) => `
                <tr>
                  <td><strong>${it.name}</strong><small>${it.reason}</small></td>
                  <td class="num">${it.volume}</td>
                  <td class="num">${it.coverage}</td>
                  <td class="num">${it.openPct}</td>
                  <td>${it.window}</td>
                  <td class="num">${it.money}</td>
                  <td><span class="pill ${it.priority === 'crit' ? 'crit' : it.priority === 'attn' ? 'attn' : 'med'}">${statusLabel(it.priority)}</span></td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <p class="impact-footnote">Exposição simulada, cruzada com a variação pública de +3,7% no mês. Prioridade = cobertura baixa + janela curta + percentual em aberto.</p>
      </div>

      <div class="hdr-actions detail-actions">
        <button type="button" class="btn-ghost" data-page="home">Voltar ao radar</button>
        <a class="btn-ghost" href="https://tradingeconomics.com/commodity/hrc-steel" target="_blank" rel="noopener noreferrer">Fonte do preço</a>
      </div>`;

    requestAnimationFrame(bindChart);
  }

  function renderWatch(id) {
    const s = WATCH[id];
    if (!s) return;
    $('#detail-root').innerHTML = `
      <header class="page-hdr">
        <div>
          <p class="crumbs"><button type="button" data-page="home">← Radar</button> · Leitura curta</p>
          <h1>${s.title}</h1>
        </div>
        <div class="hdr-actions"><span class="pill ${s.pill}">${s.pillLabel}</span></div>
      </header>
      <div class="watch-hero ${s.tone}">
        <div class="watch-move">${s.move}</div>
        <p>${s.verdict}</p>
        <div class="watch-meta">${s.meta.map((m) => `<span>${m}</span>`).join('')}</div>
      </div>
      <div class="watch-grid">
        <div class="panel">
          <h3>O que mudou</h3>
          <p class="psub">Leitura desta manhã</p>
          <ul class="bullet-list">${s.changed.map((item) => `<li>${item}</li>`).join('')}</ul>
        </div>
        <div class="panel">
          <h3>Onde toca</h3>
          <p class="psub">Recorte interno simulado</p>
          <ul class="impact-list">
            ${s.impacts.map((it) => `
              <li><div><strong>${it.name}</strong><small>${it.meta}</small></div><span class="money">${it.money}</span></li>
            `).join('')}
          </ul>
        </div>
      </div>
      <div class="panel">
        <h3>O que olhar</h3>
        <p class="psub">Sugestão. Não dispara pedido nem hedge.</p>
        <ol class="action-list">${s.actions.map((a) => `<li>${a}</li>`).join('')}</ol>
      </div>
      <div class="hdr-actions detail-actions">
        <button type="button" class="btn-ghost" data-page="home">Voltar ao radar</button>
        <button type="button" class="btn-primary" data-open="aco">Ir para o aço</button>
      </div>`;
  }

  function openSignal(id) {
    if (id === 'aco') renderSteel();
    else renderWatch(id);
    navigate('detail');
  }

  document.addEventListener('click', (e) => {
    const open = e.target.closest('[data-open]');
    if (open) {
      openSignal(open.dataset.open);
      return;
    }
    const go = e.target.closest('[data-page]');
    if (go) navigate(go.dataset.page);
  });

  $('#mob-toggle').addEventListener('click', () => {
    setMenu(!$('#sidebar').classList.contains('open'));
  });
  $('#scrim').addEventListener('click', () => setMenu(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if ($('#sobre').open) $('#sobre').close();
      else setMenu(false);
    }
  });

  const sobre = $('#sobre');
  $('#btn-sobre').addEventListener('click', () => sobre.showModal());
  $('#sobre-fechar').addEventListener('click', () => sobre.close());
  sobre.addEventListener('click', (e) => {
    if (e.target === sobre) sobre.close();
  });

  $('.page.active')?.scrollTo(0, 0);
})();
