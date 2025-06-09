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
  const [replyInputs, setReplyInputs] = useState({});
  const [replyBoxes, setReplyBoxes] = useState({});
  const [expandedReplies, setExpandedReplies] = useState({});
  const [replies, setReplies] = useState({});

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

  const fetchReplies = async (postId) => {
    const snap = await getDocs(collection(db, `posts/${postId}/replies`));
    const repliesList = await Promise.all(
      snap.docs.map(async (replyDoc) => {
        const data = replyDoc.data();
        let displayName = "Anonymous";
        try {
          const userDoc = await getDoc(doc(db, "users", data.createdBy));
          if (userDoc.exists()) {
            displayName = userDoc.data().firstName || displayName;
          }
        } catch (err) {
          console.error("Failed to fetch reply user", err);
        }
        return { id: replyDoc.id, ...data, displayName };
      })
    );
    setReplies((prev) => ({ ...prev, [postId]: repliesList }));
  };

  const handleDeleteReply = async (postId, replyId) => {
    try {
      await deleteDoc(doc(db, `posts/${postId}/replies`, replyId));
      toast.success("Reply deleted");
      fetchReplies(postId);
    } catch (err) {
      toast.error("Failed to delete reply");
    }
  };

  const enterForum = async (forum) => {
    setSelectedForum({ ...forum, isAdmin: forum.createdBy === auth.currentUser?.uid });
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
        await fetchReplies(post.id);
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

  const handleReply = async (postId) => {
    const reply = replyInputs[postId];
    if (!reply || !reply.trim()) return toast.error("Reply cannot be empty");
    try {
      await addDoc(collection(db, `posts/${postId}/replies`), {
        content: reply.trim(),
        createdBy: auth.currentUser?.uid || "anonymous",
        createdAt: serverTimestamp(),
      });
      toast.success("Reply added");
      setReplyInputs((prev) => ({ ...prev, [postId]: "" }));
      fetchReplies(postId);
    } catch (err) {
      toast.error("Error saving reply");
    }
  };

  const toggleReplyBox = (postId) => {
    setReplyBoxes((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleReplies = (postId) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
      {!selectedForum ? (
        <>
          <h1 className="text-3xl font-bold text-center text-indigo-700 dark:text-indigo-300 mb-6">
            Join or Create Discussion Forums
          </h1>

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

          <div className="flex gap-4 items-center mb-6">
            <input
              type="text"
              placeholder="Search forums..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-grow px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={handleSearch}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Search
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredForums.map((forum) => (
              <div
                key={forum.id}
                className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition"
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
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                    Created by: {forum.creatorName || "Anonymous"}
                  </p>
                </div>
                {forum.createdBy === auth.currentUser?.uid && (
                  <button
                    onClick={() => handleDeleteForum(forum.id)}
                    className="absolute top-2 right-2 text-sm text-red-500 hover:underline"
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
              className="w-full h-24 p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={handlePost}
              className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Post
            </button>
          </div>

          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
                <p className="text-gray-800 dark:text-white">{post.content}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Posted by {post.displayName || "Anonymous"}
                </p>

                <button
                  onClick={() => toggleReplyBox(post.id)}
                  className="mt-2 text-indigo-600 text-sm hover:underline mr-4"
                >
                  💬 Reply
                </button>

                {replies[post.id] && replies[post.id].length > 0 && (
                  <button
                    onClick={() => toggleReplies(post.id)}
                    className="mt-2 text-indigo-600 text-sm hover:underline"
                  >
                    {expandedReplies[post.id]
                      ? "Hide replies"
                      : `Show ${replies[post.id].length} replies`}
                  </button>
                )}

                {replyBoxes[post.id] && (
                  <div className="mt-3">
                    <input
                      type="text"
                      placeholder="Write a reply..."
                      value={replyInputs[post.id] || ""}
                      onChange={(e) =>
                        setReplyInputs((prev) => ({
                          ...prev,
                          [post.id]: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 mt-1 border rounded-lg dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      onClick={() => handleReply(post.id)}
                      className="mt-2 bg-indigo-500 text-white px-4 py-1 rounded hover:bg-indigo-600 text-sm"
                    >
                      Submit Reply
                    </button>
                  </div>
                )}

                {expandedReplies[post.id] &&
                  replies[post.id] &&
                  replies[post.id].length > 0 && (
                    <div className="mt-4 space-y-2 border-l-4 border-indigo-200 pl-4">
                      {replies[post.id].map((r) => (
                        <div key={r.id} className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-semibold">{r.displayName}:</span> {r.content}
                          {(r.createdBy === auth.currentUser?.uid || selectedForum.isAdmin) && (
                            <button
                              onClick={() => handleDeleteReply(post.id, r.id)}
                              className="ml-2 text-red-500 text-xs hover:underline"
                            >
                              🗑️ Delete
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ForumsPage;
