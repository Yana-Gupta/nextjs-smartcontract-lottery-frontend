import { abi, contractAddresses } from "../constants"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEnterence() {
  const [entrancefee, setEntrancefee] = useState()
  const [numPlayers, setNumPlayers] = useState()
  const [recentWinner, setRecentWinner] = useState()

  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
  const chainId = parseInt(chainIdHex, 16)
  const lotteryAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null

  const { runContractFunction: enterLottery } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress,
    functionName: "enterLottery",
    params: {},
    msgValue: entrancefee,
  })

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress,
    functionName: "getEntranceFee",
    params: {},
  })

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  })

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress,
    functionName: "getRecentWinner",
    params: {},
  })
  async function updateUI() {
    const fee = await getEntranceFee()
    setEntrancefee(fee)
    const numOfPlayers = (await getNumberOfPlayers()).toString()
    setNumPlayers(numOfPlayers)
    const lastWinner = (await getRecentWinner()).toString()
    setRecentWinner(lastWinner)
    // console.log(entrancefee, numPlayers, lastWinner)
  }
  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI()
    }
  }, [isWeb3Enabled])

  const dispatch = useNotification()

  const handleSuccess = async function (tx) {
    await tx.wait(1)
    handleNewNotification(tx)
    updateUI()
  }

  const handleNewNotification = function () {
    dispatch({
      type: "success",
      message: "Transaction Completed \nYohoo! 🥳 You entered the raffle!",
      title: "Tx Notification.",
      position: "topL",
    })
  }

  return (
    <div style={{ padding: "20px 40px" }}>
      {lotteryAddress ? (
        <div>
          {entrancefee && (
            <p>Entrance Fee: {ethers.utils.formatUnits(entrancefee)}</p>
          )}
          {numPlayers && <p>Number of Players: {numPlayers}</p>}
          {recentWinner && <p>Last Winner: {recentWinner}</p>}
          <br />
          <button
            style={{
              margin: "10px 0px",
              padding: "8px 15px",
              borderRadius: "8px",
            }}
            onClick={async function () {
              await enterLottery({
                onSuccess: handleSuccess,
                onError: (e) => console.log(e),
              })
            }}
          >
            Enter Lottery
          </button>
        </div>
      ) : (
        <div>No Lottery Address Found.</div>
      )}
    </div>
  )
}
