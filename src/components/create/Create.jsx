const API = import.meta.env.VITE_SERVER_API_URL;

import React, { useEffect, useState } from "react";
import { creatPost } from "../../functions/post";
import { createdAt } from "../../functions/timeStamp";
import { toast } from "react-toastify";

export default function Create(props) {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [src, setSrc] = useState("");
  const [userId, setUserId] = useState(props.token.userId);
  const [username, setUsername] = useState(props.token.username);
  const [showMessageTitle, setShowMessageTitle] = useState(false);
  const [showMessageContent, setShowMessageContent] = useState(false);

  // 사진 업로드
  const uploadImage = async (e) => {
    const file = e.target.files[0];
    const filename = encodeURIComponent(`feedmoa_${file.name}`);
    const response = await fetch(`${API}/image?file=${filename}`);
    const result = await response.json();

    console.log(result);

    const formData = new FormData();
    Object.entries({ ...result.fields, file }).forEach(([key, value]) => {
      formData.append(key, value);
    });
    const uploadResult = await fetch(result.url, {
      method: "POST",
      body: formData,
    });
    console.log(uploadResult.ok);
    console.log(uploadResult);
    if (uploadResult.ok) {
      setSrc(`${uploadResult.url}/${filename}`);
    } else {
      toast.error("업로드 가능한 파일이 아닙니다");
      return;
    }
    setImageUrl(`${uploadResult.url}/${filename}`);
  };

  // 인풋 감시
  const watchInput = () => {
    if (content !== "") {
      setShowMessageContent(false);
    }
  };

  // 글 저장
  const submitCreate = async (e) => {
    e.preventDefault();
    if (!content) {
      setShowMessageContent(true);
      return;
    }
    if (!imageUrl) {
      toast.error("사진을 업로드해주세요");
    }
    const response = await creatPost(content, userId, createdAt, imageUrl);
    console.log(response);
    if (response.success) {
      toast.success("저장완료", {
        autoClose: 200,
      });
      props.setShowModalCreate(false);
    } else {
      toast.error("저장실패", {
        autoClose: 200,
      });
    }
  };

  useEffect(() => {
    watchInput();
  });

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-5 rounded-md">
          <div className="flex justify-between">
            <div>
              <h2 className="text-xl font-bold">글 작성</h2>
            </div>
            <div>
              <button
                onClick={() => {
                  props.setShowModalCreate(false);
                }}
              >
                <img
                  style={{ width: "30px", height: "30px" }}
                  src="./Circle_X.png"
                />
              </button>
            </div>
          </div>
          <hr></hr>
          <div>
            <form className="p-2" onSubmit={submitCreate}>
              <input
                onChange={(e) => {
                  uploadImage(e);
                }}
                className="mt-2 mb-2 border border-1 border-violet-400 block w-full rounded-md py-2 px-3"
                type="file"
                accept=".jpeg,.jpg,.png,.gif"
              />
              <div className="mt-2">
                <p style={{ fontSize: "14px" }}>
                  ※ 업로드 가능한 파일 : jpeg , jpg , png , gif
                </p>
              </div>
              <div>
                <img
                  src={src}
                  style={{ maxWidth: "500px", maxHeight: "500px" }}
                />
              </div>
              <span className="ml-1"></span>
              <textarea
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                }}
                placeholder="설명"
                className="textarea focus:border focus:border-2 focus:border-violet-400 bg-gray-200 block w-full rounded-md py-2 px-3"
                type="text"
                style={{ width: "100%", height: "100px" }}
              />
              <span className="ml-1"></span>
              {showMessageContent ? (
                <span
                  style={{ marginLeft: "5px", fontSize: "13px", color: "red" }}
                >
                  설명을 입력해주세요
                </span>
              ) : null}
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-md disabled:opacity-40 disabled:hover:bg-gray-500"
                >
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
