import React from "react";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./../firebaseConfig";
import { signOut } from "firebase/auth";

export default function Navbar() {
  const [user] = useAuthState(auth);
  return (
    <div className="navbarFixed">
      <nav className="navbar">
        <div>
          <img src="../Polarify.svg" alt="logo" className="ms-5" />
        </div>
        <Link className="navHome" to="/">
          Home{" "}
        </Link>
        <div>
          {user ? (
            <>
              <span className="pe-4">{user.displayName || user.email}</span>
              <button className="buttonLogout" onClick={() => signOut(auth)}>
                Logout
              </button>
            </>
          ) : (
            <a href="/galery" className="galery">
              Galery
            </a>
          )}
        </div>
      </nav>
    </div>
  );
}
