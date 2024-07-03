import { ConnectButton, useAutoConnectWallet, useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from '@mysten/dapp-kit';
import { useEffect, useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { GetGameParticipationObjects, GetObjectContents, newGameTx } from './sui_controller';
import { SuiObjectResponse } from '@mysten/sui/dist/cjs/client';
import { checkIfMyTurn } from './GameDetails';
 
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
								<>
									{/* <a href="/{object.id}"><button>{GetObjectContents(object.data?.objectId!)["game_addy"]}</button></a>  */}
									<GameItem object={object} myAddress={currentAccount.address} />
								</>
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
	const gameStats = GetObjectContents(game_addy);
	const opponent_addy = (gameStats["player1"] == props.myAddress ? gameStats["player2"] : gameStats["player1"]);
	const myWins = (gameStats["player1"] == props.myAddress ? gameStats["wins1"] : gameStats["wins2"]);
	const opponentWins = (gameStats["player1"] == props.myAddress ? gameStats["wins2"] : gameStats["wins1"]);
	const myTurn = checkIfMyTurn(gameStats["status"], props.myAddress, gameStats["player1"], gameStats["player2"], gameStats["who_shoots_first"]);
	console.log(myTurn);
	return (
		<div className="games-container">
            <div className="game-card">
                <div className="game-info">
                    <p>Game ID: <span className="game-id">{game_addy}</span></p>
                    <p>Opponent: <span className="opponent-name">{opponent_addy}</span></p>
                    <p>Score: <span className="current-score">{myWins+"-"+opponentWins}</span></p>
                    <p>Turn: <span className="current-turn">{myTurn ? "Mine" : "Theirs"}</span></p>
                </div>
				<a href={"/game/"+game_addy} className='gameListItemLink'>
                	<button className="details-button">View Details</button>
				</a>
            </div>
            
        </div>
		// <a href={"/game/"+game_addy} className='gameListItemLink'>
		// 	<div className={(myTurn ? "green" : "red") + " gameListItem"}>
		// 		{game_addy+"\nagainst\n"+(gameStats["player1"] == props.myAddress ? gameStats["player2"] : gameStats["player1"])}
		// 	</div>
		// </a>
	);
}




