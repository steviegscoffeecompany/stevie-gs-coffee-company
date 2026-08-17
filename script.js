async function getJSON(path){ const r=await fetch(path,{cache:"no-store"}); if(!r.ok) throw new Error(path); return r.json(); }
const $=id=>document.getElementById(id);
function setText(id,val){ const el=$(id); if(el) el.textContent=val||""; }
function link(id,text,href){ const el=$(id); if(!el)return; el.textContent=text||""; el.href=href||"#"; }

async function load(){
  const [site,menu]=await Promise.all([getJSON("content/site.json"),getJSON("content/menu.json")]);
  setText("hero-text",site.hero_text);
  const tag=$("tagline");
  if(tag){ const parts=(site.tagline||"").split(". "); tag.innerHTML=parts.length>1 ? `${parts[0]}.<br><em>${parts.slice(1).join(". ")}</em>` : site.tagline; }
  setText("hours-short",site.hours);
  setText("about-title",site.about_title); setText("about-1",site.about_text_1); setText("about-2",site.about_text_2);
  setText("address",site.address); setText("hours",site.hours); setText("sunday",site.sunday);
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