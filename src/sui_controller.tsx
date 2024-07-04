import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { getFaucetHost, requestSuiFromFaucetV1 } from '@mysten/sui/faucet';
import { MIST_PER_SUI } from '@mysten/sui/utils';
import { Transaction } from '@mysten/sui/transactions';
import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';
import { SuiObjectResponse } from '@mysten/sui/dist/cjs/client';

// replace <YOUR_SUI_ADDRESS> with your actual address, which is in the form 0x123...
const MY_ADDRESS = '0xafffecb090024fb85b48bb40de8a90137d3a484cee2cd926054cd41029ebca40';
// const GAME_OG_VERSION = '46';
export const programAddress = '0x4c25c62407c76a643fc8cd5fd36be7d30db6f3493b5a499b1fe544e9a34d0ffb';
 
// create a new SuiClient object pointing to the network you want to use
const suiClient = new SuiClient({ url: getFullnodeUrl('devnet') });

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

export function GetGameParticipationObjects(address: string): SuiObjectResponse[] {
	const { data } = useSuiClientQuery('getOwnedObjects', {
		owner: address, 
        filter: {
            StructType: programAddress + "::my_module::GameParticipant"
        }
	}, {});
    return data?.data!;
}

export function newGameTx(player1: string, player2: string): Transaction{
	const tx = new Transaction();
	tx.moveCall({ target: programAddress+"::my_module::new_game", arguments: [tx.pure.address(player1), tx.pure.address(player2)] });
	return tx;
}

export function hardReset(gameID: string, version: string): Transaction{
	const tx = new Transaction();
	tx.moveCall({ target: programAddress+"::my_module::hard_reset", arguments: [tx.sharedObjectRef({
		objectId: gameID,
		mutable: true,
		initialSharedVersion: version
	})] });
	return tx;
}

export function do_1st_shoot(gameID: string, hashedShoot: string, version: string): Transaction{
	const tx = new Transaction();
	tx.moveCall({ target: programAddress+"::my_module::do_1st_shoot", arguments: [tx.sharedObjectRef({
		objectId: gameID,
		mutable: true,
		initialSharedVersion: version
	}), tx.pure.string(hashedShoot)]});
	return tx;
}

export function do_2nd_shoot(gameID: string, shoot: number, version: string): Transaction{
	const tx = new Transaction();
	tx.moveCall({ target: programAddress+"::my_module::do_2nd_shoot", arguments: [tx.sharedObjectRef({
		objectId: gameID,
		mutable: true,
		initialSharedVersion: version
	}), tx.pure.u8(shoot)]});
	return tx;
}

export function prove_1st_shoot(shoot: number, gameID: string, salt: string, version: string): Transaction{
	const tx = new Transaction();
	tx.moveCall({ target: programAddress+"::my_module::prove_1st_shoot", arguments: [tx.pure.u8(shoot), tx.sharedObjectRef({
		objectId: gameID,
		mutable: true,
		initialSharedVersion: version
	}), tx.pure.string(salt)]}); //tx.pure.string(salt), tx.pure.u8(shoot)
	return tx;
}
 
// Convert MIST to Sui
const balance = (balance: { coinType?: string; coinObjectCount?: number; totalBalance: any; lockedBalance?: Record<string, string>; }) => {
	return Number.parseInt(balance.totalBalance) / Number(MIST_PER_SUI);
};
 
// store the JSON representation for the SUI the address owns before using faucet
const suiBefore = await suiClient.getBalance({
	owner: MY_ADDRESS,
});
 
await requestSuiFromFaucetV1({
	// use getFaucetHost to make sure you're using correct faucet address
	// you can also just use the address (see Sui TypeScript SDK Quick Start for values)
	host: getFaucetHost('devnet'),
	recipient: MY_ADDRESS, 
});
 
// store the JSON representation for the SUI the address owns after using faucet
const suiAfter = await suiClient.getBalance({
	owner: MY_ADDRESS,
});
 
// Output result to console.
console.log(
	`Balance before faucet: ${balance(suiBefore)} SUI. Balance after: ${balance(
		suiAfter,
	)} SUI. Hello, SUI!`,
);