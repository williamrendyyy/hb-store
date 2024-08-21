import { signIn, signOut, useSession } from "next-auth/react";
import styles from "./Navbar.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { useState } from "react";

const NavItem = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Products",
    url: "/products",
  },
];

const Navbar = () => {
  const { data }: any = useSession();
  const { pathname, push } = useRouter();
  const [dropdownUser, setDropdownUser] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = () => {
    if (searchQuery.trim()) {
      push(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className={styles.navbar}>
      <h1 className={styles.navbar__title}>HB STORE</h1>
      <div className={styles.navbar__nav}>
        {NavItem.map((item) => (
          <Link
            key={`nav-${item.title}`}
            className={`${styles.navbar__nav__item} ${
              pathname === item.url && styles["navbar__nav__item--active"]
            }`}
            href={item.url}
          >
            {item.title}
          </Link>
        ))}
      </div>

      <div className={styles.navbar__search}>
        <input
          type="text"
          placeholder="Search for items..."
          className={styles.navbar__search__input}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className={styles.navbar__search__button}
          onClick={handleSearch}
        >
          <i className="bx bx-search" />
        </button>
      </div>

      {data ? (
        <div className={styles.navbar__user}>
          <div className={styles.navbar__user__cart}>
            <Link href={"/cart"}>
              <i
                className={`bx bx-shopping-bag ${styles.navbar__user__cart__icon}`}
              />
            </Link>
          </div>
          <div className={styles.navbar__user__profile}>
            <Image
              width={40}
              height={40}
              src={data?.user.image}
              alt={data?.user.name}
              className={styles.navbar__user__profile__image}
              onClick={() => setDropdownUser(!dropdownUser)}
            />
            <div
              className={`${styles.navbar__user__profile__dropdown} ${
                dropdownUser &&
                styles["navbar__user__profile__dropdown--active"]
              }`}
            >
              <button
                className={styles.navbar__user__profile__dropdown__item}
                onClick={() => push("/admin")}
              >
                Admin Only
              </button>

              <button
                className={styles.navbar__user__profile__dropdown__item}
                onClick={() => push("/member/profile")}
              >
                Profile
              </button>

              <button
                className={styles.navbar__user__profile__dropdown__item}
                onClick={() => signOut()}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          className={styles.navbar__button}
          onClick={() => signIn()}
        >
          Login
        </Button>
      )}
    </div>
  );
};

export default Navbar;
