import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { do_1st_shoot, do_2nd_shoot, hardReset, prove_1st_shoot } from './sui_controller';
// import { Md5 } from 'ts-md5';
// const SHA2 = require("sha2");
// const {SHA256, SHA384} = require("sha2");
// const SHA2 = require("sha2");
// import { createHash } from 'crypto';
import { sha256, sha224 } from 'js-sha256';
// import * as crypto from 'crypto-browserify';

// function hashToSHA256(input: string): string {
//     return createHash('sha256').update(input).digest('hex');
// }

function saltMaker(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 26; i++ ){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
    return text;
}

// function myHash(str: any) {
//     const utf8 = new TextEncoder().encode(str);
//     return crypto.subtle.digest('SHA-256', utf8).then((hashBuffer) => {
//       const hashArray = Array.from(new Uint8Array(hashBuffer));
//       const hashHex = hashArray
//         .map((bytes) => bytes.toString(16).padStart(2, '0'))
//         .join('');
//       return hashHex;
//     });
//   }

function ChoiceButton(props: any){
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    const currentAccount = useCurrentAccount();
    let transaction = new Transaction();
    console.log(props.status);
    console.log(props.version.Shared.initial_shared_version);
    const version = props.version.Shared.initial_shared_version;
    const salt = saltMaker();
    if (props.status == 0) {
        
        const w = salt+props.typeReal;
        // const x = myHash(w);
        // const sha2 = SHA2.SHA256(w);
        // x.then(str => {
        //     transaction = do_1st_shoot(props.gameID, str, version);
        // });
        transaction = do_1st_shoot(props.gameID, sha256(w), version); //sha256(w)
        console.log("salt");
        console.log(salt);
        console.log("hash");
        console.log(sha256(w));
    }
    if (props.status == 1) {
        transaction = do_2nd_shoot(props.gameID, props.typeReal, version);
    }
    // if (props.status == 2 && props.typeReal == 4) {
    //     transaction = hardReset(props.gameID);
    // }

    if (props.status == 2) { // && props.typeReal != 4) {
        // console.log("la bamba");
        transaction = prove_1st_shoot(props.typeReal, props.gameID, "VlU3RWyR49XUyKsym8gndGHKKj", version);
    }
    return (
		<div style={{ padding: 20 }}>
			{currentAccount && (
						<button
							onClick={() => {
                                console.log(transaction);
                                console.log(salt);
								signAndExecuteTransaction(
									{
										transaction: transaction!,
										chain: 'sui:devnet',
									},
									{
										onSuccess: (result) => {
											console.log('executed transaction', result);
                                            console.log(salt);
                                            console.log(salt);
                                            console.log(salt);
                                            console.log(salt);
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
