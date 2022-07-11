import React, { useState } from "react";
import { dbService } from "../fbase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
function Cweet({ cweetObj, isOwner }) {
  const [editing, setEditing] = useState(false);
  const [newCweet, setNewCweet] = useState(cweetObj.text);
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this cweet?");
    if (ok) {
      //delete cweet
      await deleteDoc(doc(dbService, "cweets", `${cweetObj.id}`));
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
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Edit your cweet"
              value={newCweet}
              onChange={onChange}
              required
            />
            <input type="submit" value="Update Cweet" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{cweetObj.text}</h4>
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Cweet</button>
              <button onClick={toggleEditing}>Edit Cweet</button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Cweet;
