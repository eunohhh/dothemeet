import React from 'react';

const OpenBookIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_262_13710)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.1071 4.36109C9.69444 3.56982 7.0518 2.60192 4.13774 2.25619C2.96252 2.11676 2 3.0852 2 4.26867V15.6972C2 16.8808 2.96718 17.8238 4.13161 18.0352C6.76079 18.5126 8.9476 19.7733 10.343 20.7701C10.5768 20.9371 10.8355 21.0635 11.1071 21.1495V4.36109ZM12.8929 21.1498C13.1641 21.0639 13.4225 20.9376 13.656 20.7709C15.0513 19.7741 17.2386 18.5129 19.8684 18.0355C21.0329 17.8241 22 16.8809 22 15.6974V4.26888C22 3.08541 21.0374 2.11696 19.8623 2.25639C16.9481 2.60213 14.3056 3.5699 12.8929 4.36112V21.1498Z"
        />
      </g>
      <defs>
        <clipPath id="clip0_262_13710">
          <rect width="20" height="20" transform="translate(2 2)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default OpenBookIcon;
