import React from 'react';

const ResetIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_61_31905)">
        <g clipPath="url(#clip1_61_31905)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.14286 12C4.14286 7.66061 7.66061 4.14286 12 4.14286C14.5012 4.14286 16.7307 5.31137 18.1704 7.13509L16.7909 8.51477C16.3409 8.96476 16.6596 9.73414 17.2959 9.73414H21.2857C21.6801 9.73414 22 9.41434 22 9.01986V5.03C22 4.39364 21.2306 4.07496 20.7806 4.52493L19.6937 5.61184C17.8603 3.40614 15.0949 2 12 2C6.47716 2 2 6.47716 2 12C2 17.5229 6.47716 22 12 22C16.73 22 20.6906 18.7171 21.7324 14.3068C21.8684 13.7309 21.5119 13.1537 20.936 13.0177C20.3601 12.8817 19.783 13.2382 19.6469 13.8141C18.8284 17.2793 15.7139 19.8571 12 19.8571C7.66061 19.8571 4.14286 16.3394 4.14286 12Z"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_61_31905">
          <rect width="20" height="20" transform="translate(2 2)" />
        </clipPath>
        <clipPath id="clip1_61_31905">
          <rect width="20" height="20" transform="translate(2 2)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default ResetIcon;
