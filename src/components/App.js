import AppRouter from "./Router";
import React, { useEffect, useState } from "react";
import { authService } from "../fbase";
import { updateProfile } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      //user의 유뮤를 파악하여 로그인 상태 변경
      if (user) {
        setIsLoggedIn(true);
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: () =>
        updateProfile(user, { displayName: user.displayName }),
    });
  };
  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          userObj={userObj}
          isLoggedIn={isLoggedIn}
        />
      ) : (
        "Initializing..."
      )}
      <footer>&copy; Cwitter {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;
