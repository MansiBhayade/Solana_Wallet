import { WalletAdapterNetwork, WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';


import '../src/css/bootstrap.css'
import {
    
    PhantomWalletAdapter,
    

} from '@solana/wallet-adapter-wallets';


import { clusterApiUrl, Transaction, SystemProgram, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import React, { FC, ReactNode, useMemo, useCallback, useState } from 'react';

// import { actions, utils, programs, NodeWallet, Connection} from '@metaplex/js'; 



require('./App.css');
require('@solana/wallet-adapter-react-ui/styles.css');
let thelamports = 0;
let theWallet = "DS2Ma4nHVz3WSM2UJF6od5K4yAYtjmZ5R2KyQAWvvCuz"
const App: FC = () => {


    return (
        <Context>
            <Content />
        </Context>
    );
};


export default App;

const Context: FC<{ children: ReactNode }> = ({ children }) => {
    // The network can be set to 'devnet', 'testnet'
    const network = WalletAdapterNetwork.Testnet;

    
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    // wallets used
    const wallets = useMemo(
        () => [
            
            new PhantomWalletAdapter(),
           
        ],
        [network]
    );

   

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

const Content: FC = () => {
    let [lamports, setLamports] = useState(.1);
    let [wallet, setWallet] = useState("DS2Ma4nHVz3WSM2UJF6od5K4yAYtjmZ5R2KyQAWvvCuz");

  
    

     const { connection } = useConnection();
    // const connection = new Connection(clusterApiUrl("Testnet"))
    const { publicKey, sendTransaction } = useWallet();


 

    const onClick = useCallback( async () => {

        if (!publicKey) throw new WalletNotConnectedError();
        connection.getBalance(publicKey).then((bal) => {
            console.log(bal/LAMPORTS_PER_SOL);

        });

        let lamportsI = LAMPORTS_PER_SOL*lamports;
        console.log(publicKey.toBase58());
        console.log("lamports sending: {}", thelamports)
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: new PublicKey(theWallet),
                lamports: lamportsI,
            })
        );

        const signature = await sendTransaction(transaction, connection);

        await connection.confirmTransaction(signature, 'processed');
    }, [publicKey, sendTransaction, connection]);

    
function setTheLamports(e: any)
{
    console.log(Number(e.target.value));
    setLamports(Number(e.target.value));
    lamports = e.target.value;
    thelamports = lamports;
}
function setTheWallet(e: any){
    setWallet(e.target.value)
    theWallet = e.target.value;
}
    return (
       

        <div className="App">
                <div className="navbar">
        <div className="navbar-inner ">
          {/* <a id="title" className="brand" href="#">Brand</a> */}
          <ul className="nav">


          </ul>
          <ul className="nav pull-right">
                      {/* <li><a href="#">White Paper</a></li> */}
                      <li className="divider-vertical"></li>
                      <li><WalletMultiButton /></li>

                    </ul>
        </div>
      </div>
      <input placeholder='wallet to send' type='text' onChange={e => setTheWallet(e)}/>
<input placeholder='lamports' type='number' onChange={e => setTheLamports(e)} />
        <br></br>
      <button className='btn' onClick={onClick}>Send Lamports </button>


        </div>
    );
};
