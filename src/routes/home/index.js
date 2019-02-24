import { h } from "preact";
import style from "./style";
import { Link } from "preact-router/match";
import { Button } from "preact-material-components/ts/Button";

const Home = () => (
  <div class={style.home}>
    <Button raised>
      <Link style={{ color: "white", textDecoration: "none" }} href="/game">
        Offline Game
      </Link>
    </Button>

    <Button raised>
      <Link style={{ color: "white", textDecoration: "none" }} href="/web3">
        On the Ethereum Rinkeby Network
      </Link>
    </Button>
  </div>
);

export default Home;
