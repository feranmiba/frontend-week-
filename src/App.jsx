import { useEffect } from "react";
import ConnectButton from "./components/ConnectButton";
import { useWalletConnection } from "./hooks/useWalletConnect";

function App() {
  const { account, chainId, balance } = useWalletConnection();


  return (
    <div>
      <h1 style={{ margin: "20px" }}>EIP 1193</h1>
      {account && (
        <>
          <p>Account: {account}</p>
        </>
      )}
      {chainId && (
        <>
          <p>Chainid: {chainId}</p>
        </>
      )}

      {balance && (
        <>
          <p>Balance: {balance}</p>
        </>
      )}
      <ConnectButton />
    </div>
  );
}

export default App;


// import { use, useState } from "react";
// import EIP6963 from "./6963";
// import './App.css'

// function App() {

//   const [data, setData] = useState({
//     chainId: null,
//     accounts: null,
//     balance: null

//   })

//   const setUp = async () => {

//     const accounts = await window.ethereum.request({ method: 'eth_accounts' });
//     const Account2 = await window.ethereum.request({method: 'eth_requestAccounts'});
//     const chainID = await window.ethereum.request({ method: 'eth_chainId' });
//     const balance = await window.ethereum.request({ method: 'eth_getBalance', params: [accounts[0], 'latest'] });

//     console.log("-----------Connected Accounts-----------");
//     console.log(accounts);
//     console.log("-----------Requested Accounts-----------");
//     console.log(Account2);
//     console.log("-----------Chain ID-----------");
//     console.log(chainID);
//     console.log("Decimal", parseInt(chainID, 16));

//     console.log(balance)

//     setData({
//       chainId: parseInt(chainID, 16),
//       accounts: accounts,
//       balance: parseInt(balance, 18)
//     })

//     window.ethereum.on("connect", () => {
//       console.log("Connected to MetaMask");
//     });

//     window.ethereum.on("accountsChanged", (accounts) => {
//       console.log("Accounts changed:", accounts);
//       setData((prevData) => ({
//         ...prevData,
//         accounts: accounts
//       }));
//     });

//     window.ethereum.on("chainChanged", (chainId) => {
//       console.log("Chain changed:", chainId);
//       setData((prevData) => ({
//         ...prevData,
//         chainId: parseInt(chainId, 16)
//       }));
//     })

//     window.ethereum.on("disconeect", () => {
//       console.log("Disconnected from metamask")
//     })
//   }



//   return (
//     <>

//         <EIP6963 />


//     <p>
//       Hello world!
//     </p>
//     <button onClick={() => setUp()}>
//       connect wallet
//     </button>

//     <div>
//       <p>Chain ID: {data.chainId}</p>
//       <p>Accounts: {data.accounts?.join(', ')}</p>
//       <p>Balance: {data.balance}</p>
//     </div>






    
//     </>
//   )
// }

// export default App
