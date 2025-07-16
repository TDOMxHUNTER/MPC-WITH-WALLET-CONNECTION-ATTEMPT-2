
'use client';

import React from 'react';
import { useAppKit } from '@reown/appkit/react';
import { useAccount, useDisconnect, useBalance } from 'wagmi';

interface WalletConnectionProps {
  className?: string;
}

export default function WalletConnection({ className }: WalletConnectionProps) {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({
    address: address,
  });

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatBalance = (bal: any) => {
    if (!bal) return '0';
    return parseFloat(bal.formatted).toFixed(4);
  };

  if (isConnected && address) {
    return (
      <div 
        className={className}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: '12px 16px',
          borderRadius: '12px',
          background: 'rgba(0, 255, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 255, 0, 0.3)',
          color: '#ffffff',
          fontSize: '12px',
          minWidth: '160px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(0, 255, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0, 255, 0, 0.1)';
        }}
        onClick={() => open()}
      >
        <div style={{ fontWeight: 'bold', color: '#00ff00' }}>
          Connected
        </div>
        <div style={{ fontSize: '11px', opacity: 0.8 }}>
          {formatAddress(address)}
        </div>
        {balance && (
          <div style={{ fontSize: '10px', opacity: 0.7 }}>
            {formatBalance(balance)} {balance.symbol}
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      className={className}
      style={{
        padding: '12px 24px',
        borderRadius: '12px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: '#ffffff',
        fontSize: '14px',
        minWidth: '140px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
      }}
      onClick={() => open()}
    >
      Connect Wallet
    </div>
  );
}
