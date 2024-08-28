import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { player_move } from './sui_controller';


function ChooseColumnButton(props: any){
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    const currentAccount = useCurrentAccount();
    let transaction = new Transaction();
    console.log(props.version.Shared.initial_shared_version);
    const column = props.column;
    const gameID = props.gameID;
    const version = props.version.Shared.initial_shared_version;
 
    transaction = player_move(gameID, column, version);

    const sendTransaction = () => {
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
   
    return (
		<div style={{ padding: 20 }}>
			<button onClick={() => {sendTransaction()}}>
				{column}
			</button>
		</div>
	);
}

export default ChooseColumnButton;
