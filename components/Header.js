import { ConnectButton } from "web3uikit"

export default function Header() {
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <h1 style={{ margin: "40px" }}>Decentralized Lottery</h1>
        <ConnectButton style={{ margin: "40px" }} moralisAuth={false} />
      </div>
      <span
        style={{
          display: "block",
          height: "2px",
          backgroundColor: "white",
        }}
      />
    </div>
  )
}
