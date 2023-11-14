// HomePage.jsx

import React, { useState, useEffect } from "react";
import ClientHomePage from "./ClientHomePage";
import SpHomePage from "./SpHomePage";
// import { useWeb3 } from "@openzeppelin/network/react";

const HomePage = ({  accountType,userAccount }) => {


  return (
    <div>
      <h1>Welcome to the HomePage</h1>
      {accountType==='client' && (
        <div>
          <ClientHomePage
            userAccount={userAccount}
          />
        </div>
      )}
      {accountType ==='serviceProvider' && (
        <div>
          <SpHomePage
            userAccount={userAccount}
          />
        </div>
      )}
    </div>
  );
};

export default HomePage;
