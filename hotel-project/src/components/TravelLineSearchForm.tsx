// src/components/TravelLineSearchForm.tsx
import React, {useEffect} from 'react';
import './styles/TravelLineSearchForm.css';

const TravelLineSearchForm = ({id}: {id: string}) => {
    /**
     * Для каждого блока с формой необходим уникальный ID,
     * если необходимо разместить несколько форм на одной странице.
     * ID может быть любым.
     */
    const searchFormUniqueId = `tl-search-form-${id}`;

    const headScriptBody = (w, q) => {
        var h = [
            'ru-ibe.tlintegration.ru',
            'ibe.tlintegration.ru',
            'ibe.tlintegration.com',
        ];

        var t = (w.travelline = w.travelline || {}),
            ti = (t.integration = t.integration || {});
        ti.__cq = ti.__cq ? ti.__cq.concat(q) : q;
        if (!ti.__loader) {
            ti.__loader = true;
            var d = w.document,
                c =
                    d.getElementsByTagName('head')[0] || d.getElementsByTagName('body')[0];

            function e(s, f) {
                return function () {
                    w.TL || (() => {
                        c.removeChild(s);
                        f();
                    })();
                }
            }

            (function l(h) {
                if (0 === h.length) return;
                var s = d.createElement('script');
                s.type = 'text/javascript';
                s.async = !0;
                s.src = 'https://' + h[0] + '/integration/loader.js';
                s.onerror = s.onload = e(s, function () {
                    l(h.slice(1, h.length));
                });
                c.appendChild(s);
            })(h);
        }
    };

    const headScript = (w: Window) => {
        const q = [
            ['setContext', 'TL-INT-putvina-rf_2025-09-10', 'ru'],
            ['embed', 'search-form', {container: searchFormUniqueId}],
        ];
        headScriptBody(w, q);
    };

    useEffect(() => {
        headScript(window);
    }, []);


  const styles = `
    #block-search,
    #block-search * {
      box-sizing: border-box;
    }
    #block-search {
      background-color: #fff;
      width: 100%;
      max-width: 1000px;
      margin: 0 auto;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(25,49,47,.10);
      color: #19312F;
    }
    #block-search.block-search--mobile {
      border: 1px solid #e0e0e0;
      box-shadow: 0 0 30px 0 #0000001a;
    }
    .tl-container {
      padding: 20px 28px;
    }
    #block-search input, #block-search select { border-color: rgba(25,49,47,.18) !important; border-radius: 2px !important; color: #19312F !important; font-family: Manrope, sans-serif !important; }
    #block-search button, #block-search [type=submit] { background: transparent !important; border: 1px solid #C7774D !important; border-radius: 2px !important; color: #19312F !important; font-family: Manrope, sans-serif !important; font-weight: 600 !important; }
    #block-search button:hover, #block-search [type=submit]:hover { background:#C7774D !important; color:#fff !important; }
    @media (max-width: 640px) { .tl-container { padding:16px !important; } }
  `;

  return (
    <>
      <style>{styles}</style>
      <div id="block-search">
        <div id={searchFormUniqueId} className="tl-container">
          <a
            href="https://www.travelline.ru/products/tl-hotel/"
            rel="nofollow"
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
