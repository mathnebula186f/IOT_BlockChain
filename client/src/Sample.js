import { useState, useEffect } from "react";
import Contract from "./Contract/Contract.json";
import Web3 from "web3";
import "./App.css";

function Sample() {
  const [state, setState] = useState({
    web3: null,
    contract: null,
  });
  const [data, setData] = useState("nill");
  const [temp, setTemp] = useState(0);
  useEffect(() => {
    const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
    console.log(provider);

    async function template() {
      const web3 = new Web3(provider);
      const networkId = await web3.eth.net.getId();
      console.log(networkId);
      const deployedNetwork = Contract.networks[networkId];
      console.log("here-" + deployedNetwork);
      const contract = new web3.eth.Contract(
        Contract.abi,
        deployedNetwork.address
      );
      console.log(contract);
      setState({ web3: web3, contract: contract });
    }
    provider && template();
  }, []);
  useEffect(() => {
    const { contract } = state;
    async function readData() {
      const data1 = await contract.methods.getter().call();
      console.log("type=" + typeof data);
      setData(data1.toString());
      setTemp(data1);
      console.log("dataaa=", data);
    }
    contract && readData();
  }, [state]);
  async function writeData() {
    const { contract } = state;
    const data2 = document.querySelector("#value").value;
    console.log("data=", data2);
    await contract.methods
      .setter(data2)
      .send({ from: "0x8e8abc34875E482f10aF04ca88830F38acad0a0a" });
    window.location.reload();
  }
  console.log("heheh=", data);
  return (
    <>
      <h1>Welcome to Dapp</h1>
      <div className="App">
        <p className="text">
          Contract Data :{data}
          {temp}
        </p>
        <div>
          <input type="text" id="value" required="required"></input>
        </div>

        <button onClick={writeData} className="button button2">
          Change Data
        </button>
      </div>
    </>
  );
}

export default App;
