// App.jsx

import React from "react";
import { useUser } from "./UserContext";
import HomePage from "./HomePage";
import Register from "./Register";
import NavBar from "./NavBar";
import Footer from "./Footer";

const App = () => {
  const { accountType, userAccount, web3 } = useUser();

  return (
    <div className="flex flex-col min-h-screen bg-yellow-50">
      <NavBar />
      <div className="flex-grow ">
        {/* <h1 className="text-3xl">Address: {userAccount}</h1> */}
        {accountType !== "no" ? (
          <HomePage accountType={accountType} userAccount={userAccount} />
        ) : (
          <Register userAccount={userAccount} />
        )}
      </div>
      <Footer address={userAccount} />
    </div>
  );
};

export default App;
