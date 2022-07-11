import React, { useState } from "react";
import { dbService } from "../fbase";
import { addDoc, collection } from "firebase/firestore";
function Home() {
  const [cweet, setCweet] = useState("");
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
    </div>
  );
}

export default Home;
