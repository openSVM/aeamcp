'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { truncateAddress } from '@/lib/solana/utils';

export default function WalletButton() {
  const { publicKey, connected } = useWallet();

  return (
    <div className="flex items-center gap-2">
      <WalletMultiButton className="!bg-gradient-to-r !from-[#14F195] !to-[#9945FF] !rounded-lg !px-4 !py-2 !text-white !font-medium hover:!opacity-90 transition-opacity" />
      {connected && publicKey && (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {truncateAddress(publicKey.toString())}
        </span>
      )}
    </div>
  );
}