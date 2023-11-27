import React, { useState, useEffect } from "react";
import Web3 from "web3";
import Contract from "./Contract/Contract.json";

export default function State1Client(requestInfo ) {
  const [hashS1, setHashS1] = useState("");
  const [isHashS1Confirmed, setIsHashS1Confirmed] = useState(false);
  // const [tempS1,setTempS1]=useState();

  function hexStringToUint8Array(hexString) {
    if (hexString.length % 2 !== 0) {
      throw new Error("Hex string must have an even number of characters");
    }
    if (hexString.startsWith("0x")) {
      hexString = hexString.slice(2);
    }
    const bytes = new Uint8Array(hexString.length / 2);

    for (let i = 0; i < hexString.length; i += 2) {
      const byteValue = parseInt(hexString.substr(i, 2), 16);
      bytes[i / 2] = byteValue;
    }

    return bytes;
  }
  useEffect(() => {
    const fetchHashS1 = async () => {
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
        const fetchedHashS1 = await contract.methods
          .displayHashS1(requestInfo.serviceID)
          .call({
            from: requestInfo.from,
          });
        // const retrievedDataArray = fetchedHashS1.map((x) => x.toNumber());
        console.log("Here is the fetched data",hexStringToUint8Array(fetchedHashS1))
        //console.log("requested id=",clientRequestedServiceID)
        //setRequestID(Number(clientRequestID));
        // Update the state with the fetched HashS2
        setHashS1(fetchedHashS1);
      } catch (error) {
        console.error("Error fetching HashS1:", error);
      }
    };

    // Fetch HashS2 when the component mounts
    fetchHashS1();
  }, [requestInfo.serviceID]);

  const handleConfirmHashS1 = async () => {
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
        .confirmHashS1(requestInfo.requestID)
        .send({ from: requestInfo.to, gas: 2000000, gasPrice: 10000000000 });

      // Update the state to indicate that HashS2 is confirmed
      setIsHashS1Confirmed(true);
      window.location.reload();
    } catch (error) {
      console.error("Error confirming HashS1:", error);
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
              <p className="text-lg font-semibold mb-2">HashS1:</p>
              <p className="break-all">{hashS1 || "Waiting for HashS2..."}</p>
            </div>

            {/* Confirm HashS1 button */}
            <button
              type="button"
              onClick={handleConfirmHashS1}
              className={`mt-4 p-2 transition-colors duration-300 ease-in-out ${
                isHashS1Confirmed
                  ? "bg-gray-300 text-gray-800 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-gray-300 hover:text-gray-800"
              } rounded-md`}
              disabled={isHashS1Confirmed}
            >
              {isHashS1Confirmed ? "HashS1 Confirmed" : "Confirm HashS1"}
            </button>
          </div>
        ) : (
          <p>Loading request information...</p>
        )}
      </>
    </div>
  );
}
