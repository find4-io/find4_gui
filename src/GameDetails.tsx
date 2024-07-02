import { useCurrentAccount } from '@mysten/dapp-kit';
import { GetObjectContents } from './sui_controller';
import { useParams } from 'react-router';
import ChoiceButton from './ChoiceButton';
 
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
    console.log(status == 0 && ((currentAccount?.address == player1 && who_shoots_first == 1) || (currentAccount?.address == player2 && who_shoots_first == 2)));
    
    // If its my turn based who went first and the status, determine which type of transaction based on status
    if ((status == 0 && ((currentAccount?.address == player1 && who_shoots_first == 1) || (currentAccount?.address == player2 && who_shoots_first == 2)))
        || (status == 1 && ((currentAccount?.address == player1 && who_shoots_first == 2) || (currentAccount?.address == player2 && who_shoots_first == 1)))
            || (status == 2 && ((currentAccount?.address == player1 && who_shoots_first == 1) || (currentAccount?.address == player2 && who_shoots_first == 2)))){
        return (
            <>
                <ChoiceButton typeReal={1} type="Rock" gameID={gameID} status={status} />
                <ChoiceButton typeReal={2} type="Paper" gameID={gameID} status={status} />
                <ChoiceButton typeReal={3} type="Scissors" gameID={gameID} status={status} />
            </>
        );
    }

  return (<></>);
}

export default GameDetails;
