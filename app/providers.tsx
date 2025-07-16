'use client';

import { useEffect, useState } from 'react';
import { createAppKit } from '@reown/appkit/react';
import { WagmiProvider } from 'wagmi';
import { arbitrum, mainnet } from '@reown/appkit/networks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { monadTestnet } from './config/chains';

// Setup queryClient
const queryClient = new QueryClient();

// Your WalletConnect Cloud project ID
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  console.warn('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set - wallet functionality will be limited');
}

// Create a metadata object
const metadata = {
  name: 'Monad Profile Card',
  description: 'Create and customize your unique Monad profile card with holographic effects',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://monadprofilecard.vercel.app/',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
};

// Convert your Monad testnet to AppKit format
const networks = [
  {
    id: 10143,
    name: 'Monad Testnet',
    nativeCurrency: {
      name: 'MON',
      symbol: 'MON',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://testnet-rpc.monad.xyz/'],
      },
      public: {
        http: ['https://testnet-rpc.monad.xyz/'],
      },
    },
    blockExplorers: {
      default: {
        name: 'Monad Explorer',
        url: 'https://testnet.monadexplorer.com/',
      },
    },
    testnet: true,
  },
  mainnet,
  arbitrum
];

// Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  storage: typeof window !== 'undefined' ? localStorage : undefined,
  ssr: true,
  projectId,
  networks
});

// Create the modal only if we have a valid project ID
if (projectId) {
  try {
    createAppKit({
      adapters: [wagmiAdapter],
      projectId,
      networks: [monadTestnet],
      defaultNetwork: monadTestnet, // Monad testnet as default
      metadata: metadata,
      features: {
        analytics: false, // Disable analytics to reduce console noise
      },
      enableOnramp: false, // Disable onramp to reduce API calls
      enableSwaps: false, // Disable swaps to reduce API calls
    });
  } catch (error: any) {
    // Suppress common configuration errors to reduce console noise
    if (error?.message?.includes('not found on allow list') || 
        error?.message?.includes('Project ID Not Configured')) {
      // Silently handle these errors as they're configuration issues
      return;
    }
    console.warn('AppKit initialization issue:', error?.message || 'Unknown error');
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#000000',
        color: '#ffffff'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}