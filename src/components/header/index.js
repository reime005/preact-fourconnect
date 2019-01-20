import { h } from "preact";
import { Link } from "preact-router/match";
import style from "./style";

const Header = ({ isOnline }) => (
  <header class={style.header}>
    <h1>Connect Four</h1>
    <nav>
      {isOnline && (
        <Link activeClassName={style.active} href="/profile/john">
          Online
        </Link>
      )}
      {!isOnline && (
        <Link activeClassName={style.active} href="/">
          Offline
        </Link>
      )}
    </nav>
  </header>
);

export default Header;
