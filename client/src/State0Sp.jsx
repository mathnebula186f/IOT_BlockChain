import React, { useState } from "react";
import Web3 from "web3";
import Contract from "./Contract/Contract.json"

export default function State0Sp( requestInfo ) {
  const [hashS2, setHashS2] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const handlePublishHash = async () => {
    // Implement logic to publish hashS2 (e.g., call a function to update the contract)

    // For demonstration purposes, let's just log the hashS2 and set isPublished to true
    const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
    const web3 = new Web3(provider);
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = Contract.networks[networkId];
    const contract = new web3.eth.Contract(
      Contract.abi,
      deployedNetwork.address
    );

    await contract.methods
      .setHashS2(requestInfo.requestID,hashS2)
      .send({ from: requestInfo.to, gas: 2000000, gasPrice: 10000000000 });
    console.log("HashS2:", hashS2);
    setIsPublished(true);
    window.location.reload();
  };

  return (
    <div className="bg-gray-200 p-4 rounded-md shadow-md">
      <p className="font-bold text-blue-500 mb-2">Request Information:</p>
      {requestInfo ? (
        <div>
          <p>Request ID: {Number(requestInfo.requestID)}</p>
          <p>State: {Number(requestInfo.state)}</p>
          <p>From: {requestInfo.from}</p>
          <p>To: {requestInfo.to}</p>
          <p>Service ID: {Number(requestInfo.serviceID)}</p>

          {/* Form for HashS2 */}
          <form>
            <label
              htmlFor="hashS2"
              className="block text-sm font-medium text-gray-700"
            >
              HashS2:
            </label>
            <input
              type="text"
              id="hashS2"
              name="hashS2"
              value={hashS2}
              onChange={(e) => setHashS2(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
            <button
              type="button"
              onClick={handlePublishHash}
              className={`mt-4 p-2 transition-colors duration-300 ease-in-out ${
                isPublished
                  ? "bg-gray-300 text-gray-800"
                  : "bg-blue-500 text-white hover:bg-gray-300 hover:text-gray-800"
              } rounded-md`}
            >
              {isPublished ? "Hash Published" : "Publish Hash"}
            </button>
          </form>
        </div>
      ) : (
        <p>Loading request information...</p>
      )}
    </div>
  );
}
