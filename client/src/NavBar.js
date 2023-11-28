// NavBar.jsx

import React from "react";
import Lottie from "react-lottie";
import animationData1 from "./lottie/navbar.json";

const NavBar = () => {
  // Configuration for Lottie animation options
  const lottieOptions1 = {
    loop: true,
    autoplay: true,
    animationData: animationData1,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="bg-white p-4 shadow-md flex justify-between items-center">
      {/* Logo */}
      <div className="flex items-center">
        {/* <span className="text-gray-800 text-xl font-bold ml-2">
          FRAUD-DETECTOR
        </span> */}
      </div>

      {/* Name of App with Text Animation */}
      <div className="hidden lg:flex items-center space-x-2">
        <Lottie options={lottieOptions1} height={100} width={100} />

        <span className="text-black-400 animate-bounce font-bold text-5xl">
          FRAUD-DETECTOR
        </span>
      </div>

      {/* Another Lottiefile Icon on the right side */}
      <div className="flex items-center">
        {/* You can uncomment the following line and provide the second Lottie animation */}
        {/* <Lottie options={lottieOptions2} height={40} width={40} /> */}
      </div>
    </div>
  );
};

export default NavBar;
