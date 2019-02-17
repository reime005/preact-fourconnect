import { Drizzle, generateStore } from "drizzle";
import { delay } from "../delay";
import getWeb3 from "./getWeb3";
import Web3 from "web3/types";

type GameMode = "new" | "old";

interface Options {
  gameMode: GameMode;
  gameId?: number;
  drizzleOptions: object;
}

interface Props {
  options: Options;
}

export class FourConnectListener {
  private pollForChangesId: any;
  private drizzle: Drizzle;
  private web3: Web3;
  private options: Options;
  private eventSubscriptions: {
    [eventName: string]: string;
  };

  constructor(props: Props) {
    this.options = props.options;
    this.eventSubscriptions = {};
    this._pollForChanges();
  }

  public async start(): Promise<{
    web3: any;
    maxCreationTimeout: number;
    maxMoveTimeout: number;
  }> {
    return new Promise<any>(async (res, rej) => {
      if (!this.drizzle) {
        this.web3 = null;

        try {
          this.web3 = await getWeb3();
        } catch (e) {
          // rej(e);
        }

        if (!this.web3) {
          rej("No Web3 Instance");
          return;
        }

        const drizzleStore = generateStore(this.options.drizzleOptions);
        this.drizzle = new Drizzle(this.options.drizzleOptions, drizzleStore);

        let state = {
          drizzleStatus: {
            initialized: false
          }
        };

        while (state.drizzleStatus && !state.drizzleStatus.initialized) {
          state = this.drizzle && this.drizzle.store.getState();

          await delay(2000);
        }

        

        if (state.drizzleStatus && state.drizzleStatus.initialized) {
          const maxCreationTimeout = await this.callMethod(
            "getMaxCreationTimeout"
          );
          const maxMoveTimeout = await this.callMethod("getMaxMoveTimeout");

          console.warn(maxMoveTimeout);
          res({ web3: this.web3, maxCreationTimeout, maxMoveTimeout });
        } else {
          rej("Error");
        }
      }
    });
  }

  public getWeb3() {
    return this.web3;
  }

  public subscribeEvent(
    eventName: string,
    callback: (error: any, evt: any) => void,
    args: any = {}
  ) {
    const state =
      this.drizzle && this.drizzle.store && this.drizzle.store.getState();
    const events =
      this.drizzle &&
      this.drizzle.contracts &&
      this.drizzle.contracts.FourConnect &&
      this.drizzle.contracts.FourConnect.events;

    if (!state || !state.drizzleStatus.initialized || !events[eventName]) {
      return;
    }

    if (this.eventSubscriptions[eventName]) {
      this.unsubscribeEvent(eventName);
    }

    events[eventName]({ ...args }).on("data", evt => {
      console.log(evt);
      console.log(args.filter);
      
      if (args.filter) {
        Object.keys(args.filter).forEach(key => {
          if (args.filter[key].includes(evt.returnValues[key])) {
            callback(null, evt);
          }
        });
      } else {
        callback(null, evt);
      }
    });

    this.eventSubscriptions[eventName] = eventName;
  }

  public unsubscribeEvent(eventName: string) {
    if (this.eventSubscriptions[eventName]) {
      //TODO: [mr] remove listener
      delete this.eventSubscriptions[eventName];
    }
  }

  public unsubscribeAllEvents() {
    Object.keys(this.eventSubscriptions).forEach(key => {
      //TODO: [mr] remove listener
      delete this.eventSubscriptions[key];
    });
  }

  public async callMethod(methodName: string, ...args: any[]): Promise<any> {
    return new Promise<any>(async (res, rej) => {
      if (!this.drizzle) {
        rej("No drizzle");
        return;
      }

      let state =
        this.drizzle && this.drizzle.store && this.drizzle.store.getState();

      // If Drizzle is initialized (and therefore web3, accounts and contracts), continue.
      if (
        state.drizzleStatus.initialized &&
        this.drizzle.contracts.FourConnect.methods[methodName]
      ) {
        const dataKey = this.drizzle.contracts.FourConnect.methods[
          methodName
        ].cacheCall(...args);
        // console.warn(this.drizzle.contracts.FourConnect.methods[methodName]);
        // console.warn(...args);

        while (
          !state.contracts.FourConnect[methodName][dataKey]) {
          state = this.drizzle.store.getState();
          await delay(100);
        }

        if (
          state.contracts.FourConnect[methodName] &&
          state.contracts.FourConnect[methodName][dataKey]
        ) {
          res(state.contracts.FourConnect[methodName][dataKey].value || []);
          return;
        }
      }

      rej('callMethod issue');
    });
  }

  public async getStatus(stackId: number): Promise<string> {
    return new Promise<string>(async (res, rej) => {
      if (!this.drizzle) {
        rej("No drizzle");
        return;
      }

      const state =
        this.drizzle && this.drizzle.store && this.drizzle.store.getState();

      if (state.drizzleStatus.initialized) {
        if (state.transactionStack[stackId]) {
          const txHash = state.transactionStack[stackId];

          res(state.transactions[txHash].status);
        } else {
          rej("StackID not available");
        }
      }
    });
  }

  public async cacheSend(methodName: string, ...args: any[]): Promise<any> {
    return new Promise<any>(async (res, rej) => {
      if (!this.drizzle) {
        rej("No drizzle");
        return;
      }

      const state =
        this.drizzle && this.drizzle.store && this.drizzle.store.getState();

      // If Drizzle is initialized (and therefore web3, accounts and contracts), continue.
      if (
        state.drizzleStatus.initialized &&
        this.drizzle.contracts.FourConnect.methods[methodName]
      ) {
        res(
          this.drizzle.contracts.FourConnect.methods[methodName].cacheSend(
            ...args
          )
        );
        return;
      }

      rej();
    });
  }

  public async stop(): Promise<any> {
    return new Promise(res => {
      if (!this.pollForChangesId) {
        clearInterval(this.pollForChangesId);
        res();
      }
    });
  }

  private _pollForChanges(): void {
    if (!this.pollForChangesId) {
      this.pollForChangesId = setInterval(() => {
        this._poll();
      }, 2000);
    }
  }

  private _poll(): void {
    if (!this.drizzle) {
      return;
    }
  }
}

export default FourConnectListener;
