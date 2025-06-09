import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebase-config";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  query,
  where,
  serverTimestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { toast } from "react-toastify";

const ForumsPage = () => {
  const [allForums, setAllForums] = useState([]);
  const [filteredForums, setFilteredForums] = useState([]);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedForum, setSelectedForum] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  const fetchForums = async () => {
    const snapshot = await getDocs(collection(db, "forums"));
    const list = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        let creatorName = "Anonymous";
        try {
          const userDoc = await getDoc(doc(db, "users", data.createdBy));
          if (userDoc.exists()) {
            creatorName = userDoc.data().firstName || creatorName;
          }
        } catch (err) {
          console.error("Error fetching creator name", err);
        }
        return { id: docSnap.id, ...data, creatorName };
      })
    );
    setAllForums(list);
    const userForums = list.filter((forum) => forum.createdBy === auth.currentUser?.uid);
    setFilteredForums(userForums);
  };

  useEffect(() => {
    fetchForums();
  }, []);

  const handleSearch = () => {
    const lowerSearch = search.toLowerCase();
    const results = allForums.filter((forum) =>
      forum.title.toLowerCase().includes(lowerSearch)
    );
    setFilteredForums(results);
  };

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
      fetchForums();
    } catch (err) {
      toast.error("Error creating forum");
    }
  };

  const handleDeleteForum = async (forumId) => {
    try {
      await deleteDoc(doc(db, "forums", forumId));
      toast.success("Forum deleted");
      fetchForums();
    } catch (err) {
      toast.error("Failed to delete forum");
    }
  };

  const enterForum = async (forum) => {
    setSelectedForum(forum);
    const q = query(collection(db, "posts"), where("forumId", "==", forum.id));
    const snap = await getDocs(q);
    const postList = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const enrichedPosts = await Promise.all(
      postList.map(async (post) => {
        let name = "Anonymous";
        try {
          const userDoc = await getDoc(doc(db, "users", post.createdBy));
          if (userDoc.exists()) {
            name = userDoc.data().firstName || name;
          }
        } catch (err) {
          console.error("Failed to fetch user name", err);
        }
        return { ...post, displayName: name };
      })
    );

    setPosts(enrichedPosts.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
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
      enterForum(selectedForum);
    } catch (err) {
      toast.error("Error posting");
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
      {!selectedForum ? (
        <>
          <h1 className="text-3xl font-extrabold text-center text-indigo-700 dark:text-indigo-300 mb-8 tracking-wide">
            🚀 Join or Create Discussion Forums
          </h1>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md mb-10 border border-indigo-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Create a New Forum</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Forum Title (e.g., Kali Linux)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="text"
                placeholder="Forum Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                onClick={handleCreateForum}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                ➕ Create Forum
              </button>
            </div>
          </div>

          <div className="flex gap-4 items-center mb-6">
            <input
              type="text"
              placeholder="🔍 Search forums..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-grow px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <button
              onClick={handleSearch}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Search
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredForums.map((forum) => (
              <div
                key={forum.id}
                className="relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-transform transform hover:scale-[1.02] border border-gray-200 dark:border-gray-700"
              >
                <div
                  onClick={() => enterForum(forum)}
                  className="cursor-pointer"
                >
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    {forum.title}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {forum.description}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    👤 Created by: {forum.creatorName || "Anonymous"}
                  </p>
                </div>
                {forum.createdBy === auth.currentUser?.uid && (
                  <button
                    onClick={() => handleDeleteForum(forum.id)}
                    className="absolute top-2 right-3 text-sm text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                )}
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

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow mb-6">
            <textarea
              placeholder="Write your post..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="w-full h-24 p-3 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <button
              onClick={handlePost}
              className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Post
            </button>
          </div>

          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-white">{post.content}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Posted by {post.displayName || "Anonymous"}
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
