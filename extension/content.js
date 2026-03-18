(function(){var v="--da-distance,30px",y="opacity:0",h="to{opacity:1;transform:none}",W=[{name:"fadeIn",keyframes:"@keyframes da-fadeIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:none}}",initialStyle:y},{name:"fadeOut",keyframes:"@keyframes da-fadeOut{from{opacity:1}to{opacity:0}}"},{name:"fadeInUp",keyframes:`@keyframes da-fadeInUp{from{opacity:0;transform:translateY(var(${v}))}${h}}`,initialStyle:y,supportsDistance:!0},{name:"fadeInDown",keyframes:`@keyframes da-fadeInDown{from{opacity:0;transform:translateY(calc(var(${v})*-1))}${h}}`,initialStyle:y,supportsDistance:!0},{name:"fadeInLeft",keyframes:`@keyframes da-fadeInLeft{from{opacity:0;transform:translateX(calc(var(${v})*-1))}${h}}`,initialStyle:y,supportsDistance:!0},{name:"fadeInRight",keyframes:`@keyframes da-fadeInRight{from{opacity:0;transform:translateX(var(${v}))}${h}}`,initialStyle:y,supportsDistance:!0}],k="opacity:0",w="to{opacity:1;transform:none}",G=[{name:"slideInUp",keyframes:`@keyframes da-slideInUp{from{opacity:0;transform:translateY(100%)}${w}}`,initialStyle:k},{name:"slideInDown",keyframes:`@keyframes da-slideInDown{from{opacity:0;transform:translateY(-100%)}${w}}`,initialStyle:k},{name:"slideInLeft",keyframes:`@keyframes da-slideInLeft{from{opacity:0;transform:translateX(-100%)}${w}}`,initialStyle:k},{name:"slideInRight",keyframes:`@keyframes da-slideInRight{from{opacity:0;transform:translateX(100%)}${w}}`,initialStyle:k}],U="--da-distance,30px",I="opacity:0",$="to{opacity:1;transform:none}",V=[{name:"zoomIn",keyframes:`@keyframes da-zoomIn{from{opacity:0;transform:scale(.5)}${$}}`,initialStyle:I,supportsScale:!0},{name:"zoomOut",keyframes:`@keyframes da-zoomOut{from{opacity:0;transform:scale(1.5)}${$}}`,initialStyle:I,supportsScale:!0},{name:"zoomInUp",keyframes:`@keyframes da-zoomInUp{from{opacity:0;transform:scale(.9) translateY(var(${U}))}${$}}`,initialStyle:I,supportsDistance:!0,supportsScale:!0},{name:"zoomInDown",keyframes:`@keyframes da-zoomInDown{from{opacity:0;transform:scale(.9) translateY(calc(var(${U})*-1))}${$}}`,initialStyle:I,supportsDistance:!0,supportsScale:!0}],z="opacity:0",Z="to{opacity:1;transform:none}",J=[{name:"bounce",keyframes:"@keyframes da-bounce{0%,20%,53%,to{transform:none}40%{transform:translateY(-20px)}70%{transform:translateY(-10px)}}"},{name:"bounceIn",keyframes:`@keyframes da-bounceIn{0%{opacity:0;transform:scale(.3)}50%{transform:scale(1.05)}70%{transform:scale(.9)}${Z}}`,initialStyle:z},{name:"bounceInUp",keyframes:"@keyframes da-bounceInUp{0%{opacity:0;transform:translateY(50px)}60%{opacity:1;transform:translateY(-10px)}80%{transform:translateY(5px)}to{transform:none}}",initialStyle:z},{name:"bounceInDown",keyframes:"@keyframes da-bounceInDown{0%{opacity:0;transform:translateY(-50px)}60%{opacity:1;transform:translateY(10px)}80%{transform:translateY(-5px)}to{transform:none}}",initialStyle:z}],Q=[{name:"shake",keyframes:"@keyframes da-shake{0%,to{transform:none}10%,30%,50%,70%,90%{transform:translateX(-10px)}20%,40%,60%,80%{transform:translateX(10px)}}"},{name:"pulse",keyframes:"@keyframes da-pulse{0%,to{transform:scale(1)}50%{transform:scale(1.15)}}"},{name:"wobble",keyframes:"@keyframes da-wobble{0%,to{transform:none}15%{transform:translateX(-15px) rotate(-5deg)}30%{transform:translateX(10px) rotate(3deg)}45%{transform:translateX(-5px) rotate(-2deg)}}"},{name:"flip",keyframes:"@keyframes da-flip{from{transform:perspective(400px) rotateY(0)}to{transform:perspective(400px) rotateY(360deg)}}"},{name:"swing",keyframes:"@keyframes da-swing{0%,to{transform:none}20%{transform:rotate(15deg)}40%{transform:rotate(-10deg)}60%{transform:rotate(5deg)}80%{transform:rotate(-5deg)}}"},{name:"rubberBand",keyframes:"@keyframes da-rubberBand{0%,to{transform:scale(1)}30%{transform:scale(1.25,.75)}40%{transform:scale(.75,1.25)}50%{transform:scale(1.15,.85)}65%{transform:scale(.95,1.05)}75%{transform:scale(1.05,.95)}}"}],D="opacity:0",C="to{opacity:1;transform:none}",ee=[{name:"rotateIn",keyframes:`@keyframes da-rotateIn{from{opacity:0;transform:rotate(-200deg)}${C}}`,initialStyle:D},{name:"rotateInDownLeft",keyframes:`@keyframes da-rotateInDownLeft{from{opacity:0;transform:rotate(-90deg)}${C}}`,initialStyle:D+";transform-origin:left bottom"},{name:"rotateInDownRight",keyframes:`@keyframes da-rotateInDownRight{from{opacity:0;transform:rotate(90deg)}${C}}`,initialStyle:D+";transform-origin:right bottom"}],te="opacity:0",ae=[{name:"blur",keyframes:"@keyframes da-blur{from{opacity:0;filter:blur(10px)}to{opacity:1;filter:blur(0)}}",initialStyle:te+";filter:blur(10px)"},{name:"clipReveal",keyframes:"@keyframes da-clipReveal{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0)}}",initialStyle:"clip-path:inset(0 100% 0 0)"},{name:"typewriter",keyframes:"@keyframes da-typewriter{from{max-width:0}to{max-width:100%}}",initialStyle:"max-width:0;overflow:hidden;white-space:nowrap"}],A=[...W,...G,...V,...J,...Q,...ee,...ae],ne=new Map;A.forEach(e=>ne.set(e.name,e));function oe(){return A.map(e=>e.keyframes).join("")}var j=["ease","ease-out-expo","ease-out-back","spring"],re={offset:.2,duration:1600,easing:"cubic-bezier(0.25,0.1,0.25,1)"},ie={ease:re.easing,"ease-out-expo":"cubic-bezier(0.16,1,0.3,1)","ease-out-back":"cubic-bezier(0.34,1.56,0.64,1)",spring:"cubic-bezier(0.175,0.885,0.32,1.275)"},se=[{label:"Fade",names:["fadeIn","fadeOut","fadeInUp","fadeInDown","fadeInLeft","fadeInRight"]},{label:"Slide",names:["slideInUp","slideInDown","slideInLeft","slideInRight"]},{label:"Zoom",names:["zoomIn","zoomOut","zoomInUp","zoomInDown"]},{label:"Bounce",names:["bounce","bounceIn","bounceInUp","bounceInDown"]},{label:"Attention",names:["shake","pulse","wobble","flip","swing","rubberBand"]},{label:"Rotate",names:["rotateIn","rotateInDownLeft","rotateInDownRight"]},{label:"Special",names:["blur","clipReveal","typewriter"]}],f=!1,i=null,R=null,n=null,o=null,l="",g="800ms",m=j[0],B=!1;function ce(){if(B)return;B=!0;const e=document.createElement("style");e.id="da-inspector-keyframes",e.textContent=oe(),document.head.appendChild(e)}function N(){const e=document.createElement("style");e.id="da-inspector-styles",e.textContent=`
    .da-inspector-toggle {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 2147483646;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: none;
      background: #18181b;
      color: #fff;
      font-size: 20px;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(0,0,0,.3);
      transition: transform .15s, background .15s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .da-inspector-toggle:hover { transform: scale(1.1); }
    .da-inspector-toggle[data-active="true"] { background: #2563eb; }

    .da-inspector-overlay {
      position: fixed;
      inset: 0;
      z-index: 2147483644;
      pointer-events: none;
    }

    .da-inspector-highlight {
      position: fixed;
      z-index: 2147483644;
      pointer-events: none;
      border: 2px solid #2563eb;
      border-radius: 4px;
      background: rgba(37,99,235,.08);
      transition: all .1s;
    }

    .da-inspector-selected {
      position: fixed;
      z-index: 2147483644;
      pointer-events: none;
      border: 2px solid #f59e0b;
      border-radius: 4px;
      background: rgba(245,158,11,.08);
    }

    .da-inspector-panel {
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 2147483647;
      width: 320px;
      max-height: calc(100vh - 32px);
      overflow-y: auto;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,.18);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 13px;
      color: #18181b;
      user-select: none;
    }

    .da-inspector-panel * { box-sizing: border-box; }

    .da-inspector-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-bottom: 1px solid #e4e4e7;
      font-weight: 600;
      font-size: 14px;
    }

    .da-inspector-close {
      border: none;
      background: none;
      font-size: 18px;
      cursor: pointer;
      color: #71717a;
      padding: 0 4px;
      line-height: 1;
    }
    .da-inspector-close:hover { color: #18181b; }

    .da-inspector-hint {
      padding: 16px;
      color: #71717a;
      text-align: center;
      line-height: 1.5;
    }

    .da-inspector-section {
      padding: 8px 16px;
    }

    .da-inspector-section-title {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #a1a1aa;
      margin-bottom: 6px;
    }

    .da-inspector-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .da-inspector-anim-btn {
      padding: 4px 8px;
      border: 1px solid #e4e4e7;
      border-radius: 6px;
      background: #fafafa;
      font-size: 12px;
      cursor: pointer;
      transition: all .1s;
      color: #18181b;
      line-height: 1.4;
      font-family: inherit;
    }
    .da-inspector-anim-btn:hover { background: #f0f0ff; border-color: #2563eb; }
    .da-inspector-anim-btn[data-selected="true"] {
      background: #2563eb;
      color: #fff;
      border-color: #2563eb;
    }

    .da-inspector-controls {
      padding: 8px 16px 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      border-top: 1px solid #e4e4e7;
    }

    .da-inspector-control {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .da-inspector-control label {
      font-size: 12px;
      font-weight: 500;
      min-width: 56px;
      color: #52525b;
    }

    .da-inspector-control select,
    .da-inspector-control input {
      flex: 1;
      padding: 4px 8px;
      border: 1px solid #e4e4e7;
      border-radius: 6px;
      font-size: 12px;
      background: #fafafa;
      color: #18181b;
      font-family: inherit;
    }

    .da-inspector-replay {
      width: 100%;
      padding: 6px;
      border: 1px solid #e4e4e7;
      border-radius: 6px;
      background: #fafafa;
      font-size: 12px;
      cursor: pointer;
      font-family: inherit;
      color: #18181b;
    }
    .da-inspector-replay:hover { background: #f0f0ff; border-color: #2563eb; }

    .da-inspector-code {
      padding: 8px 16px 16px;
      border-top: 1px solid #e4e4e7;
    }

    .da-inspector-code-title {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #a1a1aa;
      margin-bottom: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .da-inspector-copy {
      font-size: 11px;
      border: none;
      background: none;
      color: #2563eb;
      cursor: pointer;
      font-family: inherit;
      text-transform: none;
      letter-spacing: 0;
      font-weight: 500;
    }
    .da-inspector-copy:hover { text-decoration: underline; }

    .da-inspector-code pre {
      margin: 0;
      padding: 8px;
      background: #f4f4f5;
      border-radius: 6px;
      font-size: 11px;
      font-family: 'SF Mono', 'Fira Code', monospace;
      white-space: pre-wrap;
      word-break: break-all;
      line-height: 1.5;
      color: #18181b;
    }

    .da-inspector-tag { padding: 12px 16px; border-top: 1px solid #e4e4e7; }
    .da-inspector-tag-name {
      font-size: 12px;
      font-family: 'SF Mono', 'Fira Code', monospace;
      color: #2563eb;
      background: #eff6ff;
      padding: 2px 6px;
      border-radius: 4px;
    }

    @media (max-width: 400px) {
      .da-inspector-panel { width: calc(100vw - 32px); right: 16px; }
    }
  `,document.head.appendChild(e)}var s=null,c=null;function P(e,t){const r=t.getBoundingClientRect();e.style.left=r.left-2+"px",e.style.top=r.top-2+"px",e.style.width=r.width+4+"px",e.style.height=r.height+4+"px"}function le(e){s||(s=document.createElement("div"),s.className="da-inspector-highlight",document.body.appendChild(s)),P(s,e),s.style.display="block"}function T(){s&&(s.style.display="none")}function Y(e){c||(c=document.createElement("div"),c.className="da-inspector-selected",document.body.appendChild(c)),P(c,e),c.style.display="block"}function de(){c&&(c.style.display="none")}function pe(e){let t=e.tagName.toLowerCase();if(e.id&&(t+=`#${e.id}`),e.className&&typeof e.className=="string"){const r=e.className.split(/\s+/).filter(p=>!p.startsWith("da-inspector"));r.length&&(t+="."+r.slice(0,2).join("."))}return t}function X(e,t){if(ce(),!A.find(L=>L.name===t))return;const r=e.style.animation,p=e.style.opacity,x=e.style.transform,E=e.style.filter,u=e.style.clipPath;e.style.animation="none",e.offsetWidth;const a=ie[m]||m;e.style.animation=`da-${t} ${g} ${a} 0s 1 both`;const d=()=>{e.removeEventListener("animationend",d),setTimeout(()=>{e.style.animation=r,e.style.opacity=p,e.style.transform=x,e.style.filter=E,e.style.clipPath=u,i===e&&Y(e)},600)};e.addEventListener("animationend",d)}function fe(){if(!l)return"";let e=`data-anim="${l}"`;return g!=="800ms"&&(e+=` data-anim-duration="${g}"`),m!=="ease"&&(e+=` data-anim-easing="${m}"`),e}function b(){if(!n)return;if(!i){n.innerHTML=`
      <div class="da-inspector-header">
        <span>data-anim Inspector</span>
        <button class="da-inspector-close" title="Close">&times;</button>
      </div>
      <div class="da-inspector-hint">
        Click any element on the page<br>to select it and try animations.
      </div>
    `,n.querySelector(".da-inspector-close").addEventListener("click",S);return}const e=pe(i),t=fe();let r=`
    <div class="da-inspector-header">
      <span>data-anim Inspector</span>
      <button class="da-inspector-close" title="Close">&times;</button>
    </div>
    <div class="da-inspector-tag">
      <span class="da-inspector-tag-name">&lt;${e}&gt;</span>
    </div>
  `;for(const a of se)r+=`
      <div class="da-inspector-section">
        <div class="da-inspector-section-title">${a.label}</div>
        <div class="da-inspector-grid">
          ${a.names.map(d=>`<button class="da-inspector-anim-btn" data-anim-name="${d}" data-selected="${d===l}">${d}</button>`).join("")}
        </div>
      </div>
    `;r+=`
    <div class="da-inspector-controls">
      <div class="da-inspector-control">
        <label>Duration</label>
        <select class="da-inspector-dur">
          ${["400ms","600ms","800ms","1000ms","1200ms","1600ms","2000ms"].map(a=>`<option value="${a}" ${a===g?"selected":""}>${a}</option>`).join("")}
        </select>
      </div>
      <div class="da-inspector-control">
        <label>Easing</label>
        <select class="da-inspector-ease">
          ${j.map(a=>`<option value="${a}" ${a===m?"selected":""}>${a}</option>`).join("")}
        </select>
      </div>
      <button class="da-inspector-replay" ${l?"":"disabled"}>Replay Animation</button>
    </div>
  `,t&&(r+=`
      <div class="da-inspector-code">
        <div class="da-inspector-code-title">
          <span>HTML Attributes</span>
          <button class="da-inspector-copy">Copy</button>
        </div>
        <pre>${me(t)}</pre>
      </div>
    `),n.innerHTML=r,n.querySelector(".da-inspector-close").addEventListener("click",S),n.querySelectorAll(".da-inspector-anim-btn").forEach(a=>{a.addEventListener("click",d=>{d.stopPropagation();const L=a.dataset.animName;l=L,i&&X(i,L),b()})});const p=n.querySelector(".da-inspector-dur");p&&p.addEventListener("change",()=>{g=p.value,b()});const x=n.querySelector(".da-inspector-ease");x&&x.addEventListener("change",()=>{m=x.value,b()});const E=n.querySelector(".da-inspector-replay");E&&E.addEventListener("click",a=>{a.stopPropagation(),i&&l&&X(i,l)});const u=n.querySelector(".da-inspector-copy");u&&u.addEventListener("click",a=>{a.stopPropagation(),navigator.clipboard.writeText(t).then(()=>{u.textContent="Copied!",setTimeout(()=>{u.textContent="Copy"},1500)})})}function me(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function q(e){return!e||!(e instanceof HTMLElement)?!1:!!(e.closest(".da-inspector-panel")||e.closest(".da-inspector-toggle")||e.classList.contains("da-inspector-highlight")||e.classList.contains("da-inspector-selected"))}function F(e){if(q(e.target)){T();return}const t=e.target;t!==R&&(R=t,le(t))}function H(e){if(q(e.target))return;e.preventDefault(),e.stopPropagation();const t=e.target;i=t,l="",T(),Y(t),b()}function _(){i&&Y(i)}function O(){f||(f=!0,document.getElementById("da-inspector-styles")||N(),o&&(o.dataset.active="true"),n=document.createElement("div"),n.className="da-inspector-panel",document.body.appendChild(n),b(),document.addEventListener("mousemove",F,!0),document.addEventListener("click",H,!0),window.addEventListener("scroll",_,!0))}function S(){f&&(f=!1,i=null,R=null,l="",o&&(o.dataset.active="false"),document.removeEventListener("mousemove",F,!0),document.removeEventListener("click",H,!0),window.removeEventListener("scroll",_,!0),n&&(n.remove(),n=null),T(),de())}function ue(){S(),o&&(o.remove(),o=null),s&&(s.remove(),s=null),c&&(c.remove(),c=null),document.getElementById("da-inspector-styles")?.remove(),document.getElementById("da-inspector-keyframes")?.remove(),B=!1}function ye(){return f}function K(){N(),o=document.createElement("button"),o.className="da-inspector-toggle",o.dataset.active="false",o.innerHTML='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',o.title="data-anim Inspector",o.addEventListener("click",()=>{f?S():O()}),document.body.appendChild(o)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",K,{once:!0}):K();var M=window;M.__daInspectorLoaded||(M.__daInspectorLoaded=!0,O(),chrome.runtime.onMessage.addListener(e=>{e.type==="da-inspector-toggle"&&(ye()?(ue(),M.__daInspectorLoaded=!1):O())}))})();
