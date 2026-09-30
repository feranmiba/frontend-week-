import { useWalletConnection } from "../hooks/useWalletConnection";

const ConnectButton = () => {
  const {
    account,
    connectWallet,
    disconnectWallet,
    error,
    switchChain,
    supportedChains,
    chainInfo,
  } = useWalletConnection();

  if (account) {
    return <button onClick={disconnectWallet}>Disconnect</button>;
  }

  return (
    <div>
      {error ? (
        <div
          style={{
            padding: "12px",
            border: "1px solid #fca5a5",
            borderRadius: "8px",
            background: "#fef2f2",
            maxWidth: "520px",
          }}
        >
          <p style={{ color: "#b91c1c", margin: "0 0 12px" }}>{error}</p>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {supportedChains.map((chainId) => (
              <button
                key={chainId}
                onClick={() => switchChain(chainId)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#16a34a",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Switch to {chainInfo[chainId]?.name || `Chain ${chainId}`}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect</button>
      )}
    </div>
  );
};

export default ConnectButton;