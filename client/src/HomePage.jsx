// HomePage.jsx

import React, { useState, useEffect } from "react";
import ClientHomePage from "./ClientHomePage";
import SpHomePage from "./SpHomePage";
import animationData from "./lottie/homepage.json"
import Lottie from "react-lottie";
// import { useWeb3 } from "@openzeppelin/network/react";

const HomePage = ({  accountType,userAccount }) => {
  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div>
      {/* <h1>Welcome to the HomePage</h1> */}
      {accountType === "client" && (
        <div>
          <ClientHomePage userAccount={userAccount} />
        </div>
      )}
      {accountType === "serviceProvider" && (
        <div>
          <SpHomePage userAccount={userAccount} />
        </div>
      )}
      <Lottie options={lottieOptions} height={400} width={400} />
    </div>
  );
};

export default HomePage;
