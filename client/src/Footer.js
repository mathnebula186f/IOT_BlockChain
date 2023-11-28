// Footer.jsx

import React from "react";

const Footer = (props) => {
  return (
    <div className="bg-white text-black p-4">
      <p>Address: {props.address}</p>
    </div>
  );
};

export default Footer;
