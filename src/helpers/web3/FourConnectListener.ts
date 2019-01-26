import { Drizzle, generateStore } from 'drizzle';
import { delay } from '../delay';
import getWeb3 from './getWeb3';

type GameMode = 'new' | 'old';

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
  private options: Options;
  
  constructor(props: Props) {
    this.options = props.options;
    this._pollForChanges();
  }

  public async start(): Promise<any> {
    return new Promise(async (res, rej) => {
      if (!this.drizzle) {
        let web3 = null;

        try {
          web3 = await getWeb3();
        } catch (e) {
          rej(e);
        }

        if (!web3) {
          rej('No Web3 Instance');
          return;
        }

        const drizzleStore = generateStore(this.options.drizzleOptions);
        this.drizzle = new Drizzle(this.options.drizzleOptions, drizzleStore);

        await delay(5000);

        let state = {
          drizzleStatus: {
            initialized: false,
          }
        }; 
        
        while (state.drizzleStatus && !state.drizzleStatus.initialized) {
          state = this.drizzle && this.drizzle.store.getState();

          await delay(2000);
        }

        if (state.drizzleStatus && state.drizzleStatus.initialized!) {
          res(web3);
        } else {
          rej('Error');
        }
      }
    });
  }

  public async callMethod(methodName: string, ...args: any[]): Promise<any> {
    return new Promise<any>(async (res, rej) => {
      if (!this.drizzle) {
        rej('No drizzle');
        return;
      }

      let state = this.drizzle && this.drizzle.store && this.drizzle.store.getState();

      // If Drizzle is initialized (and therefore web3, accounts and contracts), continue.
      if (state.drizzleStatus.initialized && this.drizzle.contracts.FourConnect.methods[methodName]) {
        const dataKey = this.drizzle.contracts.FourConnect.methods[methodName].cacheCall(...args);
        console.warn(this.drizzle.contracts.FourConnect.methods[methodName]);
        console.warn(...args);
        
        await delay(4000);
        state = this.drizzle.store.getState();

        if (
          state.contracts.FourConnect[methodName] &&
          state.contracts.FourConnect[methodName][dataKey]
        ) {
          res(state.contracts.FourConnect[methodName][dataKey].value || []);
          return;
        } 
      }

      rej();
    });
  }

  public async getStatus(stackId: number): Promise<string> {
    return new Promise<string>(async (res, rej) => {
      if (!this.drizzle) {
        rej('No drizzle');
        return;
      }

      const state = this.drizzle && this.drizzle.store && this.drizzle.store.getState();

      if (state.drizzleStatus.initialized) {
        if (state.transactionStack[stackId]) {
          const txHash = state.transactionStack[stackId];

          res(state.transactions[txHash].status);
        } else {
          rej('StackID not available');
        }
      }
    });
  }

  public async cacheSend(methodName: string, ...args: any[]): Promise<any> {
    return new Promise<any>(async (res, rej) => {
      if (!this.drizzle) {
        rej('No drizzle');
        return;
      }

      const state = this.drizzle && this.drizzle.store && this.drizzle.store.getState();

      // If Drizzle is initialized (and therefore web3, accounts and contracts), continue.
      if (state.drizzleStatus.initialized && this.drizzle.contracts.FourConnect.methods[methodName]) {
        res(this.drizzle.contracts.FourConnect.methods[methodName].cacheSend(...args));
        return;
      }

      rej();
    });
  }

  public async stop(): Promise<any> {
    return new Promise((res) => {
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
