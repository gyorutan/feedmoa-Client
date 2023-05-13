import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Login from "./Login";
import Register from "./Register";
import jwtDecode from "jwt-decode";
// import { verifyToken } from "../../functions/verifyToken";

export default function Navbar() {
  const [showModalLogin, setShowModalLogin] = useState(false);
  const [showModalRegister, setShowModalRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");

  // 로그인 체크
  const loginCheck = () => {
    const token = localStorage.getItem("USER");
    if (!token) {
      setIsLoggedIn(false);
    }
    if (token) {
      const decodedToken = jwtDecode(token);
      setUsername(decodedToken.username);
      setUserId(decodedToken.userId);
      setIsLoggedIn(true);
    }
  };

  const logout = () => {
    const token = localStorage.getItem("USER");
    if (token) {
      localStorage.removeItem("USER");
      setUsername("");
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    loginCheck();
  }, []);

  return (
    <>
      <nav className="bg-lime-200 fixed top-0 left-0 right-0">
        <div className="flex container m-auto">
          <div className="flex">
            {/* Site Logo */}
            <div style={{ width: "250px" }}>
              <Link to={"/"}>
                <img className="logo-img" src="../feedmoa.png" />
              </Link>
            </div>
            {/* Search Box */}
            <div className="my-auto ml-10 flex">
              <input
                className="border placeholder:text-slate-400 rounded-xl h-8 p-3 focus:border-2 focus:border-violet-400"
                style={{ width: "300px" }}
                type="text"
                placeholder="검색어 입력..."
              />
              {/* <div className="w-8 mt-1 ml-2">
                <button>돋보기</button>
              </div> */}
            </div>
          </div>
          {isLoggedIn ? (
            <div className="flex container m-auto justify-end">
              <div className="flex">
                <div className="hover:bg-lime-400 hover:rounded-xl">
                  <button className="text-violet-600 font-bold p-4">
                    {username}님
                  </button>
                </div>
                <div className="hover:bg-lime-400 hover:rounded-xl ml-3">
                  <button
                    onClick={logout}
                    className="text-violet-600 font-bold p-4"
                  >
                    로그아웃
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex container m-auto justify-end">
              <div className="flex">
                <div className="hover:bg-lime-400 hover:rounded-xl">
                  <button
                    onClick={() => {
                      setShowModalLogin(true);
                    }}
                    className="text-violet-600 font-bold p-4"
                  >
                    로그인
                  </button>
                </div>
                <div className="hover:bg-lime-400 hover:rounded-xl ml-3">
                  <button
                    onClick={() => {
                      setShowModalRegister(true);
                    }}
                    className="text-violet-600 font-bold p-4"
                  >
                    회원가입
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="bg-violet-400">
          <div className="container m-auto flex">
            <Link to={"/"}>
              <div className="text-center text-lg hover:bg-violet-600 w-40 p-1 text-white">
                홈으로
              </div>
            </Link>
            <Link to={"/chat"}>
              <div className="text-center text-lg hover:bg-violet-600 w-40 p-1 text-white">
                채팅
              </div>
            </Link>
          </div>
        </div>
      </nav>
      {showModalLogin ? (
        <Login
          setShowModalRegister={setShowModalRegister}
          setShowModalLogin={setShowModalLogin}
          setIsLoggedIn={setIsLoggedIn}
          setUsername={setUsername}
        />
      ) : null}
      {showModalRegister ? (
        <Register
          setShowModalRegister={setShowModalRegister}
          setShowModalLogin={setShowModalLogin}
        />
      ) : null}
    </>
  );
}
