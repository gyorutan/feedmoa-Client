const API = import.meta.env.VITE_SERVER_API_URL;

import React, { useEffect, useState } from "react";
import Create from "../components/create/Create";
import { toast } from "react-toastify";
import jwtDecode from "jwt-decode";
import { Link } from "react-router-dom";

export default function Home() {
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [token, setToken] = useState("");
  const [posts, setPosts] = useState([]);

  // 로그인 체크 & POP UP
  const loginCheck = () => {
    const token = localStorage.getItem("USER");
    if (!token) {
      toast.error("로그인이 필요합니다");
    } else {
      const decodedToken = jwtDecode(token);
      setToken(decodedToken);
      setShowModalCreate(true);
    }
  };

  // 모든 게시물 불러오기
  const getAllposts = async () => {
    const response = await fetch(`${API}/getAllposts`);
    const result = await response.json();
    setPosts(result);
  };

  useEffect(() => {
    getAllposts();
  }, [showModalCreate]);

  return (
    <>
      <div className="container m-auto">
        <div className="flex justify-center">
          <div className="mt-1 text-3xl font-bold text-violet-600 text-center">
            실시간 피드
          </div>
          <div>
            <button
              onClick={() => {
                loginCheck();
              }}
              className="ml-3 hover:bg-lime-400 hover:rounded-xl text-violet-600 font-bold p-3"
            >
              글작성
            </button>
          </div>
        </div>
        {showModalCreate ? (
          <Create setShowModalCreate={setShowModalCreate} token={token} />
        ) : null}
        {posts.map((post) => (
          <div className="mt-5" key={post._id}>
            <div
              className="mx-auto grid grid-flow-row auto-rows-max rounded col-span-4 border bg-white border-gray-primary mb-12"
              style={{ maxWidth: "60vh" }}
            >
              <div className="flex border-b border-gray-primary h-4 p-4 py-8 justify-between">
                <div className="flex items-center">
                  <Link to={"/"} className="flex items-center">
                    <img
                      className="rounded-full h-8 w-8 flex mr-3"
                      src={`${post.imageUrl}`}
                    />
                    <p className="font-bold">{post.writer.username}</p>
                  </Link>
                </div>
                <div className="flex items-center">{post.createdAt}</div>
              </div>
              <div>
                <img
                  className="border-b border-gray-primary"
                  src={`${post.imageUrl}`}
                  alt=""
                  style={{ width: "100%" }}
                />
              </div>
              <div className="p-3">{post.content}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
