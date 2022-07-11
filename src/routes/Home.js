import React, { useState, useEffect } from "react";
import { dbService } from "../fbase";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
function Home() {
  const [cweet, setCweet] = useState("");
  const [cweets, setCweets] = useState([]);
  const getCweets = async () => {
    const q = query(collection(dbService, "cweets"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const cweetObj = {
        ...doc.data(),
        id: doc.id,
      };
      setCweets((prev) => [cweetObj, ...prev]);
    });
  };
  useEffect(() => {
    getCweets();
  }, []);
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(dbService, "cweets"), {
        cweet,
        createdAt: Date.now(),
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

  console.log(cweets);

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
          <div key={cweet.id}>
            <h4>{cweet.cweet}</h4>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
