import { deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { db, storage } from "../firebaseConfig";
import { toast } from "react-toastify";
import { deleteObject, ref } from "firebase/storage";

export default function DeletePost({ id, imageUrl }) {
  const handleDelete = async () => {
    if (window.confirm("Você realmente deseja remover a postagem?")) {
      try {
        await deleteDoc(doc(db, "Posts", id));
        toast("Postagem deletada com sucesso!", { type: "success" });
        const storageRef = ref(storage, imageUrl);
        await deleteObject(storageRef);
      } catch (error) {
        toast("Erroao deletar postagem.", { type: "error" });
        console.log(error);
      }
    }
  };
  return (
    <div>
      <i
        className="fa fa-times"
        onClick={handleDelete}
        style={{ cursor: "pointer" }}
      />
    </div>
  );
}
