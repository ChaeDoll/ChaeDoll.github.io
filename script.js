// Smooth scrolling navigation
document.querySelectorAll('a[href^="#"]:not(.skip-link)').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
                block: 'start'
            });
        }
    });
});

// Active navigation link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe contact items
document.querySelectorAll('.contact-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(item);
});

// Publication tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
    const panel = document.getElementById(btn.dataset.target);
    const count = btn.querySelector('.tab-count');
    if (panel && count) {
        count.textContent = panel.querySelectorAll('.item').length;
    }
});

const tabs = Array.from(document.querySelectorAll('.tab-btn'));

function activateTab(btn, focus) {
    tabs.forEach(b => {
        const active = b === btn;
        b.classList.toggle('active', active);
        b.setAttribute('aria-selected', active ? 'true' : 'false');
        b.tabIndex = active ? 0 : -1;
    });
    document.querySelectorAll('.tab-panel').forEach(p => {
        p.classList.toggle('active', p.id === btn.dataset.target);
    });
    if (focus) btn.focus();
}

tabs.forEach((btn, i) => {
    btn.addEventListener('click', () => activateTab(btn, false));
    btn.addEventListener('keydown', e => {
        let next = null;
        if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
        else if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === 'Home') next = tabs[0];
        else if (e.key === 'End') next = tabs[tabs.length - 1];
        if (next) {
            e.preventDefault();
            activateTab(next, true);
        }
    });
});

// Language toggle (EN default, KR swaps in data-ko text)
function setLang(lang) {
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-ko]').forEach(el => {
        if (!el.hasAttribute('data-en')) {
            el.setAttribute('data-en', el.innerHTML);
        }
        el.innerHTML = lang === 'ko' ? el.getAttribute('data-ko') : el.getAttribute('data-en');
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
        const active = btn.dataset.lang === lang;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    try {
        localStorage.setItem('lang', lang);
    } catch (e) {}
}

document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
});

let savedLang = 'en';
try {
    savedLang = localStorage.getItem('lang') === 'ko' ? 'ko' : 'en';
} catch (e) {}
if (savedLang === 'ko') setLang('ko');

// Subtle divider where the year changes within a publication list
document.querySelectorAll('#publications .item-list').forEach(list => {
    let prevYear = null;
    list.querySelectorAll(':scope > .item').forEach(item => {
        const date = item.querySelector('.item-date');
        const year = date ? date.textContent.trim().slice(0, 4) : null;
        if (prevYear && year && year !== prevYear) {
            item.classList.add('year-start');
        }
        prevYear = year;
    });
});


// Email: tap/click (or Enter/Space) to open, tap elsewhere or Esc to close
const emailItem = document.querySelector('.email-item');
if (emailItem) {
    const tooltip = emailItem.querySelector('.email-tooltip');
    const setEmailOpen = open => {
        emailItem.classList.toggle('open', open);
        emailItem.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    emailItem.addEventListener('click', e => {
        if (tooltip.contains(e.target)) return;
        setEmailOpen(!emailItem.classList.contains('open'));
    });
    emailItem.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setEmailOpen(!emailItem.classList.contains('open'));
        }
    });
    document.addEventListener('click', e => {
        if (!emailItem.contains(e.target)) setEmailOpen(false);
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') setEmailOpen(false);
    });
}
