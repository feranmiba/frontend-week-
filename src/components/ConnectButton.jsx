import { useWalletConnection } from "../hooks/useWalletConnect";

const ConnectButton = () => {
  const { account, connectWallet, disconnectWallet, error, switchChain, supportedChains, chainInfo } =
    useWalletConnection();

  if (account) {
    return (
      <button onClick={disconnectWallet}>
        Disconnect
      </button>
    );
  }

  return (
    <div>
      {error ? (
        <div style={{ padding: "10px", border: "1px solid red", borderRadius: "4px", marginBottom: "10px" }}>
          <p style={{ color: "red", marginTop: 0 }}>{error}</p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {supportedChains.map((chainId) => (
              <button
                key={chainId}
                onClick={() => switchChain(chainId)}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Switch to {chainInfo[chainId]?.name || `Chain ${chainId}`}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button onClick={connectWallet}>
          Connect
        </button>
      )}
    </div>
  );
};

export default ConnectButton;