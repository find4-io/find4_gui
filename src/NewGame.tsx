// import React, { useState } from 'react';
// import './App.css';
// // import { startNewGame } from './sui_controller';

// function NewGame() {
//   const [player2Addy, setPlayer2Addy] = useState('');

//   const handleChange = (val: React.ChangeEvent<HTMLInputElement>) => {
//     console.log(val.target.value);
//     setPlayer2Addy(val.target.value);
//     // setTimeout(() => {
//       console.log(player2Addy);
//     //   setTimeout(() => {
//     //     console.log(player2Addy);
//     //   }, 1000);
//     // }, 1000);
    
//   };


//   // const v = () => {
//   //   console.log(player2Addy);
//   // };


//   return ( 
//     <div className="idk">
//       <div>hello world peeps</div>
//       <input type="text" value={player2Addy} onChange={(val) => handleChange(val)} />
      
//       {/* <button onClick={() => startNewGame(player2Addy)}>Create Game</button> */}
//       {/* <button onClick={() => v()}>v</button> */}
//     </div>
//   );
// }




import { ConnectButton, useAutoConnectWallet, useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from '@mysten/dapp-kit';
import { useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { newGameTx } from './sui_controller';
import ConnectedAccount from './ConnectedAccount';
 
function NewGame() {
	const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const autoConnectionStatus = useAutoConnectWallet();
	const [digest, setDigest] = useState('');
	const currentAccount = useCurrentAccount();
  const [player2Addy, setPlayer2Addy] = useState('');

  const handleChange = (val: React.ChangeEvent<HTMLInputElement>) => {
    setPlayer2Addy(val.target.value);
  };

  const OwnedObjects = ({ address }: { address: string }): JSX.Element => {
    const { data } = useSuiClientQuery('getOwnedObjects', {
      owner: address,
    });
    if (!data) {
      return <></>;
    }
  
    return (
      <ul>
        {data.data.map((object) => (
          <li key={"j"}>
            {/* <a href={`https://example-explorer.com/object/${object.data?.objectId}`}>
              {object.data?.objectId}
            </a> */}
          </li>
        ))}
      </ul>
    );
  }
 
	return (
		<div style={{ padding: 20 }}>
			<ConnectButton />
      <div>Auto-connection status: {autoConnectionStatus}</div>
			{currentAccount && (
				<>
					<div>
          <input type="text" value={player2Addy} onChange={(val) => handleChange(val)} />
						<button
							onClick={() => {
								signAndExecuteTransaction(
									{
										transaction: newGameTx(currentAccount.address, player2Addy),
										chain: 'sui:devnet',
									},
									{
										onSuccess: (result) => {
											console.log('executed transaction', result);
											setDigest(result.digest);
										},
									},
								);
							}}
						>
							Start Game
						</button>
					</div>
					<div>Digest: {digest}</div>
          {/* <div>owned {OwnedObjects(currentAccount)}</div> */}
          <ConnectedAccount/>
				</>
			)}
		</div>
	);
}

export default NewGame;




