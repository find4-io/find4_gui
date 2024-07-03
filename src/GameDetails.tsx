import { useCurrentAccount } from '@mysten/dapp-kit';
import { GetObjectContents } from './sui_controller';
import { useParams } from 'react-router';
import ChoiceButton from './ChoiceButton';
 
export function checkIfMyTurn(status: number, myAddress: string, player1: string, player2: string, who_shoots_first: number){
    return (status == 0 && ((myAddress == player1 && who_shoots_first == 1) || (myAddress == player2 && who_shoots_first == 2)))
    || (status == 1 && ((myAddress == player1 && who_shoots_first == 2) || (myAddress == player2 && who_shoots_first == 1)))
        || (status == 2);// && ((myAddress == player1 && who_shoots_first == 1) || (myAddress == player2 && who_shoots_first == 2)));
}

function GameDetails() {
    const { gameID } = useParams();
    let gameStats = GetObjectContents(gameID!);
    console.log(gameStats);
    const status = gameStats["status"];
    const player1 = gameStats["player1"];
    const player2 = gameStats["player2"];
    const who_shoots_first = gameStats["who_shoots_first"];
	const currentAccount = useCurrentAccount();
    console.log(gameID);
    console.log(status);
    console.log(status == 2 && ((currentAccount?.address == player1 && who_shoots_first == 1) || (currentAccount?.address == player2 && who_shoots_first == 2)));
    
    // If its my turn based who went first and the status, determine which type of transaction based on status
    if (checkIfMyTurn(status, currentAccount?.address!, player1, player2, who_shoots_first)){
        return (
            <>
                <ChoiceButton typeReal={1} type="Rock" gameID={gameID} status={status} />
                <ChoiceButton typeReal={2} type="Paper" gameID={gameID} status={status} />
                <ChoiceButton typeReal={3} type="Scissors" gameID={gameID} status={status} />
                {/* <ChoiceButton typeReal={4} type="Rock" gameID={gameID} status={status} /> */}
            </>
        );
    }

  return (<></>);
}

export default GameDetails;
