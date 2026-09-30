import { useWalletConnection } from "../hooks/useWalletConnect";

const ConnectButton = () => {
  const { account, connectWallet, disconnectWallet, error } = useWalletConnection();
  return (
    <>
      {account ? (
        <button onClick={disconnectWallet}>Disconnect</button>
      ) : (
        <div>
   <button onClick={connectWallet}>Connect</button>
        {error &&( <p style={{ color: "red" }}>{error}</p>)}
      </div> 
      )}
    </>
  );
};

export default ConnectButton;