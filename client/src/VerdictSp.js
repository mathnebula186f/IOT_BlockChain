import Web3 from "web3";
import Contract from "./Contract/Contract.json";

export default function VerdictSp(requestInfo) {
  async function resetUser() {
    const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
    const web3 = new Web3(provider);
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = Contract.networks[networkId];
    const contract = new web3.eth.Contract(
      Contract.abi,
      deployedNetwork.address
    );
    console.log("heheheheheh");
    await contract.methods.resetUser().send({
      from: requestInfo.to,
      gas: 2000000,
      gasPrice: 10000000000,
    });
    window.location.reload();
  }
  return (
    <div>
      {requestInfo && requestInfo.verdict === "Success" ? (
        <div className="text-2xl">Successfully Service Provided to Client</div>
      ) : (
        <div></div>
      )}
      {requestInfo && requestInfo.verdict === "AbortByClient" ? (
        <div className="text-2xl">This Was Aborted By Client</div>
      ) : (
        <div></div>
      )}
      {requestInfo && requestInfo.verdict === "AbortByServiceProvider" ? (
        <div className="text-2xl">This Was Aborted By ServiceProvider</div>
      ) : (
        <div></div>
      )}
      {requestInfo && requestInfo.verdict === "MaliciousClient" ? (
        <div className="text-2xl">Client is Malicious</div>
      ) : (
        <div></div>
      )}
      {requestInfo && requestInfo.verdict === "MaliciousServiceProvider" ? (
        <div className="text-2xl">ServiceProvider is Malicious</div>
      ) : (
        <div></div>
      )}
      <button onClick={resetUser}>Go to Homepage</button>
    </div>
  );
}
