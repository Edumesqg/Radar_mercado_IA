# Radar de Mercado

Cockpit demonstrativo de inteligência de mercado. A tela mostra o que mudou fora da empresa, onde isso toca contrato e planta, e o que merece a pauta de hoje.

A empresa da tela é fictícia: **Apex Industrial**. Não há servidor, banco nem chave de API. O relógio está congelado em **20 set 2026 · 07:15**.

Desenvolvido por [Eduardo Mesquita](https://www.linkedin.com/in/engeduardomesquita/).

**[Ver a demo online](https://edumesqg.github.io/Radar_mercado_IA/)**

[English](#english)

## O problema

A reunião de compras abre com um recorte de notícias. O preço do jornal não diz qual contrato está exposto, qual planta está curta de cobertura nem quem é o dono da ação.

Este repositório mostra o desenho oposto: um radar da manhã. O sinal externo só entra na pauta depois de cruzar com exposição, cobertura e prazo.

## Quem usa

Na empresa fictícia, o diretor de compras abre o cockpit antes da reunião. Cada sinal tem um dono:

- compras, no aço;
- tesouraria, no câmbio;
- logística e PCP, no frete;
- facilities, comercial e jurídico, nos sinais que ficam em monitoramento.

A tela separa o que pede reunião do que fica com leitura curta.

## O que a tela faz

| Tela | O que entrega |
| --- | --- |
| Radar do dia | Cinco famílias de sinal. Uma, o aço HRC, com impacto relevante |
| Análise do aço | Preço, curva de 30 dias, notícias com fonte e fila de decisão |
| Demais sinais | Leitura curta, com dono, prazo e ação sugerida |
| Fontes | De onde veio cada leitura desta manhã |

O aço traz o preço de referência, a variação do mês e quatro itens de exposição, do contrato mais urgente ao estoque que só se monitora. Câmbio, frete, energia, semicondutores, regulação, demanda e concorrência não disputam a mesma reunião.

Há um freio. A tela sugere revisar preço, cobertura ou hedge. Não emite pedido, não executa proteção e não substitui o terminal de commodity. O sistema aponta. A pessoa decide.

## O que ela não faz

- Não consulta um mercado ao vivo. Os números estão no script.
- Não lê o ERP. Contratos, plantas, cobertura e valores em reais da Apex são simulados.
- Não transforma a cotação em preço de compra. A conversão para reais usa o câmbio da demonstração e não inclui frete, imposto nem prêmio de usina.
- Não mede precisão nem custo de um modelo. Não há modelo conectado.

Preço HRC, câmbio usado na conversão e as notícias com link são referência pública, gravada na tela. No uso real, a exposição sairia do ERP.

## Como abrir

A demo já está no ar: [edumesqg.github.io/Radar_mercado_IA](https://edumesqg.github.io/Radar_mercado_IA/).

Para abrir nesta pasta, use `index.html` no navegador. Não há instalação. A fonte Inter está em `fonts/`. Nada é carregado de uma CDN.

## O que foi conferido

A checagem desta versão é de percurso, não de avaliação estatística.

O que a demo sustenta, e dá para repetir abrindo a tela:

1. Só o aço entra como alta atenção. Os outros sinais declaram dono e prazo próprios.
2. A análise do aço mostra preço, curva, notícia com fonte e a fila de contratos.
3. A página de fontes separa índice de mercado, câmbio, logística, regulação e exposição contratual.
4. Nenhuma ação da fila dispara um pedido.

Uma leitura com feed ao vivo e exposição vinda de sistema real fica fora deste corte.

## Licença

MIT. Veja `LICENSE`.

A fonte Inter, em `fonts/`, permanece sob a SIL Open Font License. Veja `fonts/OFL.txt`.

---

## English

A market-intelligence cockpit, shown as a demo. The screen shows what changed outside the company, where that touches a contract or a plant, and what belongs on today's agenda.

The company on screen is fictional: **Apex Industrial**. There is no server, no database, and no API key. The clock is frozen at **20 Sep 2026 · 07:15**.

Built by [Eduardo Mesquita](https://www.linkedin.com/in/engeduardomesquita/).

**[Open the live demo](https://edumesqg.github.io/Radar_mercado_IA/)**

### The problem

A purchasing meeting often opens on a stack of headlines. The published price does not say which contract is exposed, which plant is short on coverage, or who owns the action.

This repository shows the opposite shape: a morning radar. An external signal reaches the agenda only after it is crossed with exposure, coverage, and a deadline.

### Who uses it

Inside the fictional company, the procurement director opens the cockpit before the meeting. Each signal has an owner:

- procurement, for steel;
- treasury, for foreign exchange;
- logistics and production planning, for freight;
- facilities, commercial, and legal, for the signals that stay on watch.

The screen separates what needs the meeting from what gets a short reading.

### What the screen does

| Screen | What it returns |
| --- | --- |
| Day radar | Five signal families. One of them, HRC steel, with material impact |
| Steel analysis | Price, a 30-day curve, sourced news, and a decision queue |
| Other signals | A short reading, with owner, deadline, and a suggested action |
| Sources | Where each reading from this morning came from |

Steel shows the reference price, the move over the month, and four exposure items, from the most urgent contract to inventory that is only watched. Foreign exchange, freight, energy, semiconductors, regulation, demand, and competition do not compete for the same meeting.

There is a brake. The screen suggests reviewing price, coverage, or a hedge. It does not place an order, execute a hedge, or replace a commodity terminal. The system points. A person decides.

### What it does not do

- It does not query a live market. The figures live in the script.
- It does not read an ERP. Apex contracts, plants, coverage, and amounts in reais are simulated.
- It does not turn the quote into a purchase price. The conversion to reais uses the demo exchange rate and leaves out freight, tax, and mill premium.
- It does not measure precision or the cost of a model. No model is connected.

The HRC price, the exchange rate used in the conversion, and the linked news items are public references stored in the screen. In real use, exposure would come from the ERP.

### How to open it

The demo is live: [edumesqg.github.io/Radar_mercado_IA](https://edumesqg.github.io/Radar_mercado_IA/).

To open this folder locally, use `index.html` in a browser. There is no install. The Inter font is in `fonts/`. Nothing is loaded from a CDN.

### What was checked

This version was checked by walking the paths, not by a statistical evaluation.

What the demo holds, and what you can repeat by opening the screen:

1. Only steel is marked as high attention. The other signals name their own owner and deadline.
2. The steel analysis shows price, curve, a sourced news item, and the contract queue.
3. The sources page separates the market index, foreign exchange, logistics, regulation, and contract exposure.
4. No action in the queue places an order.

A reading with a live feed and exposure from a real system is outside this cut.

### License

MIT. See `LICENSE`.

The Inter font, in `fonts/`, remains under the SIL Open Font License. See `fonts/OFL.txt`.
