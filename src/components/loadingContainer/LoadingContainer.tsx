import Web3 from "web3/types";
import { Component, h } from "preact";

interface Props {
  web3: any;
  errorComp?: Component;
  loadingComp?: Component;
  drizzleStatus: {
    initialized: boolean;
  };
  accounts: string[];
  children?: any;
}

export const LoadingContainer = ({
  web3,
  errorComp,
  loadingComp,
  drizzleStatus,
  accounts,
  children
}: Props) => {
  if (web3.status === "failed") {
    if (errorComp) {
      return errorComp;
    }

    return (
      <main className="container loading-screen">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>⚠️</h1>
            <p>
              This browser has no connection to the Ethereum network. Please use
              the Chrome/FireFox extension MetaMask, or dedicated Ethereum
              browsers Mist or Parity.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (web3.status === "initialized" && Object.keys(accounts).length === 0) {
    return (
      <main className="container loading-screen">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>🦊</h1>
            <p>
              <strong>We can't find any Ethereum accounts!</strong> Please check
              and make sure Metamask or your browser are pointed at the correct
              network and your account is unlocked.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (drizzleStatus.initialized) {
    return children[0];
  }

  if (loadingComp) {
    return loadingComp;
  }

  return (
    <main className="container loading-screen">
      <div className="pure-g">
        <div className="pure-u-1-1">
          <h1>⚙️</h1>
          <p>Loading dapp...</p>
        </div>
      </div>
    </main>
  );
};
