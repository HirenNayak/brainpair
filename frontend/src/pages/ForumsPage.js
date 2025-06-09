import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebase-config";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { toast } from "react-toastify";

const ForumsPage = () => {
  const [forums, setForums] = useState([]);
  const [filteredForums, setFilteredForums] = useState([]);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedForum, setSelectedForum] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  useEffect(() => {
    const fetchForums = async () => {
      const snapshot = await getDocs(collection(db, "forums"));
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const currentUser = auth.currentUser?.uid;

      // Show only forums created by this user by default
      const userForums = list.filter((forum) => forum.createdBy === currentUser);
      setForums(userForums);
      setFilteredForums(userForums);
    };
    fetchForums();
  }, []);

  useEffect(() => {
    const currentUser = auth.currentUser?.uid;
    const searchResults = forums.filter(
      (forum) =>
        forum.title.toLowerCase().includes(search.toLowerCase()) ||
        forum.createdBy === currentUser
    );
    setFilteredForums(searchResults);
  }, [search, forums]);

  const handleCreateForum = async () => {
    if (!title || !description) return toast.error("All fields required");
    try {
      await addDoc(collection(db, "forums"), {
        title,
        description,
        createdBy: auth.currentUser?.uid || "anonymous",
        createdAt: serverTimestamp(),
      });
      toast.success("Forum created");
      setTitle("");
      setDescription("");
      window.location.reload();
    } catch (err) {
      toast.error("Error creating forum");
    }
  };

  const enterForum = async (forum) => {
    setSelectedForum(forum);
    const q = query(collection(db, "posts"), where("forumId", "==", forum.id));
    const snap = await getDocs(q);
    const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setPosts(list.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
  };

  const handlePost = async () => {
    if (!newPost) return toast.error("Post cannot be empty");
    try {
      await addDoc(collection(db, "posts"), {
        forumId: selectedForum.id,
        content: newPost,
        createdBy: auth.currentUser?.uid || "anonymous",
        createdAt: serverTimestamp(),
      });
      toast.success("Post added");
      setNewPost("");
      enterForum(selectedForum); // refresh posts
    } catch (err) {
      toast.error("Error posting");
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
      {!selectedForum ? (
        <>
          <h1 className="text-3xl font-bold text-center text-indigo-700 dark:text-indigo-300 mb-6">
            Join or Create Discussion Forums
          </h1>

          {/* Create Forum */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-8">
            <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
              Create a New Forum
            </h2>
            <input
              type="text"
              placeholder="Forum Title (e.g., Kali Linux)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mb-3 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            />
            <input
              type="text"
              placeholder="Forum Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mb-3 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={handleCreateForum}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Create Forum
            </button>
          </div>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search forums..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-6 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
          />

          {/* Forum List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredForums.map((forum) => (
              <div
                key={forum.id}
                onClick={() => enterForum(forum)}
                className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition"
              >
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  {forum.title}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {forum.description}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <button
            className="mb-4 text-indigo-600 underline hover:text-indigo-800"
            onClick={() => setSelectedForum(null)}
          >
            ← Back to Forums
          </button>

          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            {selectedForum.title}
          </h2>

          {/* New Post */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow mb-6">
            <textarea
              placeholder="Write your post..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="w-full h-24 p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={handlePost}
              className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Post
            </button>
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
                <p className="text-gray-800 dark:text-white">{post.content}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Posted by {post.createdBy === "anonymous" ? "Anonymous" : post.createdBy}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ForumsPage;
