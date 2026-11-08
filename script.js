(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- Menu mobile ---------- */
  const toggle = $(".menu-toggle"), menu = $("#menu");
  const setMenu = open => {
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  };
  toggle.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
  document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

  /* ---------- Navegação por hash ---------- */
  const pages = $$("[data-page]"), links = $$("#menu [data-route]");
  const route = () => {
    const id = location.hash.slice(1);
    const target = pages.some(p => p.id === id) ? id : "inicio";
    const active = target === "gestoes" ? "sobre" : target;
    pages.forEach(p => (p.hidden = p.id !== target));
    links.forEach(a => a.dataset.route === active ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
    setMenu(false);
    window.scrollTo({ top: 0 });
  };
  window.addEventListener("hashchange", route);

  /* ---------- Foto da fachada (fallback com a logo) ---------- */
  const img = $(".hero-photo img"), noImg = () => img.parentElement.classList.add("no-img");
  img.addEventListener("error", noImg);
  if (img.complete && !img.naturalWidth) noImg();

  /* ---------- Modais (edite os textos) ---------- */
  const MODAIS = {
    historia: ["Nossa história", "Em 15 de junho de 2023, o auditório da Faculdade de Ciências Contábeis sediou a assembleia de posse dos primeiros diretores acadêmicos. O evento marcou o passo inicial para a consolidação de uma força estudantil inclusiva, humanitária e de forte representação."],
  };
  const modal = $("#modal");
  const abrir = (t, p) => { $("#modal-title").textContent = t; $("#modal-body").innerHTML = `<p>${esc(p)}</p>`; modal.showModal(); };
  document.addEventListener("click", e => {
    const open = e.target.closest("[data-modal]");
    if (open) {
      abrir(...MODAIS[open.dataset.modal]);
    } else if (e.target.closest("[data-close]") || e.target === modal) modal.close();
  });

  /* ---------- Gestões (substitua pelos dados reais) ---------- */
  const GESTOES = [
    { nome: "Conecta", ano: "2026", img: "https://instagram.fssa20-1.fna.fbcdn.net/v/t51.82787-19/670402103_18032971952792487_3347985603861027475_n.jpg?_nc_cat=102&_nc_map=urlgen_bucketless&ig_cache_key=GDeG9Seno3135BBAAJMaQhcrb3YubmNDAQAB0j-ccb7-5&ccb=7-5&_nc_sid=669407&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=lWLPgNsqdnIQ7kNvwGVSE7E&_nc_oc=AdrACV6UqodhjatznS9rd8Nfy_x2xKaJm1iHscOXwV5G0ToEKi2FkM6CkNOisjQW0po&_nc_zt=24&_nc_ht=instagram.fssa20-1.fna&_nc_gid=BAOgexX2AllJqChL8tfM_A&_nc_ss=7baaf&oh=00_AQQ9wc3g1PrSOz1DE_jIdejD7TLyPiEiNXp3WKlYOr-5ww&oe=6AF563E8", carta: "https://www.instagram.com/p/DXLGfCUjSLs/?img_index=1",
      cargos: [["Diretor-geral", "Bruno Henrique da Ressurreição da Silva"], ["Diretor-geral", "Leonardo Reis da Conceição"], ["Diretora financeira", "Maria Júlia Sena Almeida"]],
      membros: ["Bruna Souza Martins - Diretoria de Ações Afirmativas", "Maria Eduarda Pinto Maurício - Diretoria de Assuntos Acadêmicos e Relações Institucionais", "Felipe Santos de Jesus - Diretoria Cultural e Científica", "Tayan Floripes Oliveira Bernardo - Diretoria de Marketing"] },
    { nome: "Força ILTDA", ano: "2023", img: "https://i.imgur.com/MGCz3gq.png", carta: "https://www.instagram.com/p/Cv_M5SRgQdC/?img_index=1",
      cargos: [["Diretora-geral", "Emilly Carvalho"], ["Diretora-geral", "Yassmin"], ["Diretor-geral", "Yago D'Avila"]], membros: ["Diretora de Políticas e Movimentos Sociais - Laura Fernandes", "Diretor Financeiro - Bruno Ricardo", "Diretora Financeira - Maira Lima", "Diretora de Comunicação e Marketing - Greice Kelly", "Diretora Científica e Cultural - Bruna Martins"] },
    { nome: "...", ano: "...", img: "#", carta: "#",
      cargos: [["...", "..."], ["...", "..."], ["...", "..."]], membros: ["..."] },
  ];
  const gestaoHTML = (g, atual) => `
    <article class="gestao${atual ? " atual" : ""}">
      <div class="g-emblem" style="background-image:url('${esc(g.img || "images/dalogo.png")}')" role="img" aria-label="Emblema da gestão ${esc(g.nome)}"></div>
      <div>
        <span class="ano">${esc(g.ano)}${atual ? " · GESTÃO ATUAL" : ""}</span>
        <h3>${esc(g.nome)}</h3>
        <ul class="roles">${g.cargos.map(([c, n]) => `<li><b>${esc(n)}</b> (${esc(c)})</li>`).join("")}</ul>
        <details class="members"><summary>Ver todos os membros (${g.membros.length})</summary><ul>${g.membros.map(m => `<li>${esc(m)}</li>`).join("")}</ul></details>
        <a class="btn btn-wine" href="${esc(g.carta)}" target="_blank" rel="noopener">Carta Programa</a>
      </div>
    </article>`;
  $("#g-atual").innerHTML = gestaoHTML(GESTOES[0], true);
  $("#g-ant").innerHTML = GESTOES.slice(1).map(g => gestaoHTML(g)).join("");

  /* ---------- Trilhas: catálogo de vídeos e playlists do YouTube ---------- */
  // Para adicionar conteúdo, cole o link do YouTube em "itens" da categoria desejada:
  //   Vídeo:    { url: "https://www.youtube.com/watch?v=ID", titulo: "Título", canal: "Nome do canal" }
  //   Playlist: { url: "https://www.youtube.com/playlist?list=ID", titulo: "Título", canal: "Nome do canal", capa: "ID de um vídeo da playlist" }
  // "capa" é opcional e define a miniatura da playlist. Links youtu.be e embed também funcionam.
  const CATEGORIAS = [
    { id: "contabilidade", nome: "Contabilidade Geral", desc: "Mensuração, controle patrimonial e conformidade legal aplicados à gestão financeira e tomada de decisão.", itens: [
      {
        url: "https://www.youtube.com/watch?v=D_XmlT15-rE",
        titulo: "Contabilidade Geral Básica | Aula 01 | Parte 01 | Loberto Sasaki",
        canal: "Nata Conta"
      },
      {
        url: "https://www.youtube.com/watch?v=4P3YtqrsE3E",
        titulo: "Contabilidade Geral Básica | Aula 01 | Parte 02 | Loberto Sasaki",
        canal: "Nata Conta"
      },
      {
        url: "https://www.youtube.com/watch?v=tfBM7G4c2cY",
        titulo: "Contabilidade Geral Básica | Aula 01 | Parte 03 | Loberto Sasaki",
        canal: "Nata Conta"
      },
      {
        url: "https://www.youtube.com/watch?v=xdvHOOcZba8",
        titulo: "Contabilidade Geral Básica | Aula 01 | Parte 04 | Loberto Sasaki",
        canal: "Nata Conta"
      },
      {
        url: "https://www.youtube.com/watch?v=yu-XlFHB6IY",
        titulo: "Contabilidade Geral Básica | Aula 02 | Parte 01 | Loberto Sasaki",
        canal: "Nata Conta"
      },
      {
        url: "https://www.youtube.com/watch?v=DFRm-3Mzn6c",
        titulo: "Contabilidade Geral Básica | Aula 02 | Parte 02 | Loberto Sasaki",
        canal: "Nata Conta"
      },
      {
        url: "https://www.youtube.com/watch?v=GLaYlsiNdFU",
        titulo: "Contabilidade Geral Básica | Aula 02 | Parte 03 | Loberto Sasaki",
        canal: "Nata Conta"
      },
      {
        url: "https://www.youtube.com/watch?v=w2ORwmnqIdo",
        titulo: "Contabilidade Geral Básica | Aula 02 | Parte 04 | Loberto Sasaki",
        canal: "Nata Conta"
      },
      {
        url: "https://www.youtube.com/watch?v=pTyAGr4OgOc",
        titulo: "Contabilidade Geral Básica | Aula 03 | Parte 01 | Loberto Sasaki",
        canal: "Nata Conta"
      },
      {
        url: "https://www.youtube.com/watch?v=61kC3Nw0fQw",
        titulo: "Contabilidade Geral Básica | Aula 03 | Parte 02 | Loberto Sasaki",
        canal: "Nata Conta"
      },
      {
        url: "https://www.youtube.com/watch?v=wc6Pt_k5doo",
        titulo: "Contabilidade Geral Básica | Aula 03 | Parte 03 | Loberto Sasaki",
        canal: "Nata Conta"
      },
      {
        url: "https://www.youtube.com/watch?v=hDUALEo3mt4",
        titulo: "Contabilidade Geral Básica | Aula 03 | Parte 04 | Loberto Sasaki",
        canal: "Nata Conta"
      }
    ] },
    { id: "reformatributaria", nome: "Reforma Tributária", desc: "Impactos regulatórios, transição de regimes e simplificação de impostos aplicados ao planejamento fiscal e competitividade empresarial.", itens: [
      {
        url: "https://www.youtube.com/watch?v=OVf0x7KKhnI",
        titulo: "Entenda como funciona a reforma tributária",
        canal: "g1"
      },
      {
        url: "https://www.youtube.com/watch?v=oT5aJLkB_6Q",
        titulo: "Reforma Tributária | Guia Completo | Análises Técnica, Econômica e Política",
        canal: "Loberto Sasaki"
      }
    ] },
    { id: "estatistica", nome: "Estatística", desc: "Fundamentos, probabilidade e inferência aplicados a negócios e auditoria.", itens: [
      {
        url: "https://www.youtube.com/playlist?list=PLX-4skTGVrWUNh2VGFIyoWVGEVRQq3gkB",
        titulo: "Estatística",
        canal: "TecConcursos"
      }
    ] },
    { id: "excel", nome: "Excel", desc: "Fórmulas, tabelas dinâmicas e análise de dados na rotina contábil.", itens: [
        {
          url: "https://www.youtube.com/watch?v=ZVURQLXZtIc&",
          titulo: "Curso Excel #01 - Como surgiu o Excel?",
          canal: "Curso em Vídeo"
        },
        {
          url: "https://www.youtube.com/watch?v=yCRUWtDcrJQ",
          titulo: "Curso Excel #02 - 10 Dicas e Truques para Excel",
          canal: "Curso em Vídeo"
        },
        {
          url: "https://www.youtube.com/watch?v=X4RLqvl0Ch8",
          titulo: "Curso Excel #03 - Primeiros Passos no Excel",
          canal: "Curso em Vídeo"
        },
        {
          url: "https://www.youtube.com/watch?v=4dBE45hiDz8",
          titulo: "Curso Excel #04 - Manipulando Arquivos",
          canal: "Curso em Vídeo"
        },
        {
          url: "https://www.youtube.com/watch?v=ZPQIm6_0Z5A",
          titulo: "Curso Excel #05 - Selecionando Dados",
          canal: "Curso em Vídeo"
        },
        {
          url: "https://www.youtube.com/watch?v=nM3GqVDfREI",
          titulo: "Curso Excel #06 - Formatando Planilhas",
          canal: "Curso em Vídeo"
        },
        {
          url: "https://www.youtube.com/watch?v=JF8lit7wrrM",
          titulo: "Curso Excel #07 - Dicas para Formatação de Dados",
          canal: "Curso em Vídeo"
        },
        {
          url: "https://www.youtube.com/watch?v=8mV30b60YYQ",
          titulo: "Curso Excel #08 - Classificação de Dados",
          canal: "Curso em Vídeo"
        },
        {
          url: "https://www.youtube.com/watch?v=_-2deLFAJeM",
          titulo: "Curso Excel #09 - Fórmulas Básicas",
          canal: "Curso em Vídeo"
        },
        {
          url: "https://www.youtube.com/watch?v=boUzkJJNOPI",
          titulo: "Curso Excel #10 - Funções do Excel (Parte 1)",
          canal: "Curso em Vídeo"
        },
        {
          url: "https://www.youtube.com/watch?v=jpuYGqeL7Ig",
          titulo: "Curso Excel #11 - Funções do Excel (Parte 2)",
          canal: "Curso em Vídeo"
        },
        {
          url: "https://www.youtube.com/watch?v=LArhLXDKqNg",
          titulo: "Curso Excel #12 - Formatação Condicional",
          canal: "Curso em Vídeo"
        }
    ] },
    { id: "powerbi", nome: "Power BI", desc: "Modelagem, medidas DAX e dashboards gerenciais.", itens: [
      {
        url: "https://www.youtube.com/watch?v=NP0PJgcIDkY",
        titulo: "O que é Power BI?",
        canal: "Hashtag Treinamentos"
      },
      {
        url: "https://www.youtube.com/playlist?list=PLxjKFMYkZ9OfDG_LkQ3Txln5BqLZY5iac",
        titulo: "Power BI",
        canal: "Hashtag Treinamentos"
      }
    ] },
    { id: "python", nome: "Python", desc: "Análise de dados e automação de rotinas com Python.", itens: [
      {
        url: "https://www.youtube.com/watch?v=-VeVq64Fgw0",
        titulo: "Curso Completo de Python - do Zero ao Avançado (Masterclass)",
        canal: "Bóson Treinamentos"
      }
    ]},
    { id: "sql", nome: "SQL", desc: "Self-service BI e consultas SQL para extrair e cruzar dados.", itens: [
      {
        url: "https://youtube.com/playlist?list=PLLbQNZHBOJtZ1oAbve_kacS5nm9u1ULou&si=lgNSWBOZXfrCeLzT",
        titulo: "Curso SQL Server",
        canal: "Kamys Academy"
      }
    ] },
    { id: "storytelling", nome: "Storytelling", desc: "Como transformar números em uma história clara para quem decide.", itens: [
      {
        url: "https://www.youtube.com/watch?v=ugQ5wg2DJPw",
        titulo: "O Que é Storytelling?",
        canal: "Elaborando Projetos - Sociais e Culturais"
      },
      {
        url: "https://www.youtube.com/watch?v=ZAGhbUSQDf0",
        titulo: "e-Talks | Como fazer apresentações inesquecíveis usando o Storytelling",
        canal: "Endeavor Brasil"
      },
      {
        url: "https://www.youtube.com/watch?v=OobAIl4vsUw",
        titulo: "Storytelling | Como uma boa história pode inspirar e vender",
        canal: "Erico Rocha"
      }
    ] }
  ];
  const ytInfo = url => {
    try {
      const u = new URL(url), h = u.hostname.replace(/^(www|m)\./, "");
      if (h !== "youtube.com" && h !== "youtu.be") return null;
      const list = u.searchParams.get("list"), p = u.pathname.split("/");
      let v = u.searchParams.get("v");
      if (h === "youtu.be") v = p[1];
      else if (["embed", "shorts", "live"].includes(p[1])) v = p[2];
      if (u.pathname === "/playlist" && list) return { tipo: "playlist", id: list };
      return v ? { tipo: "video", id: v } : list ? { tipo: "playlist", id: list } : null;
    } catch (_) { return null; }
  };
  CATEGORIAS.forEach(c => { c.v = c.itens.map(i => ({ ...i, yt: ytInfo(i.url) })).filter(i => i.yt); });
  const ytThumb = i => { const v = i.yt.tipo === "video" ? i.yt.id : i.capa; return v ? `https://i.ytimg.com/vi/${encodeURIComponent(v)}/hqdefault.jpg` : ""; };
  let catAtiva = "todas";

  function renderCatalogo() {
    $("#cat-filtros").innerHTML = [["todas", "Todas"], ...CATEGORIAS.map(c => [c.id, c.nome])]
      .map(([id, n]) => `<button class="chip-f" data-cat="${id}" aria-pressed="${id === catAtiva}">${esc(n)}</button>`).join("");
    $("#cat-lista").innerHTML = CATEGORIAS.filter(c => catAtiva === "todas" || c.id === catAtiva).map(c => `
      <section class="cat" aria-labelledby="cat-${c.id}">
        <div class="cat-head"><h3 id="cat-${c.id}">${esc(c.nome)}</h3><span>${c.v.length} ${c.v.length === 1 ? "conteúdo" : "conteúdos"}</span></div>
        <p class="cat-desc">${esc(c.desc)}</p>
        <div class="vgrid">${c.v.length ? c.v.map((i, k) => `
          <button class="vcard" data-c="${c.id}" data-k="${k}">
            <span class="thumb"${ytThumb(i) ? ` style="background-image:url('${ytThumb(i)}')"` : ""}><span class="vtag">${i.yt.tipo === "playlist" ? "Playlist" : "Vídeo"}</span><span class="play" aria-hidden="true">▶</span></span>
            <strong>${esc(i.titulo || "Sem título")}</strong><small>${esc(i.canal || "")}</small>
          </button>`).join("") : `<div class="vempty">Nenhum conteúdo ainda. Adicione links em CATEGORIAS → ${esc(c.nome)} no script.js.</div>`}</div>
      </section>`).join("");
  }
  const player = $("#player"), pFrame = $("#p-frame");
  $("#cat-filtros").addEventListener("click", e => { const b = e.target.closest("[data-cat]"); if (b) { catAtiva = b.dataset.cat; renderCatalogo(); } });
  $("#cat-lista").addEventListener("click", e => {
    const b = e.target.closest(".vcard"); if (!b) return;
    const i = CATEGORIAS.find(c => c.id === b.dataset.c).v[+b.dataset.k], id = encodeURIComponent(i.yt.id), pl = i.yt.tipo === "playlist";
    $("#p-title").textContent = i.titulo || "Sem título";
    $("#p-canal").textContent = i.canal || "";
    $("#p-yt").href = pl ? `https://www.youtube.com/playlist?list=${id}` : `https://www.youtube.com/watch?v=${id}`;
    pFrame.src = "https://www.youtube-nocookie.com/embed/" + (pl ? `videoseries?list=${id}&autoplay=1&rel=0` : `${id}?autoplay=1&rel=0`);
    player.showModal();
  });
  player.addEventListener("click", e => { if (e.target === player || e.target.closest("[data-pclose]")) player.close(); });
  player.addEventListener("close", () => { pFrame.src = "about:blank"; });

  /* ---------- Grade interativa e portal ---------- */
  // id|nome|período|horas|pré-requisitos|horários (dia.bloco; dia 0 = Seg). Substitua pelos dados reais do curso.
  const DISC = `ADM001|Introdução à Administração|1|60||
DIR159|Instituição de Direito Público e Privado|1|60||
ECOB40|Introdução à Economia I|1|60||
FCC033|Contabilidade Introdutória I|1|60||
FCC041|Met. Pesq. Aplic. Contabilidade|1|60||
MATG10|Cálculo Elementar|1|60||
DIR161|Legislação Tributária|2|60|DIR159|
DIR167|Direito Comercial VII|2|60|DIR159|
FCC034|Contabilidade Introdutório II|2|60|FCC033|
FCC066|Economia das Organizações|2|60|ECOB40|
LETF01|Língua Portuguesa – Leitura e Produção de Textos para Fins|2|60||
MAT020|Estatística I-A|2|60|MATG10|
DIR164|Legislação Social e Direito do Trabalho|3|60|DIR159|
FCC024|Contabilidade de Custos|3|60|FCC034|
FCC035|Contabilidade Intermediária|3|60|FCC034|
MAT023|Estatística II-A|3|60|MAT020|
MAT191|Matemática Financeira|3|60|MATG10|
ECO173|Economia Brasileira Contemporânea|4|60|ECOB40|
FCC036|Contabilidade Avançada|4|60|FCC035|
FCC044|Orçamento e Finanças Governamental|4|60|FCC035|
FCC052|Informática Aplicada à Contabilidade|4|60|FCC035|
FCC060|Macroeconomia|4|60|ECOB40|
FCC037|Teoria da Contabilidade|5|60|FCC036|
FCC039|Análise de Custos|5|60|FCC024|
FCC040|Contabilidade Tributária|5|60|DIR161 FCC036|
FCC050|Contabilidade Governamental|5|60|FCC044|
FCC051|Instituições Financeiras e Mercados de Capitais|5|60|FCC060|
FCC009|Auditoria I|6|60|FCC036|
FCC023|Análise das Demonstrações Contábeis|6|60|FCC036|
FCC038|Ética Geral e Profissional|6|60||
FCC045|Orçamento empresarial e planejamento estratégico|6|60|FCC039|
FCC010|Auditoria II|7|60|FCC009|
FCC046|Sistema de Informação Gerencial|7|60|FCC045 FCC052|
FCC049|Perícia Contábil e Arbitragem|7|60|FCC036|
FCC048|Auditoria Governamental|7|60|FCC009 FCC050|
FCC047|Introdução à Controladoria|8|60|FCC046|
GFCC0002|Estágio em Contabilidade|8|240|FCC034|`
    .split("\n").map(l => { const [id, n, s, h, p, t] = l.split("|"); return { id, n, s: +s, h: +h, p: p ? p.split(" ") : [], t: t ? t.split(" ").map(x => x.split(".").map(Number)) : [] }; });
  const DM = Object.fromEntries(DISC.map(c => [c.id, c]));
  let G = { done: [] };
  try { Object.assign(G, JSON.parse(localStorage.getItem("dacic-grade") || "{}")); } catch (_) {}
  const gSave = () => { try { localStorage.setItem("dacic-grade", JSON.stringify(G)); } catch (_) {} };
  const gPre = (id, s = new Set()) => { DM[id].p.forEach(p => { if (!s.has(p)) { s.add(p); gPre(p, s); } }); return s; };
  const gNxt = id => new Set(DISC.filter(c => gPre(c.id).has(id)).map(c => c.id));
  const gSt = c => G.done.includes(c.id) ? "done" : c.p.every(p => G.done.includes(p)) ? "avail" : "block";
  const gNome = { done: "Concluída", avail: "Disponível", block: "Bloqueada" };
  let gFocus = null, gPin = false;

  function renderGrade() {
    const tot = DISC.reduce((a, c) => a + c.h, 0), dh = DISC.filter(c => G.done.includes(c.id)).reduce((a, c) => a + c.h, 0), pc = Math.round(dh / tot * 100);
    const nd = DISC.filter(c => G.done.includes(c.id)).length;
    const st = (l, v) => `<div class="stat"><small>${l}</small><b>${v}</b></div>`;
    $("#gr-stats").innerHTML = st("Progresso", pc + "%") + st("Carga horária", `${dh} / ${tot} h`) + st("Créditos concluídos", `${nd} / ${DISC.length}`) + st("Créditos pendentes", DISC.length - nd);
    $("#gr-bar").style.width = pc + "%";
    $("#gr-clear").disabled = !nd;
    $("#gr-grid").innerHTML = [...new Set(DISC.map(c => c.s))].map(s => `<div class="t-col"><h3>${s}º período</h3>` +
      DISC.filter(c => c.s === s).map(c => { const k = gSt(c); return `<div class="mod ${k}" data-id="${c.id}">
        <div class="top"><span>${c.id} · ${gNome[k]}</span><button class="ck" data-ck="${c.id}" aria-label="Marcar ${esc(c.n)} como concluída">✓</button></div>
        <strong>${esc(c.n)}</strong><small>${c.h} h · 1 crédito</small></div>`; }).join("") + "</div>").join("");
    gApply();
  }
  function gApply() {
    const P = gFocus ? gPre(gFocus) : new Set(), N = gFocus ? gNxt(gFocus) : new Set();
    $$("#gr-grid .mod").forEach(el => {
      const id = el.dataset.id;
      el.classList.toggle("dim", !!gFocus && id !== gFocus && !P.has(id) && !N.has(id));
      el.classList.toggle("f-self", id === gFocus);
      el.classList.toggle("f-pre", P.has(id));
      el.classList.toggle("f-nxt", N.has(id));
    });
    const nm = s => [...s].map(i => DM[i].n).join(", ") || "nenhuma";
    $("#gr-info").innerHTML = gFocus ? `<b>${esc(DM[gFocus].n)}</b> · Pré-requisitos: ${esc(nm(P))}. Destranca: ${esc(nm(N))}.`
      : "Passe o cursor (ou toque) numa disciplina para ver pré-requisitos e o que ela destranca. Use o botão ✓ para marcar como concluída.";
  }
  function gToggle(id) {
    const c = DM[id];
    if (G.done.includes(id)) { const n = gNxt(id); G.done = G.done.filter(x => x !== id && !n.has(x)); }
    else if (gSt(c) === "avail") G.done.push(id);
    else { $("#gr-info").textContent = "Conclua antes: " + c.p.filter(p => !G.done.includes(p)).map(p => DM[p].n).join(", "); return; }
    gSave(); renderGrade();
  }
  const gGrid = $("#gr-grid");
  gGrid.addEventListener("mouseover", e => { const c = e.target.closest(".mod"); if (c && !gPin) { gFocus = c.dataset.id; gApply(); } });
  gGrid.addEventListener("mouseleave", () => { if (!gPin) { gFocus = null; gApply(); } });
  gGrid.addEventListener("click", e => {
    const b = e.target.closest("[data-ck]"); if (b) return gToggle(b.dataset.ck);
    const c = e.target.closest(".mod"); if (!c) return;
    gPin = !(gPin && gFocus === c.dataset.id); gFocus = c.dataset.id; gApply();
  });

  $("#gr-clear").addEventListener("click", () => {
    if (!G.done.length || !confirm("Limpar todas as disciplinas marcadas como concluídas?")) return;
    G.done = []; gFocus = null; gPin = false; gSave(); renderGrade();
  });

  /* Portal e recursos (edite os dados) */
  const NEWS = [["19 dez", "Aviso", "Fim do período letivo - 2026.2"], ["06 jan", "Prazo", "Último dia para os docentes consolidarem as notas."], ["20 nov", "Feriado", "Dia Nacional de Zumbi e da Consciência Negra."], ["23 nov", "Evento", "Congresso UFBA 80"]];
  const FAQ = [["Como contabilizo as atividades complementares?", "Registre cada atividade com o certificado e entregue ao colegiado. As horas entram na disciplina de Atividades Complementares."], ["Posso cursar uma disciplina sem o pré-requisito?", "Não. A grade bloqueia disciplinas até que os pré-requisitos estejam concluídos, como no sistema da secretaria."], ["Como funciona o cálculo de créditos?", `Nesta ferramenta, cada disciplina vale 1 crédito (${DISC.length} no total). A porcentagem de conclusão é calculada pela carga horária.`], ["Onde peço declaração de matrícula?", "Você pode fazer isso na hora pelo portal do aluno (SIGAA). Se tiver qualquer dificuldade, é só mandar um e-mail para colegiadofcc@ufba.br."]];
  const LINKS = [["FCCUFBA - HUB Compartilhado", "https://drive.google.com/drive/folders/1aRBIm5GYO5PzIDyzsd2P2xZNcDH-gmDM?usp=sharing"], ["Instagram do DACIC", "https://www.instagram.com/dacic.ufba/"], ["Canal de avisos no WhatsApp", "https://whatsapp.com/channel/0029Vb966OcEVccRb402v62t"], ["Comunidade do WhatsApp", "https://chat.whatsapp.com/LAAfAGs4dEb18i3B6zUuJo"], ["Cartilha do calouro", "https://drive.google.com/drive/folders/1iUI_VxeqfQmnOauA0XZkqHQK_8uzyA75?usp=drive_link"], ["Planeje sua grade (Que Hora é Essa?)", "https://quehoraeessa.netlify.app/"]];
  const DOCS = ["Requerimento de aproveitamento de estudos", "Declaração de atividades complementares", "Modelo de relatório de estágio", "Solicitação de revisão de nota"];
  $("#news").innerHTML = NEWS.map(n => `<li><span class="date">${n[0]}</span><div><span class="badge">${n[1]}</span><p>${esc(n[2])}</p></div></li>`).join("");
  $("#faq").innerHTML = FAQ.map(f => `<details class="faq"><summary>${esc(f[0])}</summary><p>${esc(f[1])}</p></details>`).join("");
  $("#links").innerHTML = LINKS.map(l => `<li><a href="${esc(l[1])}" target="_blank" rel="noopener">${esc(l[0])}</a></li>`).join("");
  $("#docs").innerHTML = DOCS.map(d => `<li><span>${esc(d)}</span><button data-doc="${esc(d)}">Pedir</button></li>`).join("");
  $("#docs").addEventListener("click", e => { const b = e.target.closest("[data-doc]"); if (b) abrir(b.dataset.doc, "Este modelo ainda não está disponível aqui. Aguarde as próximas atualizações deste site."); });

  renderGrade();
  renderCatalogo();
  route();
})();