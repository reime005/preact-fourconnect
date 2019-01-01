import { Component } from "preact";

export class OfflineListener {
  constructor(props) {
    this.onChange = props.onChange.bind(this);
    this.onOffline = this.onOffline.bind(this);
    this.onOnline = this.onOnline.bind(this);
  }

  onOffline() {
    this.onChange(false)
  }

  onOnline() {
    this.onChange(true);
  }

  start() {
    this.onChange(window.navigator.onLine);

    window.addEventListener("offline", this.onOffline, false);
		window.addEventListener("online", this.onOnline, false);
  }

  stop() {
    window.removeEventListener("offline", this.onOffline);
    window.removeEventListener("online", this.onOnline);
  }
}