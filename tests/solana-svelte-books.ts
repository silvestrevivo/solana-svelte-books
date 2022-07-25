import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { web3 } from '@project-serum/anchor';
import { SolanaSvelteBooks } from "../target/types/solana_svelte_books";
const { SystemProgram } = web3;
import bs58 from 'bs58';
import { sha256 } from 'js-sha256';

describe("solana-svelte-books", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SolanaSvelteBooks as Program<SolanaSvelteBooks>;
  const wallet = provider.wallet.publicKey;


  it("Creates entry!", async () => {

    const entryBookAccount = anchor.web3.Keypair.generate();
    await program.methods.addEntry('Cien años de soledad', 'Ernesto Sabato')
    .accounts({
      entryBook: entryBookAccount.publicKey,
      user: wallet,
      systemProgram: SystemProgram.programId
    }).signers([entryBookAccount]).rpc();


    const account = await program.account.entryBook.fetch(entryBookAccount.publicKey);
    console.log('account: ', account);
  });

  it("Creates second entry!", async () => {
    const entryBookAccount = anchor.web3.Keypair.generate();
    await program.methods.addEntry('El tunel', 'Ernesto Sabato')
    .accounts({
      entryBook: entryBookAccount.publicKey,
      user: wallet,
      systemProgram: SystemProgram.programId
    }).signers([entryBookAccount]).rpc();


    const account = await program.account.entryBook.fetch(entryBookAccount.publicKey);
    console.log('account: ', account);
  });

  it('fetches all the entry_book accounts and modify first book', async () => {

    const allEntries = await program.account.entryBook.all();
    console.log('allEntries: ', allEntries);

    const [firstElementPublicKey] = allEntries.map(i => i.publicKey);

    // modify_author
    await program.methods.modifyAuthor('Garcia Marquez')
    .accounts({
      entryBook: firstElementPublicKey,
    }).rpc();

    const allEntriesAgain = await program.account.entryBook.all();
    console.log('allEntriesAgain: ', allEntriesAgain);
  });

  it('fetches all the books written by Garcia Marquez', async () => {
    const accountDiscriminator = Buffer.from(sha256.digest('account:EntryBook')).slice(0, 8);

    const filteringBooks = await program.account.entryBook.all([
      {
          memcmp: {
              // offset: 8 + // Discriminator.
              //     4 +  // Title string prefix.
              //     100 * 4 + // Title String size (100 chars)
              //     4, // Author string prefix.
              // bytes: bs58.encode(Buffer.from('<author name>')),
              offset: 0,
              bytes: bs58.encode(accountDiscriminator)
          }
      }
    ]);

    console.log('filteringBooks', filteringBooks);
  })
});

