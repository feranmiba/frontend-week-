import ConnectButton from "./components/ConnectButton";
import BalanceCard from "./components/BalanceCard";
import { useWalletConnection } from "./hooks/useWalletConnect";

function App() {
  const { account, chainId, balance, isLoadingBalance, syncBalance, error } = useWalletConnection();

  return (
    <div style={{ fontFamily: "sans-serif", padding: "24px" }}>
      <h1 style={{ margin: "0 0 16px" }}>EIP 1193</h1>

      {account && (
        <div style={{ marginBottom: "12px" }}>
          <p style={{ margin: 0 }}>Account: {account}</p>
        </div>
      )}

      {chainId && (
        <div style={{ marginBottom: "12px" }}>
          <p style={{ margin: 0 }}>Chain ID: {chainId}</p>
        </div>
      )}

      {error && (
        <div style={{ color: "#b91c1c", marginBottom: "12px" }}>{error}</div>
      )}

      {account && (
        <BalanceCard
          balance={balance}
          isLoading={isLoadingBalance}
          onRefresh={syncBalance}
        />
      )}

      <ConnectButton />
    </div>
  );
}

export default App;
