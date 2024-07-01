import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';
import { SuiObjectResponse } from '@mysten/sui/dist/cjs/client';

function ConnectedAccount() {
	const account = useCurrentAccount();

	if (!account) {
		return null;
	}

	return (
		<div>
			<div>Connected to {account.address}</div>;
			<OwnedObjects address={account.address} />
		</div>
	);
}

function GetObjectContents(props: any) {
    // console.log("penis");
    const { data } = useSuiClientQuery('getObject', {
        id: props.id,
        options: {
            showContent: true
        }
    });
    console.log((data?.data?.content as any)["fields"]);
    return (data?.data?.content as any)["fields"];
};

function OwnedObjects({ address }: { address: string }) {

	const { data } = useSuiClientQuery('getOwnedObjects', {
		owner: address, 
        filter: {
            StructType: "0x1012df33e76a2ef5a57da9642ff438a8923588f1dd22383dc22e3c0c5eee66c3::my_module::GameParticipant"
        }
	}, {});
    console.log("l8");
    // const  data2  = useSuiClientQuery('getObject', {
    //     id: "0xe577e3cad44ea319b2f8a40875ec5a51558211690e6934d1e695ce31cf1efcdc",
    //     options: {
    //         showContent: true
    //     }
    // });
	if (!data) {
		return null;
	}
    // console.log("l5");
    // console.log(data2.data?.data);
    // console.log("l7");
    // data.data.forEach((object) => {
    //     GetObjectContents(object);
    //     // console.log(object);
    // });
    console.log(data.data);
	return (
		<ul>
			{data.data.map((object) => { 
                console.log(object.data);
                
                // console.log(objData);
                return (
				<li key={1}>
					{/* <a href={`https://example-explorer.com/object/${object.data?.objectId}`}>
						{object.data?.objectId}
					</a> */}
                    <GetObjectContents id={object.data?.objectId}/>
                    <button onClick={() => GetObjectContents(object.data!.objectId)}>{object.data?.content?.dataType}</button>
				</li>
			)})}
		</ul>
	);
}

export default ConnectedAccount;