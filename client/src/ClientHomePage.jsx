import React, { useEffect, useState } from "react";
import Web3 from "web3";
import Contract from "./Contract/Contract.json";
import State0Client from "./State0Client";
import State1Client from "./State1Client";
import State2Client from "./State2Client";
import State3Client from "./State3Client";
import VerdictClient from "./VerdictClient";

export default function ClientHomePage({ userAccount }) {
  const [services, setServices] = useState([]);
  const [requestID, setRequestID] = useState(0);
  const [requestInfo, setRequestInfo] = useState(null);

  useEffect(() => {
    const fetchRequestInfo = async () => {
      const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
      const web3 = new Web3(provider);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Contract.networks[networkId];
      const contract = new web3.eth.Contract(
        Contract.abi,
        deployedNetwork.address
      );

      const requestDetails = await contract.methods
        .getRequestInfo(requestID)
        .call({
          from: userAccount,
        });

      setRequestInfo(requestDetails);
    };

    if (requestID !== 0) {
      fetchRequestInfo();
    }
  }, [requestID, userAccount]);

  useEffect(() => {
    const fetchServices = async () => {
      const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
      const web3 = new Web3(provider);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Contract.networks[networkId];
      const contract = new web3.eth.Contract(
        Contract.abi,
        deployedNetwork.address
      );

      // Check requested service for the client
      const clientRequestID = await contract.methods
        .checkRequestedServiceForClient()
        .call({
            from:userAccount
        });
        //console.log("requested id=",clientRequestedServiceID)
      setRequestID(Number(clientRequestID));

      // If requestedServiceID is zero, fetch all services

      if (Number(clientRequestID) === 0) {
        const totalServices = await contract.methods.serviceCount().call();
        //console.log("totalservices=",totalServices);
        const servicesArray = [];
        for (let i = 1; i <= totalServices; i++) {
          const service = await contract.methods.services(i).call();
          //console.log("here is the service")
          servicesArray.push({ ...service, requested: false });
        }
        setServices(servicesArray);
      }
    };

    fetchServices();
  }, [userAccount]);

  const requestService = async (serviceID, index) => {
    // Implement your requestService logic here
    console.log(`Requesting service with ID: ${serviceID}`);

    // Simulate a delay to show the effect
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Call the smart contract's requestService function
    const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
    const web3 = new Web3(provider);
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = Contract.networks[networkId];
    const contract = new web3.eth.Contract(
      Contract.abi,
      deployedNetwork.address
    );

    await contract.methods
      .requestService(serviceID)
      .send({ from: userAccount, gas: 2000000, gasPrice: 10000000000 });

    // Update the services array to reflect the change
    setServices((prevServices) => {
      const updatedServices = [...prevServices];
      updatedServices[index] = { ...updatedServices[index], requested: true };
      return updatedServices;
    });
    window.location.reload();
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Clients Homepage</h1>

      {requestID === 0 ? (
        <>
          <h2 className="text-xl font-bold mb-2">Available Services:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service, index) => (
              <div
                key={index}
                className="border p-4 rounded-md shadow-md hover:shadow-lg transition duration-300"
              >
                <p className="text-lg font-semibold mb-2">
                  Service ID: {service.serviceID.toString()}
                </p>
                <p className="text-gray-600">{service.name}</p>
                <button
                  onClick={() => requestService(service.serviceID, index)}
                  className={`mt-4 ${
                    service.requested
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-700"
                  } px-4 py-2 rounded`}
                  disabled={service.requested}
                >
                  {service.requested ? "Requested" : "Request Service"}
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div>
          {requestInfo && Number(requestInfo.state) === 0 ? (
            <State0Client
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
            <State1Client
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
            <State2Client
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
            <State3Client
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
            <VerdictClient
              verdict={requestInfo.verdict}
              from={requestInfo.from}
            />
          ) : (
            <div></div>
          )}
        </div>
      )}
    </div>
  );
}
