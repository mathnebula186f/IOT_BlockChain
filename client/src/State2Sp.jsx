import React, { useState } from "react";
import Web3 from "web3";
import Contract from "./Contract/Contract.json"

export default function State2Sp( requestInfo ) {
  const [s1Value, setS1Value] = useState("");
  const [isS1Published, setIsS1Published] = useState(false);

  const handlePublishS1 = async () => {
    // Implement logic to publish S1 (e.g., call a function to update the contract)

    // For demonstration purposes, let's just log the S1 value and set isS1Published to true
    const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
    const web3 = new Web3(provider);
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = Contract.networks[networkId];
    const contract = new web3.eth.Contract(
      Contract.abi,
      deployedNetwork.address
    );

    await contract.methods
      .publishS1(requestInfo.requestID,s1Value)
      .send({ from: requestInfo.to, gas: 2000000, gasPrice: 10000000000 });
    console.log("S1:", s1Value);
    setIsS1Published(true);
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

          {/* Form for S1 */}
          <form>
            <label
              htmlFor="s1"
              className="block text-sm font-medium text-gray-700"
            >
              S1:
            </label>
            <input
              type="text"
              id="s1"
              name="s1"
              value={s1Value}
              onChange={(e) => setS1Value(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
            <button
              type="button"
              onClick={handlePublishS1}
              className={`mt-4 p-2 transition-colors duration-300 ease-in-out ${
                isS1Published
                  ? "bg-gray-300 text-gray-800 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-gray-300 hover:text-gray-800"
              } rounded-md`}
              disabled={isS1Published}
            >
              {isS1Published ? "S1 Published" : "Publish S1"}
            </button>
          </form>

          <h1>
            Client Has Approved HashS2 and We are going to publish S1 On Chain
          </h1>
        </div>
      ) : (
        <p>Loading request information...</p>
      )}
    </div>
  );
}
