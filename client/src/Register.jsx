// Register.jsx

import React, { useState } from "react";
import Web3 from "web3";
import Lottie from "react-lottie";
import animationData from "./lottie/register.json"
import Contract from "./Contract/Contract.json";

const Register = ({ userAccount }) => {
  const [serviceProviderName, setServiceProviderName] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [hashS, setHashS] = useState("");
  const [temp,setTemp]=useState();
   const [s1, setS1] = useState("");
   const [s2, setS2] = useState("");
   const [hhashS, setHhashS] = useState("");

   const lottieOptions = {
     loop: true,
     autoplay: true,
     animationData: animationData,
     rendererSettings: {
       preserveAspectRatio: "xMidYMid slice",
     },
   };

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
        const calculatedHashS = atob(data.combinedHash);
        const byteArray = Uint8Array.from(calculatedHashS, (c) => c.charCodeAt(0));

        console.log("Here the Obtained Value from BackEnd=",byteArray);
         //setHashS(calculatedHashS);

         setTemp(byteArray);
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
          hashS,
          temp
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
    <div className="container mx-auto mt-8 grid grid-cols-2 gap-4">
      {/* Service Provider Form */}
      <form className="col-span-1 mb-8 p-6 border rounded shadow-md bg-white">
        <h1 className="text-3xl font-bold mb-4 animate-bounce">
          Register as Service Provider
        </h1>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            ServiceProvider Name:
            <input
              className="form-input mt-1 block w-full border"
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
              className="form-input mt-1 block w-full border"
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
              className="form-input mt-1 block w-full border"
              type="text"
              value={hashS}
              onChange={(e) => setHashS(e.target.value)}
            />
          </label>
        </div>
        {/* ... (Other Service Provider form fields) */}
        <button
          type="button"
          onClick={registerAsServiceProvider}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 animate-pulse"
        >
          Register as Service Provider
        </button>
      </form>

      {/* Client Form */}
      <form className="col-span-1 mb-8 p-6 border rounded shadow-md bg-white">
        <h1 className="text-3xl font-bold mb-4 animate-bounce">Register as Client</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Service Name:
            <input
              className="form-input mt-1 block w-full border"
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
            />
          </label>
        </div>
        {/* ... (Other Client form fields) */}
        <button
          type="button"
          onClick={registerClient}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 animate-pulse"
        >
          Register as Client
        </button>
      </form>

      {/* Lottie Icon */}
      <div className="col-span-1 flex justify-center items-center">
        <Lottie options={lottieOptions} height={400} width={400} />
      </div>

      {/* Hash Calculator */}
      <form className="col-span-1 mb-8 p-6 border rounded shadow-md bg-white">
        <h1 className="text-3xl font-bold mb-4">Hash Calculator</h1>
        <label htmlFor="s1">Input S1:</label>
        <input
          type="text"
          id="s1"
          name="s1"
          value={s1}
          onChange={(e) => setS1(e.target.value)}
          required
          className="form-input mt-1 block w-full border"
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
          className="form-input mt-1 block w-full border"
        />
        <br />

        <button
          type="button"
          onClick={calculateHash}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Submit
        </button>
        <div id="result" className="mt-4 ">
          HashS: {hashS}
        </div>
      </form>
    </div>
  );
};

export default Register;
