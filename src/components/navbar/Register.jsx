const API = import.meta.env.VITE_SERVER_API_URL;

import React, { useEffect, useState } from "react";
import { createdAt } from "../../functions/timeStamp";
import { toast } from "react-toastify";

export default function Regisrer(props) {
  const [username, setUsername] = useState("");
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [loginPw2, setLoginPw2] = useState("");
  const [agree, setAgree] = useState(false);
  const [inputMessageText, setInputMessageText] = useState("neutral");
  const [inputMessageTextId, setInputMessageTextId] = useState("neutral");
  const [verifiedUsername, setVerifiedUsername] = useState("");
  const [verifiedLoginId, setVerifiedLoginId] = useState("");
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);

  // 비밀번호 형식검사
  const pattern =
    /^(?=.*[a-zA-Z0-9!@#$%^&*()\-_=+{}\[\]:;"'<>,.?/|\\])(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*()\-_=+{}\[\]:;"'<>,.?/|\\]{8,16}$/;
  const isValidLoginPw = pattern.test(loginPw);

  // 회원가입 버튼 감시
  const watchSubmitButton = () => {
    if (
      inputMessageText === "true" &&
      verifiedUsername === username &&
      inputMessageTextId === "true" &&
      verifiedLoginId === loginId &&
      isValidLoginPw &&
      loginPw !== "" &&
      loginPw === loginPw2 &&
      loginPw !== "" &&
      loginPw2 !== "" &&
      agree
    ) {
      setIsSubmitButtonDisabled(false);
    } else {
      setIsSubmitButtonDisabled(true);
    }
  };

  // 닉네임 중복확인
  const verifyUsername = async () => {
    try {
      const response = await fetch(`${API}/verifyUsername`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const result = await response.json();
      if (result.success) {
        setInputMessageText("true");
        setVerifiedUsername(result.username);
      } else if (!result.success && result.cause === "null") {
        setVerifiedUsername("null");
        setInputMessageText("null");
      } else if (!result.success && result.cause === "pattern") {
        setVerifiedUsername(username);
        setInputMessageText("pattern");
      } else if (!result.success && result.cause === "exists") {
        setVerifiedUsername(username);
        setInputMessageText("exists");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 아이디 중복확인
  const verifyLoginId = async () => {
    try {
      const response = await fetch(`${API}/verifyLoginId`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId }),
      });
      const result = await response.json();
      if (result.success) {
        setInputMessageTextId("true");
        setVerifiedLoginId(result.loginId);
      } else if (!result.success && result.cause === "null") {
        setVerifiedLoginId("null");
        setInputMessageTextId("null");
      } else if (!result.success && result.cause === "pattern") {
        setVerifiedLoginId(loginId);
        setInputMessageTextId("pattern");
      } else if (!result.success && result.cause === "exists") {
        setVerifiedLoginId(loginId);
        setInputMessageTextId("exists");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 회원가입
  const submitRegister = async (e) => {
    e.preventDefault();
    try {
      const registerData = { username, loginId, loginPw, createdAt };
      const response = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });
      const result = await response.json();
      if (result.success) {
        toast.success("회원가입에 성공하였습니다", {
          hideProgressBar: true,
        });
        props.setShowModalRegister(false);
        props.setShowModalLogin(true);
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
        <div className="bg-white p-5 rounded-md mb-20">
          <div className="flex justify-between">
            <div>
              <h2 className="text-xl font-bold mb-5">회원가입</h2>
            </div>
            <div>
              <button
                onClick={() => {
                  props.setShowModalRegister(false);
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
          <form className="p-5" onSubmit={submitRegister}>
            <div className="flex mt-1">
              <div>
                <input
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  placeholder="닉네임"
                  className="focus:border focus:border-2 focus:border-violet-400 login-id-input block border-gray-300 rounded-md py-2 px-3"
                  type="text"
                />
              </div>
              <div>
                <button
                  onClick={verifyUsername}
                  type="button"
                  className="text-white bg-gray-500 hover:bg-gray-700 duplicate-btn"
                >
                  중복확인
                </button>
              </div>
            </div>
            {inputMessageText === "null" &&
            verifiedUsername === "null" &&
            username === "" ? (
              <span
                style={{ marginLeft: "5px", fontSize: "13px", color: "red" }}
              >
                닉네임을 입력해주세요
              </span>
            ) : null}
            {inputMessageText === "pattern" && verifiedUsername === username ? (
              <span
                style={{ marginLeft: "5px", fontSize: "13px", color: "red" }}
              >
                요청한 형식과 일치시키세요
              </span>
            ) : null}
            {inputMessageText === "true" && verifiedUsername === username ? (
              <span
                className="text-green-600"
                style={{ marginLeft: "5px", fontSize: "13px" }}
              >
                사용 가능한 닉네임입니다
              </span>
            ) : null}
            {inputMessageText === "exists" && verifiedUsername === username ? (
              <span
                style={{ marginLeft: "5px", fontSize: "13px", color: "red" }}
              >
                이미 사용중인 닉네임입니다
              </span>
            ) : null}
            {inputMessageText === "neutral" ||
            (inputMessageText === "null" &&
              verifiedUsername === "null" &&
              username !== "") ||
            (inputMessageText === "pattern" && verifiedUsername !== username) ||
            (inputMessageText === "exists" && verifiedUsername !== username) ||
            (inputMessageText === "true" && verifiedUsername !== username) ? (
              <span
                style={{ marginLeft: "5px", fontSize: "13px", color: "gray" }}
              >
                영문, 한글, 숫자 3-7자리
              </span>
            ) : null}
            <div className="flex mt-3">
              <div>
                <input
                  value={loginId}
                  onChange={(e) => {
                    setLoginId(e.target.value);
                  }}
                  placeholder="아이디"
                  className="focus:border-2 focus:border-violet-400 login-id-input block border-gray-300 rounded-md py-2 px-3"
                  type="text"
                />
              </div>
              <div>
                <button
                  onClick={verifyLoginId}
                  type="button"
                  className="text-white bg-gray-500 hover:bg-gray-700 duplicate-btn"
                >
                  중복확인
                </button>
              </div>
            </div>
            {inputMessageTextId === "null" &&
            verifiedLoginId === "null" &&
            loginId === "" ? (
              <span
                style={{ marginLeft: "5px", fontSize: "13px", color: "red" }}
              >
                아이디를 입력해주세요
              </span>
            ) : null}
            {inputMessageTextId === "pattern" && verifiedLoginId === loginId ? (
              <span
                style={{ marginLeft: "5px", fontSize: "13px", color: "red" }}
              >
                요청한 형식과 일치시키세요
              </span>
            ) : null}
            {inputMessageTextId === "true" && verifiedLoginId === loginId ? (
              <span
                className="text-green-600"
                style={{ marginLeft: "5px", fontSize: "13px" }}
              >
                사용 가능한 아이디입니다
              </span>
            ) : null}
            {inputMessageTextId === "exists" && verifiedLoginId === loginId ? (
              <span
                style={{ marginLeft: "5px", fontSize: "13px", color: "red" }}
              >
                이미 사용중인 아이디입니다
              </span>
            ) : null}
            {inputMessageTextId === "neutral" ||
            (inputMessageTextId === "null" &&
              verifiedLoginId === "null" &&
              loginId !== "") ||
            (inputMessageTextId === "pattern" && verifiedLoginId !== loginId) ||
            (inputMessageTextId === "exists" && verifiedLoginId !== loginId) ||
            (inputMessageTextId === "true" && verifiedLoginId !== loginId) ? (
              <span
                style={{ marginLeft: "5px", fontSize: "13px", color: "gray" }}
              >
                영문, 숫자 6-12자리
              </span>
            ) : null}
            {/* <div className="flex mt-3">
              <div>
                <input
                  value={loginEmail}
                  onChange={(e) => {
                    setLoginEmail(e.target.value);
                  }}
                  placeholder="이메일"
                  className="mb-3 focus:border focus:border-2 focus:border-violet-400 login-id-input block border-gray-300 rounded-md py-2 px-3 mb-4"
                  type="text"
                />
              </div>
              <div>
                <button
                  type="button"
                  className="text-white bg-gray-500 hover:bg-gray-700 duplicate-btn"
                >
                  인증하기
                </button>
              </div>
            </div>
            <div>
              <input
                style={{ width: "100%" }}
                placeholder="인증번호"
                className="mt-1 focus:border focus:border-2 focus:border-violet-400 login-pw-input block w-full border-gray-300 rounded-md py-2 px-3"
                type="text"
              />
            </div> */}
            <div>
              <input
                style={{ width: "100%" }}
                value={loginPw}
                onChange={(e) => {
                  setLoginPw(e.target.value);
                }}
                placeholder="비밀번호"
                className="mt-5 focus:border focus:border-2 focus:border-violet-400 login-pw-input block w-full border-gray-300 rounded-md py-2 px-3"
                type="password"
              />
            </div>
            {isValidLoginPw && loginPw !== "" ? (
              <span
                className="text-green-600"
                style={{ marginLeft: "5px", fontSize: "13px" }}
              >
                사용 가능한 비밀번호입니다
              </span>
            ) : null}
            {!isValidLoginPw && loginPw !== "" ? (
              <span
                style={{ marginLeft: "5px", fontSize: "13px", color: "red" }}
              >
                요청한 형식과 일치시키세요
              </span>
            ) : null}
            {loginPw === "" || (loginPw !== "" && !isValidLoginPw) ? (
              <span
                style={{ marginLeft: "5px", fontSize: "13px", color: "gray" }}
              >
                영문, 숫자, 특수문자 8-16자리
              </span>
            ) : null}
            <div>
              <input
                style={{ width: "100%" }}
                value={loginPw2}
                onChange={(e) => {
                  setLoginPw2(e.target.value);
                }}
                placeholder="비밀번호 확인"
                className="mt-3 focus:border focus:border-2 focus:border-violet-400 login-pw-input block w-full border-gray-300 rounded-md py-2 px-3"
                type="password"
              />
            </div>
            <span
              className="text-green-600"
              style={{ marginLeft: "5px", fontSize: "13px" }}
            ></span>
            {loginPw === loginPw2 && loginPw !== "" && loginPw2 !== "" ? (
              <span className="text-green-600" style={{ fontSize: "13px" }}>
                비밀번호가 일치합니다
              </span>
            ) : null}
            {loginPw !== "" && loginPw2 !== "" && loginPw !== loginPw2 ? (
              <span
                style={{ marginLeft: "5px", fontSize: "13px", color: "red" }}
              >
                비밀번호가 일치하지 않습니다
              </span>
            ) : null}
            <div>
              <input
                className="mt-5"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                type="checkbox"
              />
              <label> 개인정보 수집 동의</label>
            </div>
            <div className="text-center mb-5">
              <button
                disabled={isSubmitButtonDisabled}
                type="submit"
                className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 mt-4 rounded-md disabled:opacity-40 disabled:hover:bg-gray-500"
              >
                회원가입
              </button>
            </div>
            <div className="text-center">
              <span>계정이 있으신가요?</span>
              <button
                onClick={() => {
                  props.setShowModalLogin(true);
                  props.setShowModalRegister(false);
                }}
                className="text-violet-600 hover:text-violet-300 ml-2"
              >
                로그인
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
