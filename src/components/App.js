import AppRouter from "./Router";
import React, { useEffect, useState } from "react";
import { authService } from "../fbase";

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
  return (
    <>
      {init ? (
        <AppRouter userObj={userObj} isLoggedIn={isLoggedIn} />
      ) : (
        "Initializing..."
      )}
      <footer>&copy; Cwitter {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;
