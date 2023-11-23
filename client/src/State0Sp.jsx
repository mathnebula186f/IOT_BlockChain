import React, { useState } from "react";
import Web3 from "web3";
import Contract from "./Contract/Contract.json"

export default function State0Sp( requestInfo ) {
  const [hashS1, setHashS1] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [s1, setS1] = useState("");

  const calculateHash = () => {
    const data = {
      s1: s1,
    };
    console.log("heheh")
    fetch("http://localhost:8080/singlehash", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        const calculatedHashS = data.singleHash;
        console.log("im here")
        setHashS1(calculatedHashS);
        //console.log("ok")
      })
      .catch((error) => {
        console.error("Error:", error);
        //console.log("hahah");
      });
  };

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
      .setHashS1(requestInfo.requestID,hashS1)
      .send({ from: requestInfo.to, gas: 2000000, gasPrice: 10000000000 });
    console.log("HashS2:", hashS1);
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
              htmlFor="hashS1"
              className="block text-sm font-medium text-gray-700"
            >
              HashS1:
            </label>
            <input
              type="text"
              // id="hashS2"
              // name="hashS2"
              value={hashS1}
              onChange={(e) => setHashS1(e.target.value)}
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
          <form>
            <label htmlFor="s1">Input S1:</label>
            <input
              type="text"
              id="s1"
              name="s1"
              value={s1}
              onChange={(e) => setS1(e.target.value)}
              required
            />
            <br />

            <button type="button" onClick={calculateHash}>
              Submit
            </button>
          </form>

          <div id="result">HashS: {hashS1}</div>
        </div>
      ) : (
        <p>Loading request information...</p>
      )}
    </div>
  );
}
