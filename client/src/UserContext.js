// UserContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import Contract from "./Contract/Contract.json";
import Web3 from 'web3';
// import { accounts } from 'web3/lib/commonjs/eth.exports';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [accountType, setAccountType] = useState(null);
  const [listAccounts,setListAccounts]= useState(null);
  const [userAccount, setUserAccount] = useState(null);
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    const initializeWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          // Request account access if needed
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          setWeb3(web3Instance);
          const accounts = await web3Instance.eth.getAccounts();
          setListAccounts(accounts);
          setUserAccount(accounts[0]);
          //console.log("1accounts[0]=",accounts[0].toString());
          //console.log("list of accounts=",accounts);
         // console.log("Here is the userAccount="+  userAccount);
        } catch (error) {
          console.error('Error connecting to MetaMask:', error);
        }
      } else {
        console.error('MetaMask not detected!');
      }
    };

    initializeWeb3();
  }, [userAccount]);
  
  useEffect(() => {
    if (web3 && userAccount) {
      checkAccountType();
      //console.log("here is the account=",userAccount);
    }

   // console.log("hehe");
  }, [web3, userAccount, listAccounts]);

  useEffect(()=>{
    if(window.ethereum){
        window.ethereum.on('accountsChanged',handleAccountsChanged);
    }
    return()=>{
        if(window.ethereum){
            window.ethereum.removeListener('accountsChanged',handleAccountsChanged);
        }
    }
  })
  function handleAccountsChanged(listAccounts){
    if(listAccounts.length >0 && userAccount !== listAccounts[0]){
        setUserAccount(listAccounts[0]);
        window.location.reload();
    }
  }

  const checkAccountType = async () => {
    if (!web3 || !userAccount) return;
    const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
    const wweb3 = new Web3(provider);
    const networkId = await wweb3.eth.net.getId();
    //console.log(networkId);
    const deployedNetwork = Contract.networks[networkId];
    //console.log("here-" + deployedNetwork);
    const contract = new wweb3.eth.Contract(
      Contract.abi,
      deployedNetwork.address
    );
    // Replace with your actual contract address and ABI
    // const contractAddress = 'YOUR_CONTRACT_ADDRESS';
    // const contractAbi = [...];

    // const contract = new web3.eth.Contract(contractAbi, contractAddress);
 
    try {
    //console.log("the account=",userAccount);
    //console.log("User Account=",userAccount);
    const accountType1 = await contract.methods.checkAccount().call({
      from: userAccount
    });
    //console.log("heheh=",accountType1);
    setAccountType(accountType1);
      // const client = await contract.methods.clients(userAccount).call();
      // const serviceProvider = await contract.methods.serviceProviders(userAccount).call();

      // if (client.clientAddress !== '0x0000000000000000000000000000000000000000') {
      //   setAccountType('client');
      // } else if (serviceProvider.serviceProviderAddress !== '0x0000000000000000000000000000000000000000') {
      //   setAccountType('serviceProvider');
      // }
    } catch (error) {
        //console.log("here si the erorr")
        
      console.error('Error checking account type:', error);
    }
  };


  const value = {
    accountType,
    setAccountType,
    userAccount,
    web3,
  };
  //console.log("accounttype=", accountType);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};


export const useUser = () => {
  const context = useContext(UserContext);
  
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
