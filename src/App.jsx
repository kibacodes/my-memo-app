import { useEffect, useState } from "react";
import Login from "./components/Login";
import CategoryList from "./components/CategoryList";
import MemoEditor from "./components/MemoEditor";
import "./style.css";

const API_BASE = "https://challenge-server.tracks.run/memoapp";

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
    .split("")
    .map((c) => {
      switch (c) {
        case "x":
          return ((Math.random() * 16) | 0).toString(16);
        case "y":
          return (((Math.random() * 4) | 0) + 8).toString(16);
        default:
          return c;
      }
    })
    .join("");
}

export default function App() {
  const [token, setToken] = useState("");
  const [isValidToken, setIsValidToken] = useState(false);
  const [categories, setCategories] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [memosByCategory, setMemosByCategory] = useState({});
  const [selectedMemo, setSelectedMemo] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const uuid1 = uuid();
    setToken(uuid1);
    validateToken(uuid1);
  }, []);

  const validateToken = (t) => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
    setIsValidToken(uuidRegex.test(t));
  };

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_BASE}/category`, {
        headers: { "X-ACCESS-TOKEN": token },
      });
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  const handleCategoryClick = async (categoryId) => {
    if (expandedId === categoryId) {
      setExpandedId(null);
      setSelectedMemo(null);
    } else {
      try {
        const res = await fetch(`${API_BASE}/memo?category_id=${categoryId}`, {
          headers: { "X-ACCESS-TOKEN": token },
        });
        const memos = await res.json();
        setMemosByCategory((prev) => ({ ...prev, [categoryId]: memos }));
        setExpandedId(categoryId);
        setSelectedMemo(null);
      } catch (err) {
        console.error("Memo fetch failed", err);
      }
    }
  };

  const handleMemoClick = async (memoId) => {
    try {
      const res = await fetch(`${API_BASE}/memo/${memoId}`, {
        headers: { "X-ACCESS-TOKEN": token },
      });
      const memo = await res.json();
      setSelectedMemo(memo);
      setTitle(memo.title);
      setContent(memo.content);
    } catch (err) {
      console.error("Memo fetch failed", err);
    }
  };

  const handleSave = async () => {
    try {
      await fetch(`${API_BASE}/memo/${selectedMemo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-ACCESS-TOKEN": token,
        },
        body: JSON.stringify({
          id: selectedMemo.id,
          category_id: selectedMemo.category_id,
          title,
          content,
        }),
      });
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const handleAddMemo = async () => {
    try {
      const res = await fetch(`${API_BASE}/memo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-ACCESS-TOKEN": token,
        },
        body: JSON.stringify({
          category_id: expandedId,
          title: "Untitled Memo",
          content: "Write something...",
        }),
      });
      const newMemo = await res.json();
      setMemosByCategory((prev) => ({
        ...prev,
        [expandedId]: [...(prev[expandedId] || []), newMemo],
      }));
      setSelectedMemo(newMemo);
      setTitle(newMemo.title);
      setContent(newMemo.content);
    } catch (err) {
      console.error("Add memo failed", err);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`${API_BASE}/memo/${selectedMemo.id}`, {
        method: "DELETE",
        headers: { "X-ACCESS-TOKEN": token },
      });
      setMemosByCategory((prev) => ({
        ...prev,
        [selectedMemo.category_id]: prev[selectedMemo.category_id].filter(
          (m) => m.id !== selectedMemo.id
        ),
      }));
      setSelectedMemo(null);
      setTitle("");
      setContent("");
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="app-container">
      <Login
        token={token}
        isValidToken={isValidToken}
        onChange={(t) => {
          setToken(t);
          validateToken(t);
        }}
        onLogin={handleLogin}
      />

      <button id="new-memo" onClick={handleAddMemo} disabled={!expandedId}>
        + NEW
      </button>

      <CategoryList
        categories={categories}
        expandedId={expandedId}
        memosByCategory={memosByCategory}
        onCategoryClick={handleCategoryClick}
        onMemoClick={handleMemoClick}
      />

      <MemoEditor
        title={title}
        content={content}
        onTitleChange={setTitle}
        onContentChange={setContent}
        onSave={handleSave}
        onDelete={handleDelete}
        selectedMemo={selectedMemo}
      />
    </div>
  );
}
