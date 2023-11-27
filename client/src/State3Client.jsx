import React, { useState, useEffect } from "react";
import Contract from "./Contract/Contract.json";
import Web3 from "web3";

export default function State3Client(requestInfo) {
  const [s2Value, setS2Value] = useState("");
  const [isS2Confirmed, setIsS2Confirmed] = useState(false);
  const [isDeclined, setIsDeclined] = useState(false);
  const [nowHashS,setNowHashS]=useState("");
  const [tempS1,setTempS1]=useState();

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
        const fetchedS2 = await contract.methods
          .displayS2(requestInfo.requestID)
          .call({
            from: requestInfo.from,
          });
        setS2Value(fetchedS2);
      } catch (error) {
        console.error("Error fetching S2:", error.message);
      }
    };

    fetchInfo();
  }, [requestInfo.requestID]); // Fetch S1 whenever request ID changes

  const handleConfirmS2 = async () => {
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
        .confirmS2(requestInfo.requestID)
        .send({ from: requestInfo.to, gas: 2000000, gasPrice: 10000000000 });
      setIsS2Confirmed(true);
      window.location.reload();
    } catch (error) {
      console.error("Error confirming S2:", error.message);
    }
  };

  const handleDecline = async () => {
    
    try {
      // Perform actions to decline the request
      const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
      const web3 = new Web3(provider);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Contract.networks[networkId];
      const contract = new web3.eth.Contract(
        Contract.abi,
        deployedNetwork.address
      );
      const NowS2= await contract.methods
          .displayS2(requestInfo.requestID)
          .call({
            from: requestInfo.from,
          });
      const NowHashS1 = await contract.methods
        .displayHashS1(requestInfo.serviceID)
        .call({
          from: requestInfo.from,
        });
      const bytesArray=hexStringToUint8Array(NowHashS1);
      const base64String = btoa(
        String.fromCharCode.apply(null, bytesArray)
      );
      console.log("HashS1=",bytesArray)
      console.log("nowS2=",NowS2)
      const data={
        hashS1:base64String,
        s2:NowS2
      }
      var NewCalculatedHashS= new Uint8Array([]);
      fetch("http://localhost:8080/combinewithhash", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          const calculatedHashS = atob(data.combinedHash);
          const byteArray = Uint8Array.from(calculatedHashS, (c) =>
            c.charCodeAt(0)
          );

          console.log("Here the Obtained Value from BackEnd=", byteArray);
          //setHashS(calculatedHashS);

          // calculatedHashS = data.combinedHash;
          console.log("OldNewHashS=", byteArray);
          // NewCalculatedHashS=byteArray;
          // for (let i = 0; i < byteArray.length; i++) {
          //   // Add the element to the global array
          //   console.log(byteArray[i]);
          //   // NewCalculatedHashS = new Uint8Array([
          //   //   ...NewCalculatedHashS,
          //   //   bytesArray[i],
          //   // ]);
          //   // NewCalculatedHashS=NewCalculatedHashS.concat(byteArray[i])
          // }
          contract.methods.computeVerdict(byteArray, requestInfo.requestID)
                .send({
                    from: requestInfo.from,
                    gas: 2000000,
                    gasPrice: 10000000000
                })
                .then((Verdict) => {
                    setIsDeclined(true);
                    console.log("Here is the Verdict=",Verdict)
                    // window.location.reload();
                })
                .catch((error) => {
                    console.error("Error calling computeVerdict:", error.message);
                });
        })
        .catch((error) => {
            console.error("Error:", error);
        });
          
          // setNowHashS(calculatedHashS);
        
      // console.log("nowHashS=",NewCalculatedHashS);

      // const Verdict = await contract.methods
      //   .computeVerdict(NewCalculatedHashS,requestInfo.requestID)
      //   .send({
      //     from: requestInfo.from,
      //     gas: 2000000, gasPrice: 10000000000
      //   });
      // setIsDeclined(true);
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
              <h1 className="text-5xl">S2 Value:</h1>
              <p className="text-lg">{s2Value}</p>
            </div>

            {/* Confirm S1 button */}
            {!isS2Confirmed && !isDeclined && (
              <button
                type="button"
                onClick={handleConfirmS2}
                className="mt-4 mr-4 p-2 transition-colors duration-300 ease-in-out bg-blue-500 text-white hover:bg-gray-300 hover:text-gray-800 rounded-md"
              >
                Confirm S2
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
            {isS2Confirmed && (
              <p className="mt-4 text-green-500 font-bold">S2 Confirmed!</p>
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
