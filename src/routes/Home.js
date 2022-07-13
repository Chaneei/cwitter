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
function Home({ userObj }) {
  const [cweet, setCweet] = useState("");
  const [cweets, setCweets] = useState([]);
  const [fileDes, setFileDes] = useState();
  const fileinput = useRef();
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
    let attachmentUrl = "";
    if (fileDes !== "") {
      const fileRef = ref(storageService, `${userObj.uid}/${v4()}`);
      const response = await uploadString(fileRef, fileDes, "data_url");
      attachmentUrl = await getDownloadURL(fileRef);
    }
    const cweetObj = {
      text: cweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    await addDoc(collection(dbService, "cweets"), cweetObj);
    setCweet("");
    setFileDes("");
  };
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setCweet(value);
  };

  const onFileChange = (e) => {
    const {
      target: { files },
    } = e;
    //e => target => files
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setFileDes(result);
    };
    reader.readAsDataURL(theFile);
    //readAsDataURL을 통해 파일을 읽음
  };
  const onClearPhotoClick = () => {
    setFileDes(null);
    fileinput.current.value = null;
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
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={fileinput}
        />
        <input type="submit" value="Cweet" />
        {fileDes && (
          <>
            <img src={fileDes} width="50px" height="50px" alt="profile" />
            <button onClick={onClearPhotoClick}>Clear</button>
          </>
        )}
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
