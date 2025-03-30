import React from 'react';

const Button = ({ icon, text, func }) => {
    return (
      <button
        className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 ${
          icon ? 'bg-[#FAC638] text-[#AB2217]' : 'bg-[#F5EFDB] text-[#201A09]'
        } text-base font-bold leading-normal tracking-[0.015em]`}
        onClick={func}
        
      >
        {icon ? (
          <div className="text-[#201A09]" data-icon={icon} data-size="20px" data-weight="regular">
            <div width="20px" height="20px">
              {icon}
            </div>
          </div>
        ) : (
          <span className="truncate">{text}</span>
        )}
      </button>
    );
  };

  export default Button;