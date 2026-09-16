import React, { useState } from 'react';
import {
  MessageSquare,
  Heart,
  Share2,
  Send,
  PlusCircle,
  Clock,
  User,
  CheckCircle2,
  MapPin,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const MemberUpdatesView: React.FC = () => {
  const { posts, likePost, addComment, createPost } = useApp();
  const { currentUser } = useAuth();

  const [newPostModalOpen, setNewPostModalOpen] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState<'feedback' | 'alert' | 'event' | 'complaint'>('feedback');
  const [postArea, setPostArea] = useState('Bethelsdorp');
  const [postImageUrl, setPostImageUrl] = useState('');

  // Active comment inputs keyed by postId
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [commentAuthor, setCommentAuthor] = useState(currentUser?.name || '');

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    createPost({
      title: postTitle.trim(),
      content: postContent.trim(),
      author: currentUser?.name || 'Concerned Citizen',
      category: postCategory,
      area: postArea,
      images: postImageUrl.trim() ? [postImageUrl.trim()] : [],
    });

    setNewPostModalOpen(false);
    setPostTitle('');
    setPostContent('');
    setPostImageUrl('');
  };

  const handleSendComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    const author = currentUser?.name || commentAuthor.trim() || 'Resident';
    addComment(postId, author, text);

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
            Citizen Voice & Community Wall
          </span>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Member & Community Updates
          </h2>
          <p className="text-xs text-slate-300">
            Real-time field dispatches, food drive photos, and neighborhood notifications from verified PE Metro residents.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setNewPostModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow transition flex items-center gap-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Write Community Post</span>
        </button>
      </div>

      {/* Posts Stream */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden space-y-4 p-6"
          >
            {/* Post Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-amber-600 text-white flex items-center justify-center font-bold text-sm">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-sm">{post.author}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-400" />
                      {post.area}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                {post.category}
              </span>
            </div>

            {/* Post Content */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-white leading-snug">{post.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {post.content}
              </p>
            </div>

            {/* Attached Photo */}
            {post.images && post.images.length > 0 && (
              <div className="rounded-xl overflow-hidden border border-slate-800 max-h-96">
                <img
                  src={post.images[0]}
                  alt="Post attachment"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => likePost(post.id)}
                  className="flex items-center gap-1.5 hover:text-red-400 transition"
                >
                  <Heart className="w-4 h-4 text-red-500 fill-red-500/20 hover:fill-red-500 transition" />
                  <span className="font-semibold text-slate-200">{post.likes}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-200">{post.comments_count}</span>
                  <span className="hidden sm:inline">Comments</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Post link copied to clipboard!');
                }}
                className="flex items-center gap-1 hover:text-slate-200 transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>

            {/* Comments Thread */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 space-y-3">
              {post.comments && post.comments.length > 0 && (
                <div className="space-y-2.5">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="text-xs space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-300 text-[11px]">
                          {comment.author}
                        </span>
                        <span className="text-[10px] text-slate-400">{comment.created_at}</span>
                      </div>
                      <p className="text-slate-300 text-xs">{comment.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment Input */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Write a message of support or update..."
                  value={commentInputs[post.id] || ''}
                  onChange={(e) =>
                    setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendComment(post.id);
                  }}
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-red-500"
                />
                <button
                  type="button"
                  onClick={() => handleSendComment(post.id)}
                  className="p-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition shrink-0"
                  title="Send Comment"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Post Modal */}
      {newPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Create Community Post</h3>
              <button
                type="button"
                onClick={() => setNewPostModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Post Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Soup kitchen distribution completed in Helenvale"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category</label>
                  <select
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                  >
                    <option value="feedback">Community Feedback</option>
                    <option value="event">Community Event / Relief</option>
                    <option value="alert">Safety & Neighborhood</option>
                    <option value="complaint">Service Complaint</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Suburb / Area</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bethelsdorp, Helenvale"
                    value={postArea}
                    onChange={(e) => setPostArea(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Post Message *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share what happened, who attended, and any follow-up needed."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Photo Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://images.example.com/photo.jpg"
                  value={postImageUrl}
                  onChange={(e) => setPostImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewPostModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
