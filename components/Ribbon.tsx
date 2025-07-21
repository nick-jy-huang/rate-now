import React from 'react';

interface RibbonProps {
  href: string;
  className?: string;
  children?: React.ReactNode;
}

const Ribbon: React.FC<RibbonProps> = ({ href, children }) => (
  <div className="pointer-events-auto absolute top-0 left-0 z-10 h-[140px] w-[140px] overflow-hidden">
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="absolute top-8 left-[-2.5rem] w-[170px] -rotate-45 bg-green-600 py-1 text-center text-sm font-bold tracking-wider text-white duration-200 hover:scale-110"
    >
      {children}
      <i className="fa-solid fa-arrow-up-right-from-square ml-2 text-xs"></i>
    </a>
  </div>
);

export default Ribbon;
