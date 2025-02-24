import React from 'react';

const FilterActivateIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_87_29534)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2.64286 4C2.40205 4 2.18144 4.13458 2.07125 4.3487C1.96106 4.56282 1.97978 4.82056 2.11975 5.01651L8.42857 13.8489V21.3571C8.42857 21.5942 8.55906 21.812 8.76809 21.9239C8.97712 22.0357 9.23076 22.0235 9.42802 21.892L13.2852 19.3206C13.464 19.2014 13.5714 19.0007 13.5714 18.7857V13.8489L19.8803 5.01651C20.0202 4.82056 20.039 4.56282 19.9288 4.3487C19.8186 4.13458 19.598 4 19.3571 4H2.64286Z"
        />
      </g>
      <circle cx="22" cy="2" r="2" fill="#F07560" />
      <defs>
        <clipPath id="clip0_87_29534">
          <rect width="18" height="18" transform="translate(2 4)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default FilterActivateIcon;
