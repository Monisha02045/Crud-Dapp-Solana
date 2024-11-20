"use client";

import { Keypair, PublicKey } from "@solana/web3.js";
import { ellipsify } from "../ui/ui-layout";
import { ExplorerLink } from "../cluster/cluster-ui";
import {
  useCruddappProgram,
  useCruddappProgramAccount,
} from "./cruddapp-data-access";
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

export function CruddappCreate() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const { createEntry } = useCruddappProgram();
  const { publicKey } = useWallet();

  const isFormValid = title.trim() != "" && message.trim() != "";

  const handleSubmit = () => {
    if (publicKey && isFormValid) {
      createEntry.mutateAsync({ title, message, owner: publicKey });
    }
  };

  if (!publicKey) {
    return <p>Connect Your Wallet !!</p>;
  }

  return (
    <div className="card card-body">
      <h2 className="card-title">Create Entry</h2>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Title</span>
        </label>
        <input
          type="text"
          placeholder="Title"
          className="input input-bordered"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Message</span>
        </label>
        <textarea
          placeholder="Message"
          className="textarea textarea-bordered"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <button
        className="btn btn-primary"
        onClick={handleSubmit}
        disabled={!isFormValid}
      >
        Create Entry
      </button>
    </div>
  );
}

export function CruddappList() {
  const { accounts, getProgramAccount } = useCruddappProgram();

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>
          Program account not found. Make sure you have deployed the program and
          are on the correct cluster.
        </span>
      </div>
    );
  }
  return (
    <div className={"space-y-6"}>
      {accounts.isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : accounts.data?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {accounts.data?.map((account) => (
            <CruddappCard
              key={account.publicKey.toString()}
              account={account.publicKey}
            />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h2 className={"text-2xl"}>No accounts</h2>
          No accounts found. Create one above to get started.
        </div>
      )}
    </div>
  );
}

function CruddappCard({ account }: { account: PublicKey }) {
  const { accountQuery, updateEntry, deleteEntry } = useCruddappProgramAccount({
    account,
  });

  const { publicKey } = useWallet();

  const [message, setMessage] = useState("");
  const title = accountQuery.data?.title;

  const isFormValid = message.trim() != "";

  const handleSubmit = () => {
    if (publicKey && isFormValid && title) {
      updateEntry.mutateAsync({ title, message, owner: publicKey });
    }
  };

  if (!publicKey) {
    return <p>Connect Your Wallet !!</p>;
  }

  return accountQuery.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
    <div className="card card-body">
      <h2 className="card-title" onClick={() => accountQuery.refetch()}>
        {accountQuery.data?.title}
      </h2>
      <h4 className="card-message" onClick={() => accountQuery.refetch()}>
        {accountQuery.data?.message}
      </h4>
      <div className="form-control">
        <textarea
          placeholder="Message"
          className="textarea textarea-bordered"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <div className="flex justify-between">
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!isFormValid}
        >
          Update Entry
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => {
            const title = accountQuery.data?.title;
            if (title) {
              return deleteEntry.mutateAsync(title);
            }
          }}
        >
          Delete Entry
        </button>
      </div>
    </div>
  );
}
