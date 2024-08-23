import { ConnectButton, useAutoConnectWallet, useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from '@mysten/dapp-kit';
import { useEffect, useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
// import { GetGameParticipationObjects, GetObjectContents, newGameTx } from './sui_controller';
// import { SuiObjectResponse } from '@mysten/sui/dist/cjs/client';
// import { checkIfMyTurn } from './GameBoard';
 
function Home() {
	const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
	const [digest, setDigest] = useState('');
	const currentAccount = useCurrentAccount();
  	const [player2Addy, setPlayer2Addy] = useState('');
  	// const [gameParticipates, setGameParticipation] = useState([{}]);
	// const p = GetGameParticipationObjects(currentAccount?.address!);
	// console.log(p);

  const handleChange = (val: React.ChangeEvent<HTMLInputElement>) => {
    setPlayer2Addy(val.target.value);
  };
 
	return (
		<a href={"/game/"/*+game_addy*/} className='gameListItemLink'>
            <button className="details-button">View Details</button>
		</a>
	);
}

export default Home;





