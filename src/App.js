import { ConnectWallet, Web3Button } from "@thirdweb-dev/react";
import "./styles/Home.css";
import { useContract, useContractWrite, useAddress, useClaimedNFTSupply, useUnclaimedNFTSupply, useActiveClaimConditionForWallet } from "@thirdweb-dev/react";
import preview from "./images/preview.gif";
import { useState } from "react";
import Swal from 'sweetalert2'

const nftDropContractAddress = "0x7025b44FFA0f4701cC3B00d4237C0FC52CE23016"

export default function Home() {

  const { contract: nftDrop } = useContract(nftDropContractAddress);
  const address = useAddress();

  const [quantity, setQuantity] = useState(1);

  const unclaimedSupply = useUnclaimedNFTSupply(nftDrop);
  console.log(Number(unclaimedSupply.data));

  const claimedSupply = useClaimedNFTSupply(nftDrop);
  console.log(Number(claimedSupply.data));

  const activeClaimCondition = useActiveClaimConditionForWallet(nftDrop, address)
  console.log("activeClaimCondition", Number(activeClaimCondition?.data?.maxClaimablePerWallet))

  console.log(activeClaimCondition?.data?.currencyMetadata.displayValue);


  return (
    <div className="container">
      <main className="mintInfoContainer">

        <div className="imageSide">
          <img
            className="image"
            src={preview}
            alt="Emoji faces NFT preview"
          />
        </div>

        <div className="mintCompletionArea">
          <div className="mintAreaLeft">
            Total Minted
          </div>

          <div className="mintAreaRight">
            <p>
              <b>{Number(claimedSupply.data)} / {Number(unclaimedSupply.data) + Number(claimedSupply.data)} </b>
            </p>
          </div>

          <div>
            <h2>Quantity</h2>
            <div className="quantityContainer">
              <button
                className="quantityControlButton"
                onClick={() => setQuantity(quantity - 1)}
                disabled={quantity <= 1} //quantity birden küçükse deaktif et dedik.
              >
                -
              </button>

              <h4>{quantity}</h4>

              <button
                className="quantityControlButton"
                onClick={() => setQuantity(quantity + 1)}
                disabled={quantity >= Number(activeClaimCondition?.data?.maxClaimablePerWallet)}
              >

                +

              </button>
            </div>
          </div>

        </div>

        <div className="mintContainer">
          {Number(unclaimedSupply?.data) + Number(claimedSupply?.data) == Number(claimedSupply.data)
            ?
            <div>
              <h2>Sold Out !!!</h2>
            </div>

            :



            <Web3Button
              contractAddress={nftDropContractAddress}
              action={(contract) => contract.erc721.claim(quantity)}
              onError={(err) => {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Something went wrong!',
                  footer: '<a href="">Why do I have this issue?</a>'
                })
              }}
              onSuccess={() => {
                Swal.fire({
                  icon: 'succes',
                  title: 'Succes!',
                  footer: '<a href="">View at Etherscan</a>'
                })
              }}

            >
              Mint NFT Mint  ({Number(activeClaimCondition.data?.currencyMetadata?.displayValue) * quantity} {activeClaimCondition.data?.currencyMetadata?.symbol} )
            </Web3Button>
          }
        </div>

      </main>
    </div>
  );
}
