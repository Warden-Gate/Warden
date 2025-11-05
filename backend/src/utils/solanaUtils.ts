import {
  Connection,
  PublicKey,
  Keypair,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
} from "@solana/web3.js";

const RPC_URL = process.env.SOLANA_RPC_URL || clusterApiUrl("devnet");

export const connection = new Connection(RPC_URL, "confirmed");

/**
 * ✅ Verify a Solana transaction belongs to a payer
 */
export async function verifySolanaTx(
  txHash: string,
  payer: string
): Promise<boolean> {
  try {
    const tx = await connection.getTransaction(txHash, {
      commitment: "confirmed",
    });
    if (!tx) return false;
    return tx.transaction.message.accountKeys.some(
      (key) => key.toBase58() === payer
    );
  } catch (e) {
    console.error("verifySolanaTx error:", e);
    return false;
  }
}

/**
 * 🪙 Create a temporary devnet wallet (for receiving test tips)
 */
export async function createDevnetWallet(): Promise<{
  keypair: Keypair;
  publicKey: PublicKey;
}> {
  const keypair = Keypair.generate();
  return { keypair, publicKey: keypair.publicKey };
}

/**
 * 💧 Airdrop SOL to the wallet for transaction fees (devnet only)
 */
export async function airdropSol(
  connection: Connection,
  recipient: PublicKey,
  amount: number = 1
): Promise<void> {
  const sig = await connection.requestAirdrop(
    recipient,
    amount * LAMPORTS_PER_SOL
  );
  await connection.confirmTransaction(sig, "confirmed");
  console.log(`💧 Airdropped ${amount} SOL to ${recipient.toBase58()}`);
}
