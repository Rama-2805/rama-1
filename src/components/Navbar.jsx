import React, { useState, useEffect } from 'react';
import { Shield, Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'hero', label: 'Home' },
  { id: 'digital-twin', label: 'Digital Twin' },
  { id: 'live-sensor', label: 'Live Sensor' },
  { id: 'dataset', label: 'Intelligence' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'factory', label: 'Factory' },
  { id: 'advisor', label: 'AI Advisor' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <>
      <nav style={{
        ...styles.nav,
        background: scrolled ? 'rgba(10, 14, 23, 0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(56,72,104,0.2)' : '1px solid transparent',
      }}>
        <div style={styles.inner}>
          <div style={styles.brand} onClick={() => scrollTo('hero')}>
            <Shield size={22} color="#06b6d4" />
            <span style={styles.brandText}>Factory<span style={{ color: '#06b6d4' }}>Shield</span></span>
          </div>
          <div style={styles.links}>
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                style={styles.link}
                onClick={() => scrollTo(item.id)}
                onMouseEnter={e => { e.target.style.color = '#06b6d4'; }}
                onMouseLeave={e => { e.target.style.color = '#94a3b8'; }}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button 
            style={styles.cta}
            onMouseEnter={e => { e.target.style.boxShadow = '0 6px 30px rgba(6,182,212,0.45)'; }}
            onMouseLeave={e => { e.target.style.boxShadow = '0 4px 20px rgba(6,182,212,0.25)'; }}
          >
            Launch Demo
          </button>
          <button style={styles.menuBtn} onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>
      {mobileOpen && (
        <div style={styles.mobileMenu}>
          {NAV_ITEMS.map(item => (
            <button key={item.id} style={styles.mobileLink} onClick={() => scrollTo(item.id)}>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

const styles = {
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, height: 64, zIndex: 1000,
    transition: 'all 0.3s ease',
  },
  inner: {
    maxWidth: 1280, margin: '0 auto', padding: '0 32px', height: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  brand: {
    display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
  },
  brandText: {
    fontSize: '1.1rem', fontWeight: 700, color: '#e2e8f0',
  },
  links: {
    display: 'flex', gap: 4,
    '@media (max-width: 768px)': { display: 'none' },
  },
  link: {
    background: 'none', border: 'none', color: '#94a3b8',
    fontSize: '0.85rem', fontWeight: 500, padding: '8px 14px',
    borderRadius: 8, transition: 'color 0.2s',
    fontFamily: "'Inter', sans-serif",
  },
  cta: {
    background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    color: '#fff', border: 'none', padding: '8px 20px',
    borderRadius: 8, fontSize: '0.85rem', fontWeight: 600,
    boxShadow: '0 4px 20px rgba(6,182,212,0.25)',
    transition: 'all 0.3s ease',
    fontFamily: "'Inter', sans-serif",
  },
  menuBtn: {
    display: 'none', background: 'none', border: 'none', color: '#e2e8f0',
    padding: 8,
  },
  mobileMenu: {
    position: 'fixed', top: 64, left: 0, right: 0, background: 'rgba(10,14,23,0.95)',
    backdropFilter: 'blur(20px)', zIndex: 999, padding: '16px 32px',
    borderBottom: '1px solid rgba(56,72,104,0.2)',
    display: 'flex', flexDirection: 'column', gap: 4,
  },
  mobileLink: {
    background: 'none', border: 'none', color: '#94a3b8',
    fontSize: '0.95rem', fontWeight: 500, padding: '12px 0',
    textAlign: 'left', fontFamily: "'Inter', sans-serif",
  },
};

// Override for mobile
if (typeof window !== 'undefined' && window.innerWidth <= 768) {
  styles.links.display = 'none';
  styles.menuBtn.display = 'block';
  styles.cta.display = 'none';
}

export default Navbar;
