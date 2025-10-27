import styles from "./Header.module.css";
import { APP_TITLE, APP_SUBTITLE } from "../../constants/copy";

const Header = () => {
  const { header, title, subtitle } = styles;

  return (
    <header className={header}>
      <h1 className={title}>{APP_TITLE}</h1>
      <p className={subtitle}>{APP_SUBTITLE}</p>
    </header>
  );
};

export default Header;
