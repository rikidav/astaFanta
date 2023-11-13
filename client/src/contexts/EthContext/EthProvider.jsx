import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(
    async artifact => {
      if (artifact) {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
        const accounts = await web3.eth.requestAccounts();
        const networkID = await web3.eth.net.getId();
        console.log("NETID: ", networkID);  
        console.log("account: ", accounts);
        const { abi } = artifact;
        let address, contract,owner,auctioneer,AUCTIONER_ROLE;
        try {
          address = artifact.networks[networkID].address;
          contract = new web3.eth.Contract(abi, address);
          // const role = await web3.utils.sha3("ADMIN");
          AUCTIONER_ROLE = await web3.utils.sha3("AUCTIONEER");
          // owner = await contract.methods.hasRole(role, accounts[0]).call({ from: accounts[0] }); //in owner c'è true o false
          owner = await contract.methods.isAdmin(accounts[0]).call({ from: accounts[0] });
          auctioneer = await contract.methods.isAuctioneer(accounts[0]).call({ from: accounts[0] });
          console.log("owner ",owner, " auctioneer", auctioneer);
        } catch (err) {
          console.error(err);
        }
        dispatch({
          type: actions.init,
          data: { artifact, web3, accounts, networkID, contract,owner,auctioneer,AUCTIONER_ROLE}
        });
      }
    }, []);

  useEffect(() => {
    const tryInit = async () => {
      try {
        const artifact = require("../../contracts/FootballAuctions.json");
        init(artifact);
      } catch (err) {
        console.error(err);
      }
    };

    tryInit();
  }, [init]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      init(state.artifact);
    };

    events.forEach(e => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach(e => window.ethereum.removeListener(e, handleChange));
    };
  }, [init, state.artifact]);

  return (
    <EthContext.Provider value={{
      state,
      dispatch
    }}>
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
