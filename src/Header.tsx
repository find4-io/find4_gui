import { ConnectButton, useAutoConnectWallet, useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from '@mysten/dapp-kit';
 
function Header() {
  const autoConnectionStatus = useAutoConnectWallet();
	const currentAccount = useCurrentAccount();
 
	return (
		<div style={{ padding: 20 }}>
			<ConnectButton />
			{currentAccount ? 
            <div>Auto-connection status: {autoConnectionStatus} <br /> My address {currentAccount?.address}</div> : "r"}
		</div>
	);
}

export default Header;




