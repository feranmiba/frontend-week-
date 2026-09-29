import React, { useEffect } from "react";

const EIP6963 = () => {
    const [providers, setProviders] = React.useState([])
    const [accounts, setAccounts] = React.useState("")
    const [chainId, setChainId] = React.useState(0)
    const [isConnected, setIsConnected] = React.useState(false)
    const [error, setError] = React.useState("")

    const requestEvent = new Event("eip6963:requestProvider");

    const supportedChains = [1, 8453, 56]; // they are for ethereum mainnet, base and BNB smart chain and they are supported.


    useEffect(() => {
          window.dispatchEvent(requestEvent);

        window.addEventListener("eip6963:announceProvider", (event) => {
        console.log("Provider Event:", event)
        setProviders(provider => [...providers, event.detail])
      })

    }, [])


    console.log("Providers:", providers)

    const handleConnectWallet = (provider) => async () => { 
        try {
            const accounts = await provider.request({ method: 'eth_requestAccounts' });
            setAccounts(accounts[0]);
            const chainId = await provider.request({ method: 'eth_chainId' });
            setChainId(chainId);
            if (!supportedChains.includes(parseInt(chainId, 16))) {
                setError("Unsupported chain. Please connect to a supported chain.");
                setAccounts("");
                setChainId(0);
                setIsConnected(false);
                return;
            }
            setIsConnected(true);
            setError("");
        } catch (error) {
            console.error("Error connecting wallet:", error);
        }
    }

    const handleDisconnectWallet = () => async () => {
        try {
            setAccounts("");
            setChainId(0);
            setIsConnected(false);
        } catch (error) {
            console.error("Error disconnecting wallet:", error);
        }
    }

    const handleSwitchChain = async (provider, chainId) => {
        try {
        await provider.request({
                method: "wallet_switchEthereumChain",
                params: [{chainId: chainId}]
            })
              const accounts = await provider.request({ method: 'eth_requestAccounts' });
            setAccounts(accounts[0]);
            setChainId(chainId);
            setError("");
            setIsConnected(true);
        } catch (error) {
            console.error("Error switching chain:", error);
        }
    }



    return (
        <>
        EIP 6963

        <div className="begin">
            {providers?.map((item, ID) => {
                console.log("Item:", item.info.name)
                return (
                    <div key={ID} className="outside">
                        <div className="inside">
                                                   <img src={item.info.icon} alt={item.info.name} width="50" height="50" />

                                {item.info.name}
                            </div>
                   
                 {!isConnected && (  <button onClick={handleConnectWallet(item.provider)}>connect {item.info.name}</button>
                               )}
                       {isConnected && (
                           <div>
                               <button onClick={handleDisconnectWallet()}>Disconnect</button>
                           </div>
                       )}


                        {error && (
            <div className="error">
                {error}

                <p>Kindly connect to the listed supported chains</p>

                <ul>
                    <li>Ethereum Mainnet (Chain ID: 1)  <button onClick={() => handleSwitchChain(item.provider, '0x1')}>Switch</button> </li>
                    <li>Base (Chain ID: 8453)  <button onClick={() => handleSwitchChain(item.provider, "0x2105")}>Switch</button></li>
                    <li>BNB Smart Chain (Chain ID: 56)  <button onClick={() => handleSwitchChain(item.provider, "0x38")}>Switch</button></li>
                </ul>

            </div>
        )}
                    </div>
                    
                )
            })}
        </div>


        <div>
            connected Account: {accounts}
            connected Chain ID: {chainId}
        </div>     
        </>
    )

 }

 export default EIP6963;