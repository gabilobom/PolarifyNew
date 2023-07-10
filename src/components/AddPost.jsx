import React, { useState } from "react";
import { Timestamp, collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, db, auth } from "../firebaseConfig";
import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";

export default function AddPost() {
  const [user] = useAuthState(auth);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    createdAt: Timestamp.now().toDate(),
  });

  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handlePublish = () => {
    if (!formData.title || !formData.description || !formData.image) {
      alert("Por favor preencha todos os campos!");
      return;
    }

    const storageRef = ref(
      storage,
      `/images/${Date.now()}${formData.image.name}`
    );

    const uploadImage = uploadBytesResumable(storageRef, formData.image);

    uploadImage.on(
      "state_changed",
      (snapshot) => {
        const progressPercent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progressPercent);
      },
      (err) => {
        console.log(err);
      },
      () => {
        setFormData({
          title: "",
          description: "",
          image: "",
        });

        getDownloadURL(uploadImage.snapshot.ref).then((url) => {
          const postRef = collection(db, "Posts");
          addDoc(postRef, {
            title: formData.title,
            description: formData.description,
            imageUrl: url,
            createdAt: Timestamp.now().toDate(),
            createdBy: user.displayName,
            userId: user.uid,
            likes: [],
            comments: [],
          })
            .then(() => {
              toast("Postagem adicionada com sucesso!", { type: "success" });
              setProgress(0);
            })
            .catch((err) => {
              toast("Erro ao adicionar o post!", { type: "error" });
            });
        });
      }
    );
  };

  return (
    <div className="login">
      {!user ? (
        <>
          <h2 className="loginBox">
            <Link to="/signin" className="loginLink">
              Login{" "}
              <img src="../login.svg" alt="enterIcon" className="iconEnter" />
            </Link>
          </h2>
          <span className="register">
            Não tem conta?{" "}
            <Link to="/register" className="registerLink">
              Registre-se
            </Link>
          </span>
        </>
      ) : (
        <>
          <div className="createPost">
            <div className="titleAddPost">
              <h5>Create Post</h5>
            </div>
            <div className="addPostData">
              <label htmlFor="">Título:</label>
              <input
                style={{ fontSize: "12px" }}
                type="text"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={(e) => handleChange(e)}
              />

              <label htmlFor="">Descrição:</label>
              <textarea
                style={{ fontSize: "10px", height: "60px", resize: "none" }}
                name="description"
                className="form-control"
                value={formData.description}
                onChange={(e) => handleChange(e)}
              />

              <label htmlFor="" style={{ fontSize: "12px" }}>
                Imagem:
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                className="form-control"
                style={{ fontSize: "10px" }}
                onChange={(e) => handleImageChange(e)}
              />
            </div>

            {progress === 0 ? null : (
              <div className="progress">
                <div
                  className="progress-bar"
                  aria-valuenow="25"
                  aria-valuemin="0"
                  aria-valuemax="80"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
            <button className="publishButton" onClick={handlePublish}>
              Publique
            </button>
          </div>
        </>
      )}
    </div>
  );
}
