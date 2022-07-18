import React, { useState, useEffect, useRef } from "react";
import { dbService, storageService } from "../fbase";
import { v4 as uuidv4, v4 } from "uuid";
import {
  addDoc,
  collection,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import Cweet from "../components/Cweet";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import CweetFactory from "../components/CweetFactory";
function Home({ userObj }) {
  const [cweets, setCweets] = useState([]);
  useEffect(() => {
    const q = query(
      collection(dbService, "cweets"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      const cweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCweets(cweetArr);
    });
  }, []);

  return (
    <div className="container">
      <CweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {cweets.map((cweet) => (
          <Cweet
            key={cweet.id}
            cweetObj={cweet}
            isOwner={cweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
