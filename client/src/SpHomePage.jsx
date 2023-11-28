import React, { useEffect, useState } from "react";
import Web3 from "web3";
import Contract from "./Contract/Contract.json";
import State0Sp from "./State0Sp";
import State1Sp from "./State1Sp";
import State2Sp from "./State2Sp";
import State3Sp from "./State3Sp";
import VerdictSp from "./VerdictSp";

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
        <div>
          {requestInfo && Number(requestInfo.state) === 0 ? (
            <State0Sp
              requestID={requestInfo.requestID}
              state={requestInfo.state}
              from={requestInfo.from}
              to={requestInfo.to}
              serviceID={requestInfo.serviceID}
            />
          ) : (
            <div></div>
          )}
          {requestInfo && Number(requestInfo.state) === 1 ? (
            <State1Sp
              requestID={requestInfo.requestID}
              state={requestInfo.state}
              from={requestInfo.from}
              to={requestInfo.to}
              serviceID={requestInfo.serviceID}
            />
          ) : (
            <div></div>
          )}
          {requestInfo && Number(requestInfo.state) === 2 ? (
            <State2Sp
              requestID={requestInfo.requestID}
              state={requestInfo.state}
              from={requestInfo.from}
              to={requestInfo.to}
              serviceID={requestInfo.serviceID}
            />
          ) : (
            <div></div>
          )}
          {requestInfo && Number(requestInfo.state) === 3 ? (
            <State3Sp
              requestID={requestInfo.requestID}
              state={requestInfo.state}
              from={requestInfo.from}
              to={requestInfo.to}
              serviceID={requestInfo.serviceID}
            />
          ) : (
            <div></div>
          )}
          {requestInfo && Number(requestInfo.state) === 4 ? (
            <VerdictSp 
            verdict={requestInfo.verdict} 
            to={requestInfo.to}
            />
          ) : (
            <div> </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SpHomePage;
