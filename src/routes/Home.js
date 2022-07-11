import React, { useState, useEffect } from "react";
import { dbService } from "../fbase";
import {
  addDoc,
  collection,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import Cweet from "../components/Cweet";
function Home({ userObj }) {
  const [cweet, setCweet] = useState("");
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
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(dbService, "cweets"), {
        text: cweet,
        createdAt: Date.now(),
        creatorId: userObj.uid,
      });
    } catch (error) {
      console.log(error);
    }
    setCweet("");
  };
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setCweet(value);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={cweet}
          onChange={onChange}
          type="text"
          placeholder="What`s on your mind?"
          maxLength={120}
        />
        <input type="submit" value="Cweet" />
      </form>
      <div>
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
