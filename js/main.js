/* main.js — handles nav, mobile menu, theme, slider, projects, form (Formspree) */
(function(){
  /* utility */
  const $ = q => document.querySelector(q);
  const $$ = q => document.querySelectorAll(q);

  /* year */
  const yr = new Date().getFullYear();
  ['#year','#year2','#year3'].forEach(id => {
    const el = document.querySelector(id);
    if(el) el.textContent = yr;
  });

  /* mobile menu toggle */
  const menuBtns = $$('.menu-btn');
  menuBtns.forEach(btn => {
    btn.addEventListener('click', ()=>{
      const nav = btn.previousElementSibling; // nav is placed before menuBtn
      if(nav){
        nav.style.display = (nav.style.display === 'flex') ? 'none' : 'flex';
      }
    });
  });

  /* theme toggle (persist) */
  const applyTheme = (dark) => {
    if(dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('dark', dark ? '1':'0');
  };
  const themeButtons = $$('.btn.small');
  themeButtons.forEach(b => b.addEventListener('click', ()=>{
    const dark = !document.documentElement.classList.contains('dark');
    applyTheme(dark);
    themeButtons.forEach(x => x.textContent = dark ? 'Light':'Dark');
  }));
  // initialize
  if(localStorage.getItem('dark') === '1') applyTheme(true);

  /* populate projects (demo) */
  const projects = [
    {title:'SafeT - Alerts System', text:'USSD & SMS alert prototype for faster community response.'},
    {title:'BookME', text:'React Native book search + download with optimized file handling.'},
    {title:'GoPrivacy', text:'Metadata stripper for images and documents (Go).'}
  ];
  const grid = $('#projectGrid');
  if(grid){
    projects.forEach(p => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.innerHTML = `<h4>${p.title}</h4><p style="margin-top:.5rem">${p.text}</p>`;
      grid.appendChild(card);
    });
  }

  /* simple carousel */
  const carousel = $('#carousel');
  if(carousel){
    const slidesWrap = carousel.querySelector('.slides');
    const slides = carousel.querySelectorAll('.slide');
    let idx = 0, total = slides.length;
    const update = ()=>{
      slidesWrap.style.transform = `translateX(-${idx*100}%)`;
    };
    $('#next').addEventListener('click', ()=>{ idx=(idx+1)%total; update(); });
    $('#prev').addEventListener('click', ()=>{ idx=(idx-1+total)%total; update(); });
    // auto
    let auto = setInterval(()=>{ idx=(idx+1)%total; update(); }, 4500);
    carousel.addEventListener('mouseenter', ()=>clearInterval(auto));
    carousel.addEventListener('mouseleave', ()=> auto = setInterval(()=>{ idx=(idx+1)%total; update(); }, 4500));
  }

  /* contact form: client-side validation + submit to Formspree via fetch */
  const contactForm = $('#contactForm');
  if(contactForm){
    const statusEl = $('#formStatus');
    contactForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      statusEl.textContent = '';
      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();

      if(!name || !email || !message){
        statusEl.textContent = 'All fields required';
        statusEl.style.color = 'crimson';
        return;
      }

      // Basic email pattern
      if(!/^\S+@\S+\.\S+$/.test(email)){
        statusEl.textContent = 'Enter a valid email';
        statusEl.style.color = 'crimson';
        return;
      }

      statusEl.textContent = 'Sending...';
      statusEl.style.color = 'inherit';

      try {
        // ---- REPLACE this endpoint with your Formspree endpoint ----
        // Sign up at https://formspree.io and get an endpoint like:
        // https://formspree.io/f/yourFormId
        const FORM_ENDPOINT = 'https://formspree.io/f/yourFormId';
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: {'Content-Type':'application/json','Accept':'application/json'},
          body: JSON.stringify({name, email, message})
        });
        if(res.ok){
          statusEl.textContent = 'Message sent — I will reply soon.';
          statusEl.style.color = 'green';
          contactForm.reset();
        } else {
          const data = await res.json().catch(()=>({ok:false}));
          statusEl.textContent = data?.error || 'Error sending message';
          statusEl.style.color = 'crimson';
        }
      } catch(err){
        statusEl.textContent = 'Network error — try again later';
        statusEl.style.color = 'crimson';
      }
    });
  }

  /* Accessibility: highlight active nav link */
  document.querySelectorAll('.nav-link').forEach(a => {
    if(a.href === location.href || (a.getAttribute('href') === location.pathname)){
      a.classList.add('active');
    }
  });

})();
