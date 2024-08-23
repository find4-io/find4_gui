import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { GetObjectContents, player_move } from './sui_controller';
import { useParams } from 'react-router';
import ChooseColumnButton from './ChooseColumnButton';
import { useEffect, useState } from 'react';

function GameBoard() {
    let [resetBoard, setResetBoard] = useState(true);

    useEffect(()=>{
   
     },[resetBoard]) 

    const { gameID } = useParams();
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    console.log(gameID);
    let gameStats = GetObjectContents(gameID!);
    console.log(gameStats);
    const version = (gameStats.version as any).Shared.initial_shared_version;
    const current_player = gameStats.data["current_player"];
    const p1_addy = gameStats.data["p1_addy"];
    const p2_addy = gameStats.data["p2_addy"];
	const currentAccount = useCurrentAccount();
    const myTurn = ((currentAccount?.address == p1_addy && current_player == 1) || (currentAccount?.address == p2_addy && current_player == 2));

    const sendTransaction = (column: number) => {
        let transaction = player_move(gameID!, column, version);
        console.log(transaction);
		signAndExecuteTransaction({
			transaction: transaction!,
			chain: 'sui:devnet',
		}, {
		    onSuccess: (result) => {
				console.log('executed transaction', result);
			},
		});				
    };

    // If its my turn based who went first and the status, determine which type of transaction based on status
    if (myTurn){
        return (
            <>
            <button onClick={() => {sendTransaction(0)}}>0</button>
                <ChooseColumnButton column={0} gameID={gameID} version={version} />
                <ChooseColumnButton column={1} gameID={gameID} version={version} />
                <ChooseColumnButton column={2} gameID={gameID} version={version} />
            </>
        );
    }

  return (<></>);
}

export default GameBoard;
