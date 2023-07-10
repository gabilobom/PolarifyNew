import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import DeletePost from "./DeletePost";
import { useAuthState } from "react-firebase-hooks/auth";
import LikePost from "./LikePost";
import { Link } from "react-router-dom";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [user] = useAuthState(auth);
  useEffect(() => {
    const postRef = collection(db, "Posts");
    const q = query(postRef, orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(posts);
      console.log(posts);
    });
  }, []);
  return (
    <div>
      <div>
        <img alt="banner" src="../banner.png" className="banner"></img>
      </div>
      {posts.length === 0 ? (
        <p>Não foram encontradas postagens!</p>
      ) : (
        <div className="postBox">
          {posts.map(
            ({
              id,
              title,
              description,
              imageUrl,
              createdAt,
              createdBy,
              userId,
              likes,
              comments,
            }) => (
              <div className="containerBox" key={id}>
                <span className="deletePost">
                  {user && user.uid === userId && (
                    <DeletePost id={id} imageUrl={imageUrl} />
                  )}
                </span>
                <div className="imgContainer">
                  <Link to={`/post/${id}`}>
                    <img className="imgHome" src={imageUrl} alt="title" />
                  </Link>
                </div>
                <div className="col-12 ps-4">
                  <div className="row">
                    <span style={{ fontSize: "8px" }}>
                      {createdAt.toDate().toDateString()}
                    </span>
                    <div className="nameLogin">
                      {createdBy && <span>@{createdBy}</span>}
                      <div className="likesPost">
                        {user && <LikePost id={id} likes={likes} />}
                        {likes?.length} likes{" "}
                        <span style={{ fontWeight: "bolder" }}>{title}</span>{" "}
                        <br />
                        {description}
                        {comments && comments.length > 0 && (
                          <div className="pe-2">
                            <p>{comments?.length} comments</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
