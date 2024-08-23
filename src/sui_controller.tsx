import { Transaction } from '@mysten/sui/transactions';
import { useSuiClientQuery } from '@mysten/dapp-kit';

export const programAddress = '0xad85e272ff312c52cd26688d26dff413ebb464f239baa84b21cf697fd4645f76';

export const GetObjectContents = (id: string) => {
    const { data } = useSuiClientQuery('getObject', {
        id: id,
        options: {
            showContent: true,
			showOwner: true
        }
    });
	console.log(data);
    return data ? {data: (data?.data?.content as any)["fields"], version: data.data?.owner} : {data: [], version: ""};
};

export function newGameTx(player2: string): Transaction{
	const tx = new Transaction();
	tx.moveCall({ target: programAddress+"::find_four_game::initialize_game", arguments: [tx.pure.address(player2)] });
	return tx;
}

export function player_move(gameID: string, column: number, version: string): Transaction{
	const tx = new Transaction();
	tx.moveCall({ target: programAddress+"::find_four_game::player_move", arguments: [tx.sharedObjectRef({
		objectId: gameID,
		mutable: true,
		initialSharedVersion: version
	}), tx.pure.u64(column)]});
	return tx;
}
