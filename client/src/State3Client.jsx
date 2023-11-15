import React, { useState, useEffect } from "react";
import Contract from "./Contract/Contract.json";
import Web3 from "web3";

export default function State3Client(requestInfo) {
  const [s1Value, setS1Value] = useState("");
  const [isS1Confirmed, setIsS1Confirmed] = useState(false);
  const [isDeclined, setIsDeclined] = useState(false);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
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
        const fetchedS1 = await contract.methods
          .displayS1(requestInfo.requestID)
          .call({
            from: requestInfo.from,
          });
        setS1Value(fetchedS1);
      } catch (error) {
        console.error("Error fetching S1:", error.message);
      }
    };

    fetchInfo();
  }, [requestInfo.requestID]); // Fetch S1 whenever request ID changes

  const handleConfirmS1 = async () => {
    try {
      setIsS1Confirmed(true);
      window.location.reload();
    } catch (error) {
      console.error("Error confirming S1:", error.message);
    }
  };

  const handleDecline = async () => {
    try {
      // Perform actions to decline the request
      setIsDeclined(true);
      window.location.reload();
    } catch (error) {
      console.error("Error declining request:", error.message);
    }
  };

  return (
    <div>
      <>
        <h2 className="text-xl font-bold mb-2">
          Requested Service Information:
        </h2>
        {requestInfo ? (
          <div className="border p-4 rounded-md shadow-md">
            <p className="text-lg font-semibold mb-2">
              Request ID: {Number(requestInfo.requestID)}
            </p>
            {/* Display the information fetched from the smart contract */}
            <p>State: {Number(requestInfo.state)}</p>
            <p>From: {requestInfo.from}</p>
            <p>To: {requestInfo.to}</p>
            <p>Service ID: {Number(requestInfo.serviceID)}</p>

            {/* Display S1 value */}
            <div className="mt-4">
              <h1 className="text-5xl">S1 Value:</h1>
              <p className="text-lg">{s1Value}</p>
            </div>

            {/* Confirm S1 button */}
            {!isS1Confirmed && !isDeclined && (
              <button
                type="button"
                onClick={handleConfirmS1}
                className="mt-4 mr-4 p-2 transition-colors duration-300 ease-in-out bg-blue-500 text-white hover:bg-gray-300 hover:text-gray-800 rounded-md"
              >
                Confirm S1
              </button>
            )}

            {/* Decline button */}
            {!isDeclined && (
              <button
                type="button"
                onClick={handleDecline}
                className="mt-4 p-2 transition-colors duration-300 ease-in-out bg-red-500 text-white hover:bg-gray-300 hover:text-gray-800 rounded-md"
              >
                Decline
              </button>
            )}

            {/* Display confirmation message */}
            {isS1Confirmed && (
              <p className="mt-4 text-green-500 font-bold">S1 Confirmed!</p>
            )}

            {isDeclined && (
              <p className="mt-4 text-red-500 font-bold">Request Declined!</p>
            )}
          </div>
        ) : (
          <p>Loading request information...</p>
        )}
      </>
    </div>
  );
}
