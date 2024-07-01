import React, { useState } from 'react';
import './App.css';
import NewGame from './NewGame';
import '@mysten/dapp-kit/dist/index.css';
import { Router , Route, BrowserRouter } from "react-router-dom";

// import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
// import { getFullnodeUrl } from '@mysten/sui/client';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// function App() {

//   // Config options for the networks you want to connect to
// // const network = {
// // 	devnet: { url: getFullnodeUrl('devnet') }
// // };
// const { networkConfig } = createNetworkConfig({
// 	localnet: { url: getFullnodeUrl('localnet') },
// 	mainnet: { url: getFullnodeUrl('mainnet') },
// });
// // const { networkConfig } = createNetworkConfig(network);
// const queryClient = new QueryClient();

//   return (
//     <QueryClientProvider client={queryClient}>
// 			<SuiClientProvider networks={networkConfig} defaultNetwork="localnet">
// 				<WalletProvider>
//           <div className="App">
//             <NewGame />
//           </div>
// 				</WalletProvider>
// 			</SuiClientProvider>
// 		</QueryClientProvider>
//   );
// }






// import { createNetworkConfig, SuiClientProvider } from '@mysten/dapp-kit';
// import { getFullnodeUrl } from '@mysten/sui/client';
// import { useState } from 'react';
 
// // Config options for the networks you want to connect to
// const { networkConfig } = createNetworkConfig({
// 	localnet: { url: getFullnodeUrl('localnet') },
// 	mainnet: { url: getFullnodeUrl('mainnet') },
// });
 
// function App() {
// 	const [activeNetwork, setActiveNetwork] = useState('localnet' as keyof typeof networks);
 
// 	return (
// 		<SuiClientProvider
// 			networks={networkConfig}
// 			network={activeNetwork}
// 			onNetworkChange={(network) => {
// 				setActiveNetwork(network);
// 			}}
// 		>
// 			{/* <YourApp /> */}
//       <div className="App">
//             <NewGame />
//           </div>
// 		</SuiClientProvider>
// 	);
// }

import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl, SuiClient, SuiClientOptions, SuiHTTPTransport } from '@mysten/sui/client';
import { ConnectButton } from '@mysten/dapp-kit'; 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import GameDetails from './GameDetails';

// Config options for the networks you want to connect to
const networks = {
	devnet: { url: getFullnodeUrl('devnet') },
	mainnet: { url: getFullnodeUrl('mainnet') },
} satisfies Record<string, SuiClientOptions>;
const queryClient = new QueryClient();
 
function App() {
	const [activeNetwork, setActiveNetwork] = useState('devnet' as keyof typeof networks);
	return (
		<SuiClientProvider
			networks={networks}
			network={activeNetwork}
			onNetworkChange={(network) => {
				setActiveNetwork(network as keyof typeof networks);
			}}
      // defaultNetwork="devnet"
			createClient={(network, config) => {
        return new SuiClient({ url: getFullnodeUrl('devnet') });
				// return new SuiClient({
				// 	transport: new SuiHTTPTransport({
				// 		url: 'https://api.safecoin.org',
				// 		rpc: {
				// 			headers: {
				// 				Authorization: 'xyz',
				// 			},
				// 		},
				// 	}),
				// });
			}}
		>
      
      <QueryClientProvider client={queryClient}>
        <WalletProvider>
          <div className="App">
            {/* <ConnectButton /> */}

			<BrowserRouter>
                    <div>
                    <Route path="/"  Component={NewGame} />
                    <Route path="/surveys" Component={GameDetails}/>
                    </div>
                </BrowserRouter>

            <NewGame />
          </div>
         </WalletProvider>
      </QueryClientProvider>
      
		</SuiClientProvider>
	);
}

export default App;
