import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { web3 } from '@project-serum/anchor';
import { SolanaSvelteBooks } from "../target/types/solana_svelte_books";
const { SystemProgram } = web3;

describe("solana-svelte-books", () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider);

  const program = anchor.workspace.SolanaSvelteBooks as Program<SolanaSvelteBooks>;

  const bookAccount = web3.Keypair.generate();

  it("Is initialized!", async () => {

    await program.methods.createEntry("book title", "book author").accounts({
      bookAccount: bookAccount.publicKey,
      payer: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId
    }).signers([bookAccount]).rpc();

    const account = await program.account.bookAccount.fetch(bookAccount.publicKey.toString());
    console.log('account: ', account);
  });
});
