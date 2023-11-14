// App.jsx

import React from "react";
import { useUser } from "./UserContext";
import HomePage from "./HomePage";
import Register from "./Register";

const App = () => {
  const { accountType, userAccount, web3 } = useUser();

  return (
    <div>
      <h1 className="text-3xl">Address: {userAccount}</h1>
      {accountType !== "no" ? (
        <HomePage
          accountType={accountType}
          userAccount={userAccount}
        />
      ) : (
        <Register
          userAccount={userAccount}
        />
      )}
    </div>
  );
};

export default App;
