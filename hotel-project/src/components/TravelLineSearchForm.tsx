// src/components/TravelLineSearchForm.tsx
import React, { useEffect } from 'react';
import './styles/TravelLineSearchForm.css';

const TravelLineSearchForm = ({ id }: { id: string }) => {
  const searchFormUniqueId = `tl-search-form-${id}`;

  const headScriptBody = (w: any, q: any) => {
    const h = [
      'ru-ibe.tlintegration.ru',
      'ibe.tlintegration.ru',
      'ibe.tlintegration.com',
    ];

    const t = (w.travelline = w.travelline || {});
    const ti = (t.integration = t.integration || {});
    ti.__cq = ti.__cq ? ti.__cq.concat(q) : q;
    if (!ti.__loader) {
      ti.__loader = true;
      const d = w.document;
      const c = d.getElementsByTagName('head')[0] || d.getElementsByTagName('body')[0];

      function e(s: any, f: any) {
        return function () {
          w.TL || (() => {
            c.removeChild(s);
            f();
          })();
        };
      }

      (function l(hosts: string[]) {
        if (0 === hosts.length) return;
        const s = d.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = 'https://' + hosts[0] + '/integration/loader.js';
        s.onerror = s.onload = e(s, function () {
          l(hosts.slice(1, hosts.length));
        });
        c.appendChild(s);
      })(h);
    }
  };

  const headScript = (w: Window) => {
    const q = [
      ['setContext', 'TL-INT-putvina-rf_2025-09-10', 'ru'],
      ['embed', 'search-form', {
        container: searchFormUniqueId,
        theme: {
          primaryColor: '#C7774D',
          buttonColor: '#C7774D',
          textColor: '#19312F',
          backgroundColor: '#F5F2EA',
          fontFamily: 'Manrope, sans-serif'
        }
      }],
    ];
    headScriptBody(w, q);
  };

  useEffect(() => {
    headScript(window);

    // Dynamic MutationObserver to catch any lazily loaded burgundy elements or inline styles
    const applyCustomTheme = () => {
      const containers = document.querySelectorAll(`#block-search, #${searchFormUniqueId}, [class*="tl-"]`);
      containers.forEach((container: any) => {
        // Buttons
        const buttons = container.querySelectorAll('button, [type="submit"], [role="button"], [class*="submit"], [class*="btn"], [class*="sf-btn"]');
        buttons.forEach((btn: any) => {
          btn.style.setProperty('background', '#C7774D', 'important');
          btn.style.setProperty('background-color', '#C7774D', 'important');
          btn.style.setProperty('border-color', '#C7774D', 'important');
          btn.style.setProperty('color', '#F5F2EA', 'important');
          btn.style.setProperty('font-family', "'Cormorant Garamond', Georgia, serif", 'important');
          btn.style.setProperty('font-weight', '600', 'important');
        });

        // Field icons (calendar, guests, clock)
        const icons = container.querySelectorAll('svg, path, rect, circle, use, [class*="icon"]');
        icons.forEach((icon: any) => {
          if (icon.closest('button, [type="submit"], [role="button"], [class*="btn"]')) {
            icon.style.setProperty('fill', '#F5F2EA', 'important');
            icon.style.setProperty('color', '#F5F2EA', 'important');
          } else {
            icon.style.setProperty('fill', '#1F4D4A', 'important');
            icon.style.setProperty('stroke', '#1F4D4A', 'important');
            icon.style.setProperty('color', '#1F4D4A', 'important');
          }
        });
      });
    };

    const observer = new MutationObserver(() => {
      applyCustomTheme();
    });

    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    applyCustomTheme();

    // Run periodically for 5 seconds after mount to catch async script injection
    const timer = setInterval(applyCustomTheme, 300);
    setTimeout(() => clearInterval(timer), 6000);

    return () => {
      observer.disconnect();
      clearInterval(timer);
    };
  }, [searchFormUniqueId]);

  const styles = `
    /* CSS Variables for TravelLine */
    :root, body, #block-search, [id*="tl-"] {
      --tl-primary-color: #C7774D !important;
      --tl-color-primary: #C7774D !important;
      --tl-primary: #C7774D !important;
      --tl-bg-primary: #C7774D !important;
      --tl-accent-color: #C7774D !important;
      --tl-accent: #C7774D !important;
      --tl-button-bg: #C7774D !important;
      --tl-button-background: #C7774D !important;
      --tl-button-color: #F5F2EA !important;
      --tl-icon-color: #1F4D4A !important;
      --tl-text-color: #19312F !important;
      --tl-font-family: 'Manrope', sans-serif !important;
    }

    #block-search,
    #block-search *,
    [id*="tl-search-form"],
    [id*="tl-search-form"] * {
      box-sizing: border-box !important;
      font-family: 'Manrope', system-ui, -apple-system, sans-serif !important;
    }

    #block-search {
      background-color: #F5F2EA !important;
      border: 1px solid rgba(25, 49, 47, 0.14) !important;
      border-radius: 16px !important;
      box-shadow: 0 12px 32px rgba(25, 49, 47, 0.08) !important;
      color: #19312F !important;
      margin: 0 auto !important;
      max-width: 1200px !important;
      padding: 12px 20px !important;
      transition: all 0.2s ease-in-out;
    }

    #block-search.block-search--mobile {
      border: 1px solid rgba(25, 49, 47, 0.18) !important;
      box-shadow: 0 8px 24px rgba(25, 49, 47, 0.12) !important;
      background-color: #F5F2EA !important;
    }

    .tl-container {
      padding: 8px 12px !important;
      background: transparent !important;
    }

    /* Titles, Labels, Headers */
    #block-search label,
    #block-search h1, #block-search h2, #block-search h3, #block-search h4,
    #block-search [class*="header"],
    #block-search [class*="title"],
    #block-search .tl-label,
    #block-search .tl-field-label,
    #block-search .tl-caption,
    [class*="tl-"] label,
    [class*="tl-"] .tl-label {
      color: #1F4D4A !important;
      font-family: 'Manrope', sans-serif !important;
      font-weight: 600 !important;
      letter-spacing: 0.03em !important;
    }

    #block-search h1, #block-search h2, #block-search h3,
    #block-search [class*="title"], #block-search [class*="header"] {
      font-family: 'Cormorant Garamond', Georgia, serif !important;
      color: #19312F !important;
    }

    /* Inputs, Selects, Values */
    #block-search input,
    #block-search select,
    #block-search [class*="input"],
    #block-search [class*="select"],
    #block-search [class*="control"],
    #block-search [class*="field-value"],
    #block-search [class*="value"],
    [class*="tl-"] input,
    [class*="tl-"] select {
      background-color: #FFFFFF !important;
      border: 1px solid rgba(25, 49, 47, 0.20) !important;
      border-radius: 8px !important;
      color: #19312F !important;
      font-family: 'Manrope', sans-serif !important;
      font-size: 14px !important;
      font-weight: 500 !important;
      padding: 8px 12px !important;
      outline: none !important;
      transition: border-color 0.15s ease, box-shadow 0.15s ease !important;
    }

    #block-search input:focus,
    #block-search select:focus,
    #block-search input:active,
    #block-search select:active,
    [class*="tl-"] input:focus,
    [class*="tl-"] select:focus {
      border-color: #C7774D !important;
      box-shadow: 0 0 0 3px rgba(199, 119, 77, 0.18) !important;
    }

    /* Universal Button Styling (overrides burgundy/maroon) */
    #block-search button,
    #block-search [type="submit"],
    #block-search [role="button"],
    #block-search [class*="btn"],
    #block-search [class*="button"],
    #block-search [class*="submit"],
    [id*="tl-"] button,
    [id*="tl-"] [type="submit"],
    [id*="tl-"] [role="button"],
    [id*="tl-"] [class*="btn"],
    [id*="tl-"] [class*="button"],
    [id*="tl-"] [class*="submit"],
    .tl-container button,
    .tl-container [type="submit"] {
      background: #C7774D !important;
      background-color: #C7774D !important;
      border: 1px solid #C7774D !important;
      border-radius: 8px !important;
      color: #F5F2EA !important;
      cursor: pointer !important;
      font-family: 'Cormorant Garamond', Georgia, serif !important;
      font-size: 17px !important;
      font-weight: 600 !important;
      letter-spacing: 0.03em !important;
      padding: 10px 24px !important;
      min-height: 44px !important;
      transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease !important;
      box-shadow: 0 4px 12px rgba(199, 119, 77, 0.22) !important;
    }

    #block-search button:hover,
    #block-search [type="submit"]:hover,
    [id*="tl-"] button:hover,
    [id*="tl-"] [type="submit"]:hover {
      background: #b2643c !important;
      background-color: #b2643c !important;
      border-color: #b2643c !important;
      color: #FFFFFF !important;
      box-shadow: 0 6px 16px rgba(199, 119, 77, 0.32) !important;
    }

    #block-search button:active,
    #block-search [type="submit"]:active,
    [id*="tl-"] button:active,
    [id*="tl-"] [type="submit"]:active {
      background: #9e5531 !important;
      background-color: #9e5531 !important;
      transform: translateY(1px) !important;
    }

    /* Field Icons Override (Deep Green) */
    #block-search svg,
    #block-search svg *,
    #block-search path,
    #block-search rect,
    #block-search circle,
    #block-search use,
    #block-search [class*="icon"],
    #block-search [class*="icon"] *,
    [id*="tl-"] svg,
    [id*="tl-"] svg *,
    [id*="tl-"] path,
    [id*="tl-"] rect,
    [id*="tl-"] circle,
    [id*="tl-"] use,
    [id*="tl-"] [class*="icon"],
    [id*="tl-"] [class*="icon"] * {
      fill: #1F4D4A !important;
      stroke: #1F4D4A !important;
      color: #1F4D4A !important;
    }

    /* Button Icons Override (Sand/White) */
    #block-search button svg,
    #block-search button svg *,
    #block-search button path,
    #block-search [type="submit"] svg,
    #block-search [type="submit"] svg *,
    #block-search [type="submit"] path,
    [id*="tl-"] button svg,
    [id*="tl-"] button svg *,
    [id*="tl-"] button path {
      fill: #F5F2EA !important;
      stroke: #F5F2EA !important;
      color: #F5F2EA !important;
    }

    /* Calendar Datepicker & Dropdown Popovers */
    .tl-popover,
    .tl-datepicker,
    .tl-calendar,
    .tl-dropdown,
    [class*="tl-popover"],
    [class*="tl-datepicker"] {
      background-color: #FFFFFF !important;
      border: 1px solid rgba(25, 49, 47, 0.16) !important;
      border-radius: 12px !important;
      box-shadow: 0 16px 40px rgba(25, 49, 47, 0.14) !important;
      font-family: 'Manrope', sans-serif !important;
      color: #19312F !important;
    }

    .tl-datepicker .tl-cell-selected,
    .tl-datepicker .tl-day-selected,
    .tl-calendar .tl-cell-active,
    [class*="tl-"] .tl-selected {
      background-color: #C7774D !important;
      color: #FFFFFF !important;
      border-radius: 6px !important;
    }

    .tl-datepicker .tl-cell:hover,
    .tl-calendar .tl-day:hover {
      background-color: rgba(199, 119, 77, 0.15) !important;
      color: #19312F !important;
      border-radius: 6px !important;
    }

    #block-search a,
    .tl-container a {
      color: rgba(25, 49, 47, 0.5) !important;
      font-family: 'Manrope', sans-serif !important;
      font-size: 11px !important;
      text-decoration: none !important;
      transition: color 0.15s ease !important;
    }

    #block-search a:hover,
    .tl-container a:hover {
      color: #C7774D !important;
      text-decoration: underline !important;
    }

    @media (max-width: 640px) { .tl-container { padding: 8px !important; } }
  `;

  return (
    <>
      <style>{styles}</style>
      <div id="block-search">
        <div id={searchFormUniqueId} className="tl-container">
          <a
            href="https://www.travelline.ru/products/tl-hotel/"
            rel="nofollow noreferrer"
            target="_blank"
          >
            TravelLine
          </a>
        </div>
      </div>
    </>
  );
};

export default TravelLineSearchForm;
