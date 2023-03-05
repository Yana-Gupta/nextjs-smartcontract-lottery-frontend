import { useMoralis } from "react-moralis"
import { useEffect } from "react"

export default function Header() {
  const {
    enableWeb3,
    account,
    isWeb3Enabled,
    Moralis,
    deactivateWeb3,
    isWeb3EnableLoading,
  } = useMoralis()
  useEffect(() => {
    if (isWeb3Enabled) return
    if (typeof window != "undefined") {
      if (window.localStorage.getItem("connected")) {
        enableWeb3()
      }
    }
  }, [isWeb3Enabled])

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      console.log(`Account change to ${account}`)
      if (account == null) {
        window.localStorage.removeItem("connected")
        deactivateWeb3()
      }
    })
  }, [])
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <h1 style={{ margin: "40px" }}>Decentralized Lottery</h1>
        {account ? (
          <div
            style={{
              margin: "auto",
              padding: "5px",
              borderRadius: "30px",
              backgroundColor: "grey",
              padding: "10px 20px",
            }}
          >
            Connected to {account.slice(0, 6)}......
            {account.slice(account.length - 4, account.length)}
          </div>
        ) : (
          <button
            onClick={async () => {
              await enableWeb3()
              if (typeof window != "undefined") {
                window.localStorage.setItem("connected", "injected")
              }
            }}
            disabled={isWeb3EnableLoading}
            style={{
              margin: "auto",
              padding: "10px 26px",
              borderRadius: "50px",
              fontWeight: "bold",
            }}
          >
            Connect Wallet
          </button>
        )}
      </div>
      <span
        style={{
          height: "2px",
          backgroundColor: "white",
          display: "block",
        }}
      />
    </div>
  )
}
