// Register.jsx

import React, { useState } from "react";
import Web3 from "web3";
import Contract from "./Contract/Contract.json";

const Register = ({ userAccount }) => {
  const [serviceProviderName, setServiceProviderName] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [hashS, setHashS] = useState("");

   const [s1, setS1] = useState("");
   const [s2, setS2] = useState("");
   const [hhashS, setHhashS] = useState("");

   const calculateHash = () => {
     const data = {
       s1: s1,
       s2: s2,
     };

     fetch("http://localhost:8080/combine", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify(data),
     })
       .then((response) => response.json())
       .then((data) => {
         const calculatedHashS = data.combinedHash;
         setHashS(calculatedHashS);
       })
       .catch((error) => {
         console.error("Error:", error);
       });
   };

  const registerAsServiceProvider = async () => {
    const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
    const wweb3 = new Web3(provider);
    const networkId = await wweb3.eth.net.getId();
    const deployedNetwork = Contract.networks[networkId];
    const contract = new wweb3.eth.Contract(
      Contract.abi,
      deployedNetwork.address
    );

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      console.log("hashS is=",hashS);
      await contract.methods
        .registerServiceProvider(
          serviceProviderName,
          serviceName,
          hashS
        )
        .send({
          from: userAccount,
          gas: 2000000,
          gasPrice: 10000000000,
        });
      console.log("Service provider registered successfully");
      //window.location.reload();
    } catch (error) {
      console.error("Error registering service provider:", error);
    }
  };

  const registerClient = async () => {
    const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
    const wweb3 = new Web3(provider);
    const networkId = await wweb3.eth.net.getId();
    const deployedNetwork = Contract.networks[networkId];
    const contract = new wweb3.eth.Contract(
      Contract.abi,
      deployedNetwork.address
    );

    try {
      await contract.methods.registerClient(serviceProviderName).send({
        from: userAccount,
        gas: 2000000,
        gasPrice: 10000000000,
      });
      console.log("Client registered successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error registering client:", error);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to Register Page</h1>

      {/* Form for Service Provider */}
      <form className="mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            ServiceProvider Name:
            <input
              className="form-input mt-1 block w-full"
              type="text"
              value={serviceProviderName}
              onChange={(e) => setServiceProviderName(e.target.value)}
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Service Name:
            <input
              className="form-input mt-1 block w-full"
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            HashS:
            <input
              className="form-input mt-1 block w-full"
              type="text"
              value={hashS}
              onChange={(e) => setHashS(e.target.value)}
            />
          </label>
        </div>
        <button
          type="button"
          onClick={registerAsServiceProvider}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Register as Service Provider
        </button>
      </form>

      {/* Form for Client */}
      <form>
        <button
          type="button"
          onClick={registerClient}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Register as Client
        </button>
      </form>
      <form>
        <label htmlFor="s1">Input S1:</label>
        <input
          type="text"
          id="s1"
          name="s1"
          value={s1}
          onChange={(e) => setS1(e.target.value)}
          required
        />
        <br />

        <label htmlFor="s2">Input S2:</label>
        <input
          type="text"
          id="s2"
          name="s2"
          value={s2}
          onChange={(e) => setS2(e.target.value)}
          required
        />
        <br />

        <button type="button" onClick={calculateHash}>
          Submit
        </button>
      </form>

      <div id="result">HashS: {hashS}</div>
    </div>
  );
};

export default Register;
