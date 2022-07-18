import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { dbService, storageService } from "../fbase";
import { v4 as uuidv4, v4 } from "uuid";
import { addDoc, collection } from "firebase/firestore";
import Cweet from "../components/Cweet";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

function CweetFactory({ userObj }) {
  const [cweet, setCweet] = useState("");
  const [fileDes, setFileDes] = useState("");
  const fileinput = useRef();

  const onSubmit = async (e) => {
    if (cweet === "") {
      return;
    }
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
    setFileDes("");
    fileinput.current.value = null;
  };
  return (
    <div>
      <form onSubmit={onSubmit} className="factoryForm">
        <div className="factoryInput__container">
          <input
            className="factoryInput__input"
            value={cweet}
            onChange={onChange}
            type="text"
            placeholder="What's on your mind?"
            maxLength={120}
          />
          <input type="submit" value="&rarr;" className="factoryInput__arrow" />
        </div>
        <label htmlFor="attach-file" className="factoryInput__label">
          <span>Add photos</span>
          <FontAwesomeIcon icon={faPlus} />
        </label>
        <input
          id="attach-file"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          style={{
            opacity: 0,
          }}
        />
        {fileDes && (
          <div className="factoryForm__attachment">
            <img
              src={fileDes}
              style={{
                backgroundImage: fileDes,
              }}
            />
            <div className="factoryForm__clear" onClick={onClearPhotoClick}>
              <span>Remove</span>
              <FontAwesomeIcon icon={faTimes} />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default CweetFactory;
