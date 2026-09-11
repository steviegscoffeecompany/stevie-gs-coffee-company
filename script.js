async function getJSON(path){ const r=await fetch(path,{cache:"no-store"}); if(!r.ok) throw new Error(path); return r.json(); }
const $=id=>document.getElementById(id);
function setText(id,val){ const el=$(id); if(el) el.textContent=val||""; }
function link(id,text,href){ const el=$(id); if(!el)return; el.textContent=text||""; el.href=href||"#"; }

async function load(){
  const [site,menu]=await Promise.all([getJSON("site.json"),getJSON("menu.json")]);
  setText("hero-text",site.hero_text);
  const tag=$("tagline");
  if(tag){ const parts=(site.tagline||"").split(". "); tag.innerHTML=parts.length>1 ? `${parts[0]}.<br><em>${parts.slice(1).join(". ")}</em>` : site.tagline; }
  setText("hours-short",site.hours);
  setText("about-title",site.about_title); setText("about-1",site.about_text_1); setText("about-2",site.about_text_2);
  setText("address",site.address); setText("hours",site.hours); setText("sunday",site.sunday); setText("phone",site.phone);
  link("email-link",site.email,`mailto:${site.email}`); link("contact-email",site.email,`mailto:${site.email}`);
  $("email-button").href=`mailto:${site.email}`; $("maps-link").href=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address)}`;
  setText("footer-address",site.address); setText("footer-hours",site.hours);
  setText("hours-large",(site.hours||"").replace(" · ","\n"));
  if(site.featured_photo){ $("hero-photo").src=site.featured_photo; $("hero-photo").style.borderRadius="28px"; }
  if(site.order_online){ $("order-button").href=site.order_online; $("order-button").classList.remove("hidden"); }

  const social=$("social-links");
  [["Instagram",site.instagram],["Facebook",site.facebook]].forEach(([name,url])=>{ if(url){ const a=document.createElement("a");a.href=url;a.target="_blank";a.rel="noopener";a.textContent=name;social.appendChild(a);} });

  setText("menu-intro",menu.intro);
  const sections=$("menu-sections");
  (menu.sections||[]).forEach(sec=>{
    const box=document.createElement("article"); box.className="menu-box";
    const h=document.createElement("h3"); h.textContent=sec.name; box.appendChild(h);
    if(!sec.items?.length){ const p=document.createElement("p");p.className="empty-note";p.textContent="Items and prices coming soon.";box.appendChild(p); }
    else sec.items.forEach(item=>{
      const row=document.createElement("div");row.className="menu-item";
      const left=document.createElement("div"); const strong=document.createElement("strong");strong.textContent=item.name;left.appendChild(strong);
      if(item.description){const small=document.createElement("small");small.textContent=item.description;left.appendChild(small);}
      const price=document.createElement("strong");price.textContent=item.price||"";
      row.append(left,price);box.appendChild(row);
    });
    sections.appendChild(box);
  });

  const gallery=$("gallery-grid");
  if(site.gallery?.length){
    site.gallery.forEach(item=>{ const img=document.createElement("img");img.src=item.image;img.alt=item.alt||"Stevie G's Coffee Company";gallery.appendChild(img);});
  } else {
    const empty=document.createElement("div");empty.className="gallery-empty";empty.innerHTML="<strong>Your photos will show up here.</strong><p>Use the editor to upload shop, drink and food photos whenever you're ready.</p>";gallery.appendChild(empty);
  }
}
load().catch(console.error);

const toggle=document.querySelector(".menu-toggle"),nav=document.querySelector(".site-nav");
toggle?.addEventListener("click",()=>{const o=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",o)});
nav?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));

const dealsPopup=$("deals-popup"),dealsTab=$("deals-tab"),dealsClose=$("deals-close"),dealsForm=$("deals-form");
let dealsLastFocus=null;
function openDeals(){
  if(!dealsPopup)return;
  dealsLastFocus=document.activeElement;dealsPopup.hidden=false;document.body.classList.add("deals-lock");dealsTab?.setAttribute("aria-expanded","true");
  window.setTimeout(()=>$('deals-email')?.focus(),50);
}
function closeDeals(){
  if(!dealsPopup)return;
  dealsPopup.hidden=true;document.body.classList.remove("deals-lock");dealsTab?.setAttribute("aria-expanded","false");
  try{localStorage.setItem("stevie-gs-perks-seen",Date.now().toString())}catch{}
  dealsLastFocus?.focus?.();
}
dealsTab?.addEventListener("click",openDeals);dealsClose?.addEventListener("click",closeDeals);$("deals-done")?.addEventListener("click",closeDeals);
dealsPopup?.addEventListener("click",event=>{if(event.target===dealsPopup)closeDeals()});
document.addEventListener("keydown",event=>{if(event.key==="Escape"&&!dealsPopup?.hidden)closeDeals()});
window.setTimeout(()=>{
  let recentlySeen=false;try{const seen=Number(localStorage.getItem("stevie-gs-perks-seen"));recentlySeen=seen>0&&Date.now()-seen<7*24*60*60*1000}catch{}
  if(!recentlySeen&&dealsPopup?.hidden)openDeals();
},6500);

dealsForm?.addEventListener("submit",async event=>{
  event.preventDefault();
  const email=$("deals-email"),phone=$("deals-phone"),consent=$("deals-consent"),error=$("deals-error"),button=dealsForm.querySelector("button[type=submit]");
  error.hidden=true;
  if(!email.value.trim()&&!phone.value.trim()){error.textContent="Please enter an email address or phone number.";error.hidden=false;email.focus();return}
  if(email.value&&!email.validity.valid){error.textContent="Please enter a valid email address.";error.hidden=false;email.focus();return}
  if(!consent.checked){error.textContent="Please confirm that you'd like to receive Stevie G's updates.";error.hidden=false;consent.focus();return}
  button.disabled=true;button.textContent="Joining…";
  try{
    const response=await fetch("/",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams(new FormData(dealsForm)).toString()});
    if(!response.ok)throw new Error("Submission failed");
    dealsForm.hidden=true;$("deals-success").hidden=false;try{localStorage.setItem("stevie-gs-perks-seen",Date.now().toString())}catch{}$("deals-done")?.focus();
  }catch{
    error.textContent="We couldn't add you just now. Please try again in a moment.";error.hidden=false;button.disabled=false;button.textContent="Keep me in the loop";
  }
});
