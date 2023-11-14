// Register.jsx

import React, { useState } from "react";
import Web3 from "web3";
import Contract from "./Contract/Contract.json";

const Register = ({ userAccount }) => {
  const [serviceProviderName, setServiceProviderName] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [hashS, setHashS] = useState("");
  const [hashS2, setHashS2] = useState("");

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
      await contract.methods
        .registerServiceProvider(
          serviceProviderName,
          serviceName,
          hashS,
          hashS2
        )
        .send({
          from: userAccount,
          gas: 2000000,
          gasPrice: 10000000000,
        });
      console.log("Service provider registered successfully");
      window.location.reload();
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
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            HashS2:
            <input
              className="form-input mt-1 block w-full"
              type="text"
              value={hashS2}
              onChange={(e) => setHashS2(e.target.value)}
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
    </div>
  );
};

export default Register;
