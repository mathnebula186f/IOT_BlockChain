import React, { useState } from "react";
import Web3 from "web3";
import Contract from "./Contract/Contract.json"

export default function State2Sp( requestInfo ) {
  const [s2Value, setS2Value] = useState("");
  const [isS2Published, setIsS2Published] = useState(false);

  const handlePublishS2 = async () => {
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
      .publishS2(requestInfo.requestID,s2Value)
      .send({ from: requestInfo.to, gas: 2000000, gasPrice: 10000000000 });
    console.log("S2:", s2Value);
    setIsS2Published(true);
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

          {/* Form for S2 */}
          <form>
            <label
              htmlFor="s2"
              className="block text-sm font-medium text-gray-700"
            >
              S2:
            </label>
            <input
              type="text"
              id="s2"
              name="s2"
              value={s2Value}
              onChange={(e) => setS2Value(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
            <button
              type="button"
              onClick={handlePublishS2}
              className={`mt-4 p-2 transition-colors duration-300 ease-in-out ${
                isS2Published
                  ? "bg-gray-300 text-gray-800 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-gray-300 hover:text-gray-800"
              } rounded-md`}
              disabled={isS2Published}
            >
              {isS2Published ? "S2 Published" : "Publish S2"}
            </button>
          </form>

          <h1>
            Client Has Approved HashS1 and We are going to publish S2 On Chain
          </h1>
        </div>
      ) : (
        <p>Loading request information...</p>
      )}
    </div>
  );
}
