import { h } from "preact";
import * as style from "./style.css";

import { Button } from "preact-material-components/ts/Button";
import "preact-material-components/Button/style.css";

interface Props {
  events: {
    [eventName: string]: {
      [blockNumber: string]: Date;
    };
  };
}

const clearLocalStorage = () => {
  localStorage && localStorage.setItem('events', null);
}

export const Events = ({
  events
}: Props) => {
  const eventNames = Object.keys(events);

  if (!events || !eventNames) {
    return null;
  }

  return (


  <div style={{
    padding: 15,
    margin: 5,
    backgroundColor: 'darkgrey',
    borderRadius: 5,
    right: 5}}>
    <div>
      <Button style={{justifyContent: 'right', marginBottom: 10}} raised onClick={clearLocalStorage}>Clear Local Events</Button>
    </div>

    <div class={style.container}>
      <div class={style.item} style={{ paddingBottom: 10 }}>
        <span><strong>Event name</strong></span>
        <span><strong>Block number</strong></span>
        <span><strong>Timestamp</strong></span>
      </div>

      {eventNames.map(eventName => {
        const blockNumbers = Object.keys(events[eventName]);
        
        return <div>
          {blockNumbers.map((blockNumber: string) => <div class={style.item}>
            <span>{eventName}</span>
            <span>{blockNumber}</span>
            <span>{new Date(events[eventName][blockNumber]).toLocaleString()}</span>
          </div>)}
        </div>
      })
    }
    </div>
    </div>
  );
};
