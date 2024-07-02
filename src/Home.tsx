import { ConnectButton, useAutoConnectWallet, useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from '@mysten/dapp-kit';
import { useEffect, useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { GetGameParticipationObjects, GetObjectContents, newGameTx } from './sui_controller';
import { SuiObjectResponse } from '@mysten/sui/dist/cjs/client';
 
function Home() {
	const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
	const [digest, setDigest] = useState('');
	const currentAccount = useCurrentAccount();
  	const [player2Addy, setPlayer2Addy] = useState('');
  	// const [gameParticipates, setGameParticipation] = useState([{}]);
	const p = GetGameParticipationObjects(currentAccount?.address!);
	console.log(p);

  const handleChange = (val: React.ChangeEvent<HTMLInputElement>) => {
    setPlayer2Addy(val.target.value);
  };
 
	return (
		<div style={{ padding: 20 }}>
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

					<ul>
						{p ? p.map((object) => { 
							console.log(object);
							// let gameP = GetObjectContents(object.data?.objectId);
							return (
								<li key={1}>
									{/* <a href="/{object.id}"><button>{GetObjectContents(object.data?.objectId!)["game_addy"]}</button></a>  */}
									<GameItem object={object}/>
								</li>
							)	
						}) : ""}
					</ul>

				</>
			)} 
		</div>
	);
}

export default Home;

function GameItem(props: any) {
	const game_addy = GetObjectContents(props.object.data?.objectId!)["game_addy"];
	return (<a href={"/game/"+game_addy}><button>{game_addy}</button></a>);
}




