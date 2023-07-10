import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import Comment from "./Comment";
import LikePost from "./LikePost";

export default function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const docRef = doc(db, "Posts", id);
    onSnapshot(docRef, (snapshot) => {
      setPost({ ...snapshot.data(), id: snapshot.id });
    });
  }, []);
  return (
    <div className="containerCommentPost" style={{ marginTop: 70 }}>
      {post && (
        <div className="row">
          <div className="col-3">
            <img
              src={post.imageUrl}
              alt={post.title}
              style={{ width: "100%", padding: 10 }}
            />
          </div>
          <div className="col-9 mt-3">
            <h3>{post.title}</h3>
            <h5>Autor: {post.createdBy}</h5>
            <div> Postado em: {post.createdAt.toDate().toDateString()}</div>
            <hr />
            <h4>{post.description}</h4>

            <div className="d-flex flex-row">
              {user && <LikePost id={id} likes={post.likes} />}
              <div style={{ marginLeft: "8px" }}>
                <p>{post.likes.length}</p>
              </div>
            </div>
            <Comment id={post.id} />
          </div>
        </div>
      )}
    </div>
  );
}
