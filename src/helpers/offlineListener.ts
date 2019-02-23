export class OfflineListener {
  public onChange: (isOnline: boolean) => {};

  constructor(props) {
    this.onChange = props.onChange.bind(this);
    this.onOffline = this.onOffline.bind(this);
    this.onOnline = this.onOnline.bind(this);
  }

  public onOffline() {
    this.onChange(false);
  }

  public onOnline() {
    this.onChange(true);
  }

  public start() {
    this.onChange(window.navigator.onLine);

    window.addEventListener("offline", this.onOffline, false);
    window.addEventListener("online", this.onOnline, false);
  }

  public stop() {
    window.removeEventListener("offline", this.onOffline);
    window.removeEventListener("online", this.onOnline);
  }
}
