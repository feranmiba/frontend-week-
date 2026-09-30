const BalanceCard = ({ balance, onRefresh, isLoading = false }) => {
  if (balance === null || balance === undefined) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        margin: "12px 0",
        padding: "12px 16px",
        border: "1px solid #dfe3e8",
        borderRadius: "10px",
        background: "#f8fafc",
        maxWidth: "420px",
      }}
    >
      <div>
        <div style={{ fontSize: "12px", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em" }}>
          Balance
        </div>
        <div style={{ fontSize: "18px", fontWeight: 600, color: "#111827" }}>{balance} ETH</div>
      </div>

      <button
        onClick={onRefresh}
        disabled={isLoading}
        style={{
          marginLeft: "auto",
          padding: "8px 12px",
          borderRadius: "8px",
          border: "none",
          background: isLoading ? "#94a3b8" : "#2563eb",
          color: "#fff",
          cursor: isLoading ? "not-allowed" : "pointer",
          fontWeight: 600,
        }}
      >
        {isLoading ? "Refreshing..." : "Refresh"}
      </button>
    </div>
  );
};

export default BalanceCard;
