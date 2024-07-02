import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { getFaucetHost, requestSuiFromFaucetV1 } from '@mysten/sui/faucet';
import { MIST_PER_SUI } from '@mysten/sui/utils';
import { Transaction } from '@mysten/sui/transactions';
import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';
import { SuiObjectResponse } from '@mysten/sui/dist/cjs/client';

// replace <YOUR_SUI_ADDRESS> with your actual address, which is in the form 0x123...
const MY_ADDRESS = '0xafffecb090024fb85b48bb40de8a90137d3a484cee2cd926054cd41029ebca40';
export const programAddress = '0x70aaf93346c0881dc04382369ba289cf584317537228616c001666c56a6ee269';
 
// create a new SuiClient object pointing to the network you want to use
const suiClient = new SuiClient({ url: getFullnodeUrl('devnet') });

export const GetObjectContents = (id: string) => {
    const { data } = useSuiClientQuery('getObject', {
        id: id,
        options: {
            showContent: true
        }
    });
    return data ? (data?.data?.content as any)["fields"] : [];
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
	tx.moveCall({ target: programAddress+"::my_module::new_game", arguments: [tx.pure.string(player1), tx.pure.address(player2)] });
	return tx;
}

export function do_1st_shoot(gameID: string, hashedShoot: string): Transaction{
	const tx = new Transaction();
	tx.moveCall({ target: programAddress+"::my_module::do_1st_shoot", arguments: [tx.sharedObjectRef({
		objectId: gameID,
		mutable: true,
		initialSharedVersion: '5'
	}), tx.pure.string("hashed")]});
	return tx;
}

export function do_2nd_shoot(gameID: string, shoot: number): Transaction{
	const tx = new Transaction();
	tx.moveCall({ target: programAddress+"::my_module::do_2nd_shoot", arguments: [tx.sharedObjectRef({
		objectId: gameID,
		mutable: true,
		initialSharedVersion: '5'
	}), tx.pure.u8(shoot)]});
	return tx;
}

export function prove_1st_shoot(gameID: string, salt: string, shoot: number): Transaction{
	const tx = new Transaction();
	tx.moveCall({ target: programAddress+"::my_module::do_2nd_shoot", arguments: [tx.sharedObjectRef({
		objectId: gameID,
		mutable: true,
		initialSharedVersion: '5'
	}), tx.pure.string(salt), tx.pure.u8(shoot)]});
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