const API = import.meta.env.VITE_SERVER_API_URL;

export const creatPost = async (content, userId, createdAt, imageUrl) => {
  try {
    const response = await fetch(`${API}/createPost`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, userId, createdAt, imageUrl }),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    return console.log(error);
  }
};
