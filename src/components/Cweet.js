import React, { useState } from "react";
import { dbService, storageService } from "../fbase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
function Cweet({ cweetObj, isOwner }) {
  const [editing, setEditing] = useState(false);
  const [newCweet, setNewCweet] = useState(cweetObj.text);
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this cweet?");
    if (ok) {
      //delete cweet
      await deleteDoc(doc(dbService, "cweets", `${cweetObj.id}`));
      await deleteObject(ref(storageService, cweetObj, cweetObj.attachmentUrl));
    }
  };
  const toggleEditing = () => setEditing(!editing);

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewCweet(value);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    await updateDoc(doc(dbService, "cweets", `${cweetObj.id}`), {
      text: newCweet,
    });
    setEditing(false);
  };
  return (
    <div className="nweet">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="container nweetEdit">
            <input
              type="text"
              placeholder="Edit your nweet"
              value={newCweet}
              required
              autoFocus
              onChange={onChange}
              className="formInput"
            />
            <input type="submit" value="Update Nweet" className="formBtn" />
          </form>
          <button onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </button>
        </>
      ) : (
        <>
          <h4>{cweetObj.text}</h4>
          {cweetObj.attachmentUrl && <img src={cweetObj.attachmentUrl} />}
          {isOwner && (
            <div className="nweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Cweet;
