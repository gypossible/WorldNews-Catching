(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function a(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(n){if(n.ep)return;n.ep=!0;const o=a(n);fetch(n.href,o)}})();const P=document.querySelector("#app"),p=6e4,L=5,N=5200,v=["markets","policy","crypto"],t={data:null,error:"",loading:!0,refreshing:!1,filter:"all",tickerPage:0,nextRefreshAt:Date.now()+p};let m=0,$=0,k=0,l=0;async function g(){l+=1;const e=l;t.loading||(t.refreshing=!0),t.error="",u();try{const r=await D();if(e!==l)return;t.data=r,t.error=r.warning||"",t.loading=!1,t.refreshing=!1,t.filter=t.filter==="all"||r.categories?.[t.filter]?t.filter:"all",t.tickerPage=0,t.nextRefreshAt=Date.now()+(r.refreshIntervalMs||p),y(),u()}catch(r){if(e!==l)return;t.loading=!1,t.refreshing=!1,t.error=r instanceof Error?`刷新失败：${r.message}，系统会在下一分钟继续自动重试。`:"刷新失败：系统会在下一分钟继续自动重试。",t.nextRefreshAt=Date.now()+p,y(),u()}}function y(){window.clearTimeout(m),m=window.setTimeout(()=>{g()},Math.max(0,t.nextRefreshAt-Date.now()))}function C(){window.clearInterval($),$=window.setInterval(()=>{S()},1e3)}function x(){window.clearInterval(k),k=window.setInterval(()=>{const e=h();e.length<=1||(t.tickerPage=(t.tickerPage+1)%e.length,f())},N)}function S(){const e=document.querySelector("[data-role='countdown']"),r=document.querySelector("[data-role='status']"),a=document.querySelector("[data-role='pulse']");e&&(e.textContent=T(t.nextRefreshAt-Date.now())),r&&(r.textContent=R()),a&&(a.textContent=t.refreshing?"抓取中":"在线")}function f(){const e=h(),r=e.length===0?0:t.tickerPage%e.length;t.tickerPage=r;const a=document.querySelector("[data-role='ticker-track']"),i=document.querySelector("[data-role='ticker-page']"),n=document.querySelector("[data-role='ticker-total']");a&&(a.style.transform=`translateX(-${r*100}%)`),i&&(i.textContent=e.length>0?String(r+1):"0"),n&&(n.textContent=String(e.length)),document.querySelectorAll("[data-ticker-dot]").forEach(o=>{const c=Number(o.getAttribute("data-ticker-dot"));o.classList.toggle("is-active",c===r)})}function u(){const e=A(),r=F(),a=h(),i=t.data?.leaderboard||[],n=t.data?.sources||[];(a.length===0||t.tickerPage>=a.length)&&(t.tickerPage=0),P.innerHTML=`
    <div class="page-shell">
      <div class="ambient ambient-left"></div>
      <div class="ambient ambient-right"></div>

      <main class="dashboard">
        <section class="headline-bar panel">
          <div class="section-head section-head-compact">
            <div>
              <p class="section-kicker">自动滚动资讯条</p>
              <h2>每次滚动展示 5 条标题</h2>
            </div>
            <div class="ticker-summary">
              <span>当前第 <strong data-role="ticker-page">${a.length>0?t.tickerPage+1:0}</strong> 组</span>
              <span>共 <strong data-role="ticker-total">${a.length}</strong> 组</span>
            </div>
          </div>

          <div class="ticker-window">
            <div class="ticker-track" data-role="ticker-track">
              ${a.length>0?a.map(O).join(""):`
                    <div class="ticker-page-view">
                      <div class="ticker-empty">正在连接资讯源，稍后自动显示最新标题。</div>
                    </div>
                  `}
            </div>
          </div>

          <div class="ticker-dots" aria-label="资讯滚动分页">
            ${a.map((o,c)=>`
                  <button
                    class="ticker-dot ${c===t.tickerPage?"is-active":""}"
                    data-ticker-dot="${c}"
                    aria-label="切换到第 ${c+1} 组标题"
                  ></button>
                `).join("")}
          </div>
        </section>

        <section class="hero panel">
          <div class="hero-copy">
            <p class="section-kicker">WORLD MONITOR FINANCE BOARD</p>
            <h1>世界监测财经简报</h1>
            <p class="hero-summary">
              聚合可直达原文的市场、政策与加密资讯。页面每 60 秒自动刷新一次，资讯标题、摘要与排行榜统一以中文展示，适合公开浏览和快速跟踪重要事件。
            </p>
            <p class="hero-credit">由刘光远设计开发</p>
          </div>

          <div class="hero-metrics">
            ${d("在线源",String(t.data?.sourceSummary?.live||0),"当前可正常拉取")}
            ${d("官方源",String(t.data?.sourceSummary?.official||0),"美联储 / 证监会")}
            ${d("资讯数",String(t.data?.sourceSummary?.itemCount||0),"已去重并翻译")}
            ${d("下次刷新",T(t.nextRefreshAt-Date.now()),"自动倒计时","countdown")}
          </div>
        </section>

        <section class="status-bar panel">
          <div>
            <p class="section-kicker">刷新状态</p>
            <h2 data-role="status">${s(R())}</h2>
            <p class="status-note">${s(t.data?.feedReference||"正在建立财经资讯看板连接...")}</p>
          </div>

          <div class="status-actions">
            <div class="signal-strip">
              <span class="signal-dot"></span>
              <span data-role="pulse">${t.refreshing?"抓取中":"在线"}</span>
            </div>
            <button
              class="action-button ${t.refreshing?"is-busy":""}"
              id="refresh-button"
              ${t.refreshing?"disabled":""}
            >
              ${t.refreshing?"正在刷新...":"立即刷新"}
            </button>
          </div>
        </section>

        ${t.error?`
              <section class="alert-panel panel">
                <p>${s(t.error)}</p>
              </section>
            `:""}

        <section class="filter-bar panel">
          <div class="section-head section-head-compact">
            <div>
              <p class="section-kicker">资讯分组</p>
              <h2>${s(w())}</h2>
            </div>
            <p class="section-note">点击分类筛选资讯主流，标题可直接跳转至原文。</p>
          </div>
          <div class="filter-row">
            ${b("all","全部资讯")}
            ${e.map(o=>b(o.key,`${o.label} ${o.count}`)).join("")}
          </div>
        </section>

        <section class="content-grid">
          <aside class="sidebar">
            <section class="leaderboard-panel panel">
              <div class="section-head">
                <div>
                  <p class="section-kicker">资讯排行榜</p>
                  <h2>重要度前 10 条</h2>
                </div>
                <p class="section-note">按时效性、来源级别与影响关键词综合打分，100 为最高。</p>
              </div>

              <div class="leaderboard-list">
                ${i.length>0?i.map(q).join(""):'<div class="empty-card compact-empty-card">正在等待排行榜数据...</div>'}
              </div>
            </section>

            <section class="source-panel panel">
              <div class="section-head">
                <div>
                  <p class="section-kicker">数据源状态</p>
                  <h2>本轮抓取概览</h2>
                </div>
                <p class="section-note">用于快速判断哪些资讯源当前在线。</p>
              </div>

              <div class="source-list">
                ${n.length>0?n.map(M).join(""):'<div class="empty-card compact-empty-card">正在读取源状态...</div>'}
              </div>
            </section>
          </aside>

          <section class="news-panel panel">
            <div class="section-head">
              <div>
                <p class="section-kicker">资讯主流</p>
                <h2>${s(w())}</h2>
              </div>
              <p class="section-note">按发布时间倒序排列，展示“标题 + 中文摘要”，点击卡片即可查看原文。</p>
            </div>

            <div class="news-list">
              ${r.length>0?r.map(j).join(""):'<div class="empty-card">当前筛选条件下暂无资讯，系统将在下一轮刷新后自动补充。</div>'}
            </div>
          </section>
        </section>
      </main>
    </div>
  `,document.querySelector("#refresh-button")?.addEventListener("click",()=>{g()}),document.querySelectorAll("[data-filter]").forEach(o=>{o.addEventListener("click",()=>{t.filter=o.getAttribute("data-filter")||"all",u()})}),document.querySelectorAll("[data-ticker-dot]").forEach(o=>{o.addEventListener("click",()=>{t.tickerPage=Number(o.getAttribute("data-ticker-dot"))||0,f()})}),S(),f()}function d(e,r,a,i=""){const n=i?`data-role="${i}"`:"";return`
    <article class="metric-card">
      <span>${s(e)}</span>
      <strong ${n}>${s(r)}</strong>
      <p>${s(a)}</p>
    </article>
  `}async function D(){const e=Date.now(),r=[new URL("./api/worldmonitor-finance-digest",window.location.href),new URL("./worldmonitor-finance-digest.json",window.location.href)];let a=null;for(const i of r){i.searchParams.set("ts",String(e));try{const n=await fetch(i.toString(),{headers:{Accept:"application/json"}});if(!n.ok)throw new Error(`HTTP ${n.status}`);return await n.json()}catch(n){a=n}}throw a instanceof Error?a:new Error("暂无可用资讯数据。")}function b(e,r){return`
    <button class="filter-chip ${t.filter===e?"is-active":""}" data-filter="${s(e)}">
      ${s(r)}
    </button>
  `}function O(e){return`
    <div class="ticker-page-view">
      ${e.map(_).join("")}
    </div>
  `}function _(e,r){return`
    <a class="ticker-item" href="${s(e.url)}" target="_blank" rel="noreferrer">
      <span class="ticker-index">${String(r+1).padStart(2,"0")}</span>
      <span class="ticker-title">${s(e.title)}</span>
    </a>
  `}function q(e){return`
    <a class="leaderboard-item" href="${s(e.url)}" target="_blank" rel="noreferrer">
      <div class="leaderboard-rank">${String(e.rank).padStart(2,"0")}</div>
      <div class="leaderboard-copy">
        <h3>${s(e.title)}</h3>
        <div class="leaderboard-meta">
          <span>${s(e.categoryLabel)}</span>
          <span>${s(e.sourceLabel)}</span>
          <span>${s(E(e.publishedAt))}</span>
        </div>
      </div>
      <div class="leaderboard-score">
        <strong>${s(String(e.score))}</strong>
        <span>重要度</span>
      </div>
    </a>
  `}function M(e){return`
    <article class="source-card">
      <div class="source-topline">
        <span class="source-category">${s(e.categoryLabel)}</span>
        <span class="source-state source-state-${s(e.status)}">${s(G(e.status))}</span>
      </div>
      <strong>${s(e.label)}</strong>
      <div class="source-meta">
        <span>${e.official?"官方源":"媒体源"}</span>
        <span>${s(String(e.itemCount))} 条</span>
      </div>
    </article>
  `}function j(e){return`
    <a class="news-card" href="${s(e.url)}" target="_blank" rel="noreferrer">
      <div class="card-topline">
        <span class="category-tag">${s(e.categoryLabel)}</span>
        <span class="source-tag ${e.official?"is-official":""}">${s(e.sourceLabel)}</span>
      </div>

      <h3>${s(e.title)}</h3>
      <p>${s(H(e.summary,150))}</p>

      <div class="card-meta">
        <span>${s(E(e.publishedAt))}</span>
        <span>点击查看原文</span>
      </div>
    </a>
  `}function A(){return Object.values(t.data?.categories||{}).sort((r,a)=>{const i=v.indexOf(r.key),n=v.indexOf(a.key);return(i===-1?99:i)-(n===-1?99:n)})}function F(){const e=t.data?.items||[];return t.filter==="all"?e:e.filter(r=>r.category===t.filter)}function h(){return K(t.data?.tickerTitles||[],L)}function w(){if(t.filter==="all")return"全部资讯";const e=A().find(r=>r.key===t.filter);return e?`${e.label}资讯`:"资讯主流"}function R(){if(t.loading&&!t.data)return"正在建立财经资讯看板...";if(!t.data?.generatedAt)return"等待下一轮自动刷新";const e=t.data?.sourceSummary?.live||0,r=t.data?.sourceSummary?.total||0;return`${I(t.data.generatedAt)} 更新，${e}/${r} 个资讯源在线。`}function H(e,r){const a=String(e||"").replace(/\s+/g," ").trim();return a.length<=r?a:`${a.slice(0,r).trimEnd()}...`}function G(e){switch(e){case"live":return"在线";case"empty":return"暂无新条目";case"error":return"抓取失败";default:return"未知"}}function E(e){const r=Number(e);if(!Number.isFinite(r))return"时间未知";const a=Math.round((Date.now()-r)/6e4);if(a<=1)return"刚刚更新";if(a<60)return`${a} 分钟前`;const i=Math.round(a/60);return i<24?`${i} 小时前`:I(r)}function I(e){try{return new Intl.DateTimeFormat("zh-CN",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!1}).format(new Date(e))}catch{return String(e)}}function T(e){const r=Math.max(0,Math.ceil(e/1e3)),a=String(Math.floor(r/60)).padStart(2,"0"),i=String(r%60).padStart(2,"0");return`${a}:${i}`}function K(e,r){if(!Array.isArray(e)||e.length===0)return[];const a=[];for(let i=0;i<e.length;i+=r)a.push(e.slice(i,i+r));return a}function s(e){return String(e).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}C();x();g();
