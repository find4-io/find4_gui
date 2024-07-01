import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { getFaucetHost, requestSuiFromFaucetV1 } from '@mysten/sui/faucet';
import { MIST_PER_SUI } from '@mysten/sui/utils';
import { Transaction } from '@mysten/sui/transactions';
 
// replace <YOUR_SUI_ADDRESS> with your actual address, which is in the form 0x123...
const MY_ADDRESS = '0xafffecb090024fb85b48bb40de8a90137d3a484cee2cd926054cd41029ebca40';
const programAddress = '0x1012df33e76a2ef5a57da9642ff438a8923588f1dd22383dc22e3c0c5eee66c3';
 
// create a new SuiClient object pointing to the network you want to use
const suiClient = new SuiClient({ url: getFullnodeUrl('devnet') });

export function newGameTx(player1: string, player2: string): Transaction{
	const tx = new Transaction();
	tx.moveCall({ target: programAddress+"::my_module::new_game", arguments: [tx.pure.address(player1), tx.pure.address(player2)] })
	// suiClient.signAndExecuteTransaction({ signer: keypair, transaction: tx });
	console.log(tx);
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