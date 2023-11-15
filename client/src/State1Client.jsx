import React, { useState, useEffect } from "react";
import Web3 from "web3";
import Contract from "./Contract/Contract.json";

export default function State1Client(requestInfo ) {
  const [hashS2, setHashS2] = useState("");
  const [isHashS2Confirmed, setIsHashS2Confirmed] = useState(false);

  useEffect(() => {
    const fetchHashS2 = async () => {
      try {
        // Connect to the local Ethereum testnet (adjust as needed)
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

        // Check requested service for the client
        const fetchedHashS2 = await contract.methods
          .displayHashS2(requestInfo.serviceID)
          .call({
            from: requestInfo.from,
          });
        //console.log("requested id=",clientRequestedServiceID)
        //setRequestID(Number(clientRequestID));
        // Update the state with the fetched HashS2
        setHashS2(fetchedHashS2);
      } catch (error) {
        console.error("Error fetching HashS2:", error);
      }
    };

    // Fetch HashS2 when the component mounts
    fetchHashS2();
  }, [requestInfo.serviceID]);

  const handleConfirmHashS2 = async () => {
    try {
      const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
      const web3 = new Web3(provider);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Contract.networks[networkId];
      const contract = new web3.eth.Contract(
        Contract.abi,
        deployedNetwork.address
      );

      await contract.methods
        .confirmHashS2(requestInfo.requestID)
        .send({ from: requestInfo.to, gas: 2000000, gasPrice: 10000000000 });

      // Update the state to indicate that HashS2 is confirmed
      setIsHashS2Confirmed(true);
      window.location.reload();
    } catch (error) {
      console.error("Error confirming HashS2:", error);
    }
  };

  return (
    <div>
      <>
        <h2 className="text-xl font-bold mb-2">
          Requested Service Information:
        </h2>
        {requestInfo ? (
          <div className="border p-4 rounded-md shadow-md mb-4">
            <p className="text-lg font-semibold mb-2">
              Request ID: {Number(requestInfo.requestID)}
            </p>
            {/* Display the information fetched from the smart contract */}
            <p>State: {Number(requestInfo.state)}</p>
            <p>From: {requestInfo.from}</p>
            <p>To: {requestInfo.to}</p>
            <p>Service ID: {Number(requestInfo.serviceID)}</p>

            {/* Display HashS2 */}
            <div className="mt-4">
              <p className="text-lg font-semibold mb-2">HashS2:</p>
              <p className="break-all">{hashS2 || "Waiting for HashS2..."}</p>
            </div>

            {/* Confirm HashS2 button */}
            <button
              type="button"
              onClick={handleConfirmHashS2}
              className={`mt-4 p-2 transition-colors duration-300 ease-in-out ${
                isHashS2Confirmed
                  ? "bg-gray-300 text-gray-800 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-gray-300 hover:text-gray-800"
              } rounded-md`}
              disabled={isHashS2Confirmed}
            >
              {isHashS2Confirmed ? "HashS2 Confirmed" : "Confirm HashS2"}
            </button>
          </div>
        ) : (
          <p>Loading request information...</p>
        )}
      </>
    </div>
  );
}
