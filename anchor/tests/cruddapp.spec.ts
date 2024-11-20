import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { Cruddapp } from "../target/types/cruddapp";
import { publicKey } from "@coral-xyz/anchor/dist/cjs/utils";

// **--------------------------------CREATED BY BLUEDRAGON-----------------------------------------------**

describe("cruddapp", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.Cruddapp as Program<Cruddapp>;

  // **--------------------------------HAPPY TEST CASES-----------------------------------------------**

  it("Creates a new entry", async () => {
    const title = "Hello, World!";
    const message = "This is a test message.";

    await program.methods.createJournalEntry(title, message).rpc();

    const entryAddress = PublicKey.findProgramAddressSync(
      [Buffer.from(title), payer.publicKey.toBuffer()],
      program.programId
    )[0];
    console.log("Entry created:", entryAddress);
    const entry = await program.account.journalEntryState.fetch(entryAddress);
    console.log("Entry values:", entry);
  });

  it("Update an entry", async () => {
    const title = "Hello, World!";
    const newMessage = "This is an updated message.";
    const entryAddress = PublicKey.findProgramAddressSync(
      [Buffer.from(title), payer.publicKey.toBuffer()],
      program.programId
    )[0];
    const OldEntry = await program.account.journalEntryState.fetch(
      entryAddress
    );
    console.log("Old Entry values:", OldEntry);
    await program.methods.updateJournalEntry(title, newMessage).rpc();
    console.log("Entry updated address:", entryAddress);
    const updatedEntry = await program.account.journalEntryState.fetch(
      entryAddress
    );
    console.log("Entry values:", updatedEntry);
  });

  it("Reading an entry", async () => {
    const title = "Hello, World!";

    const entryAddress = PublicKey.findProgramAddressSync(
      [Buffer.from(title), payer.publicKey.toBuffer()],
      program.programId
    )[0];

    const entry = await program.account.journalEntryState.fetch(entryAddress);
    console.log("Entry values:", entry);
  });

  it("Delete an entry", async () => {
    const title = "Hello, World!";

    const entryAddress = PublicKey.findProgramAddressSync(
      [Buffer.from(title), payer.publicKey.toBuffer()],
      program.programId
    )[0];

    const entry = await program.account.journalEntryState.fetch(entryAddress);
    console.log("Old Entry values:", entry);

    await program.methods.deleteJournalEntry(title).rpc();
    try {
      const deletedEntry = await program.account.journalEntryState.fetch(
        entryAddress
      );
    } catch (error) {
      console.log("Deleted Entry values:");
    }
  });

  // **--------------------------------UNHAPPY TEST CASES-----------------------------------------------**

  it("Trying to read an entry that does not exist", async () => {
    const title = "New, World!";
    const entryAddress = PublicKey.findProgramAddressSync(
      [Buffer.from(title), payer.publicKey.toBuffer()],
      program.programId
    )[0];

    try {
      const entry = await program.account.journalEntryState.fetch(entryAddress);
    } catch (error) {
      console.log("Cannot read the non existing entry");
    }
  });

  it("Trying to update an entry that does not exist", async () => {
    const title = "New, World!";
    const newMessage = "This is an updated message.";
    try {
      await program.methods.updateJournalEntry(title, newMessage).rpc();
    } catch (error) {
      console.log("Cannot update non existing entry");
    }
  });

  it("Trying to delete an entry that does not exist", async () => {
    const title = "New, World!";
    try {
      await program.methods.deleteJournalEntry(title).rpc();
    } catch (error) {
      console.log("Cannot delete non existing entry");
    }
  });
});
