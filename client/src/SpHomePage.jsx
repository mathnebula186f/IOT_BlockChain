import React, { useEffect, useState } from "react";
import Web3 from "web3";
import Contract from "./Contract/Contract.json";

const SpHomePage = ({ userAccount }) => {
  const [requestID, setRequestID] = useState(0);
  const [requestInfo, setRequestInfo] = useState(null);

  useEffect(() => {
    const fetchRequestID = async () => {
      const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
      const web3 = new Web3(provider);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Contract.networks[networkId];
      const contract = new web3.eth.Contract(
        Contract.abi,
        deployedNetwork.address
      );

      const spRequestID = await contract.methods
        .checkRequestedServiceForProvider()
        .call({ from: userAccount });

      setRequestID(Number(spRequestID));
    };

    fetchRequestID();
  }, [userAccount]);

  useEffect(() => {
    const fetchRequestInfo = async () => {
      if (requestID !== 0) {
        const provider = new Web3.providers.HttpProvider(
          "HTTP://127.0.0.1:7545"
        );
        const web3 = new Web3(provider);
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = Contract.networks[networkId];
        const contract = new web3.eth.Contract(
          Contract.abi,
          deployedNetwork.address
        );

        const info = await contract.methods
          .getRequestInfo(requestID)
          .call({ from: userAccount });

        setRequestInfo(info);
      }
    };

    fetchRequestInfo();
  }, [requestID, userAccount]);

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Service Providers Homepage</h1>
      {requestID === 0 ? (
        <p className="font-bold text-red-500">No Current Requests</p>
      ) : (
        <div className="bg-gray-200 p-4 rounded-md shadow-md">
          <p className="font-bold text-blue-500 mb-2">Request Information:</p>
          {requestInfo ? (
            <div>
              <p>Request ID: {requestID}</p>
              <p>State: {Number(requestInfo.state)}</p>
              <p>From: {requestInfo.from}</p>
              <p>To: {requestInfo.to}</p>
              <p>Service ID: {Number(requestInfo.serviceID)}</p>
            </div>
          ) : (
            <p>Loading request information...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SpHomePage;
