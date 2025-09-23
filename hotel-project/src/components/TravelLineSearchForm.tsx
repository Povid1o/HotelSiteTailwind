// src/components/TravelLineSearchForm.tsx
import React from 'react';
import './styles/TravelLineSearchForm.css';

const TravelLineSearchForm = () => {
  const styles = `
    #block-search,
    #block-search * {
      box-sizing: border-box;
    }
    #block-search {
      background-color: #fff;
      width: 100%;
      max-width: 1260px;
      margin: 0 auto;
      border-radius: 20px;
    }
    #block-search.block-search--mobile {
      border: 1px solid #e0e0e0;
      box-shadow: 0 0 30px 0 #0000001a;
    }
    .tl-container {
      padding: 0 25px;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div id="block-search">
        <div id="tl-search-form" className="tl-container">
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