const API = import.meta.env.VITE_SERVER_API_URL;

import React, { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { toast } from "react-toastify";

export default function Login(props) {
  const [showFailMessage, setShowFailMessage] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);

  // 인풋 초기화
  const handleReset = () => {
    setLoginPw("");
  };

  // 로그인 버튼 감시
  const watchSubmitButton = () => {
    if (loginId !== "" && loginPw !== "") {
      setIsSubmitButtonDisabled(false);
    } else {
      setIsSubmitButtonDisabled(true);
    }
  };

  // 로그인
  const submitLogin = async (e) => {
    e.preventDefault();
    try {
      const loginData = { loginId, loginPw };
      const response = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const result = await response.json();
      if (result.success) {
        props.setIsLoggedIn(true);
        localStorage.setItem("USER", result.token);
        const decodedToken = jwtDecode(result.token);
        props.setUsername(decodedToken.username);
        props.setShowModalLogin(false);
        toast.success(
          `환영합니다 
        ${decodedToken.username}님`,
          {
            hideProgressBar: true,
          }
        );
      } else {
        setShowFailMessage(true);
        handleReset();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    watchSubmitButton();
  });

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-5 rounded-md mb-36">
          <div className="flex justify-between">
            <div>
              <h2 className="text-xl font-bold mb-5">로그인</h2>
            </div>
            <div>
              <button
                onClick={() => {
                  props.setShowModalLogin(false);
                }}
              >
                <img
                  style={{ width: "30px", height: "30px" }}
                  src="./Circle_X.png"
                />
              </button>
            </div>
          </div>
          <hr className="mt-2" />
          <img
            className="m-auto"
            style={{ width: "280px" }}
            src="./feedmoa.png"
          />
          <hr />
          <form className="p-5" onSubmit={submitLogin}>
            <input
              value={loginId}
              onChange={(e) => {
                setLoginId(e.target.value);
              }}
              onFocus={() => {
                setShowFailMessage(false);
              }}
              placeholder="아이디"
              className="mt-1 focus:border focus:border-2 focus:border-violet-400 login-id-input block w-full border-gray-300 rounded-md py-2 px-3 mb-5"
              type="text"
            />
            <input
              value={loginPw}
              onChange={(e) => {
                setLoginPw(e.target.value);
              }}
              onFocus={() => {
                setShowFailMessage(false);
              }}
              placeholder="비밀번호"
              className="mt-1 focus:border focus:border-2 focus:border-violet-400 login-pw-input block w-full border-gray-300 rounded-md py-2 px-3"
              type="password"
            />
            <span
              style={{ marginLeft: "5px", fontSize: "13px", color: "red" }}
            ></span>
            {showFailMessage ? (
              <span style={{ fontSize: "13px", color: "red" }}>
                아이디 또는 비밀번호가 다릅니다
              </span>
            ) : null}
            <div className="text-center mb-5">
              <button
                disabled={isSubmitButtonDisabled}
                type="submit"
                className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 mt-3 rounded-md disabled:opacity-40 disabled:hover:bg-gray-500"
              >
                로그인
              </button>
            </div>
            <div className="text-center">
              <span>회원이 아니신가요?</span>
              <button
                onClick={() => {
                  props.setShowModalLogin(false);
                  props.setShowModalRegister(true);
                }}
                className="text-violet-600 hover:text-violet-300 ml-2"
              >
                회원가입
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
