import { h } from "preact";
import { Link } from "preact-router/match";
import style from "./style";

const Header = ({ }) => (
  <header class={style.header}>
    <nav>
      <Link activeClassName={style.active} href="/">
        <h1>Connect Four</h1>
      </Link>
    </nav>
  </header>
);

export default Header;
