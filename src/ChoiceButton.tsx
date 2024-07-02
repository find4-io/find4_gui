import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { do_1st_shoot, do_2nd_shoot, prove_1st_shoot } from './sui_controller';

function ChoiceButton(props: any){
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    const currentAccount = useCurrentAccount();
    let transaction = new Transaction();
    if (props.status == 0) {
        transaction = do_1st_shoot(props.gameID, "shoot hashed with salt");
    }
    if (props.status == 1) {
        transaction = do_2nd_shoot(props.gameID, props.typeReal);
    }
    if (props.status == 2) {
        transaction = prove_1st_shoot(props.gameID, "salt", props.shoot);
    }
    console.log(transaction);
    return (
		<div style={{ padding: 20 }}>
			{currentAccount && (
						<button
							onClick={() => {
								signAndExecuteTransaction(
									{
										transaction: transaction!,
										chain: 'sui:devnet',
									},
									{
										onSuccess: (result) => {
											console.log('executed transaction', result);
										},
									},
								);
							}}
						>
							{props.type}
						</button>
			)}
		</div>
	);
}

export default ChoiceButton;
