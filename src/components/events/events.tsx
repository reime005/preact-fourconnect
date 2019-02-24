import { h } from "preact";
import * as style from "./style.css";

import "preact-material-components/Button/style.css";
import { Button } from "preact-material-components/ts/Button";

interface Props {
  events: {
    [eventName: string]: {
      [blockNumber: string]: {
        timestamp: Date,
        gameId: number,
      };
    };
  };
}

const clearLocalStorage = () => {
  localStorage && localStorage.setItem("events", "{}");
};

export const Events = ({
  events = {},
}: Props) => {

  if (!events) {
    return null;
  }

  const eventNames = Object.keys(events);

  return (


  <div class={style.outer}>
    <div>
      <Button style={{justifyContent: "right", marginBottom: 10}} raised onClick={clearLocalStorage}>Clear Local Events</Button>
    </div>

    <div class={style.container}>
      <div class={style.item} style={{ paddingBottom: 10 }}>
        <span><strong>Event name</strong></span>
        {/* <span><strong>Block number</strong></span> */}
        <span><strong>Game ID</strong></span>
        <span><strong>Timestamp</strong></span>
      </div>

      {eventNames.map((eventName) => {
        const blockNumbers = Object.keys(events[eventName]);

        return <div>
          {blockNumbers.map((blockNumber: string) => <div class={style.item}>
            <span>{eventName.replace("logGame", "")}</span>
            {/* <span>{blockNumber}</span> */}
            <span>{events[eventName][blockNumber].gameId}</span>
            <span>{new Date(events[eventName][blockNumber].timestamp).toLocaleString()}</span>
          </div>)}
        </div>;
      })
    }
    </div>
    </div>
  );
};
