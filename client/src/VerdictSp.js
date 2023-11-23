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
        <div>Successfully Service Provided to Client</div>
      ) : (
        <div>Loading....</div>
      )}
      {requestInfo && requestInfo.verdict === "AbortByClient" ? (
        <div>This Was Aborted By Client</div>
      ) : (
        <div>Loading....</div>
      )}
      {requestInfo && requestInfo.verdict === "AbortByServiceProvider" ? (
        <div>This Was Aborted By ServiceProvider</div>
      ) : (
        <div>Loading....</div>
      )}
      {requestInfo && requestInfo.verdict === "MaliciousClient" ? (
        <div>Client is Malicious</div>
      ) : (
        <div>Loading....</div>
      )}
      {requestInfo && requestInfo.verdict === "MaliciousServiceProvider" ? (
        <div>ServiceProvider is Malicious</div>
      ) : (
        <div>Loading....</div>
      )}
      <button onClick={resetUser}>Go to Homepage</button>
    </div>
  );
}
