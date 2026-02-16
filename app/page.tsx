'use client';

import { useState, useEffect } from 'react';

interface Post {
  id: string;
  title: string;
  content: string | null;
  published: boolean;
  authorId: string | null;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/post');
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError('Failed to load posts');
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          published,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create post');
      }

      setTitle('');
      setContent('');
      setPublished(false);
      fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black py-12 px-4">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-8">
          Blog Posts
        </h1>

        {/* Create Post Form */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-4">
            Create New Post
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter post title"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter post content"
              />
            </div>

            <div className="flex items-center">
              <input
                id="published"
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-zinc-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="published" className="ml-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Published
              </label>
            </div>

            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black dark:bg-zinc-50 text-white dark:text-black px-6 py-2 rounded-md font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Create Post'}
            </button>
          </form>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-4">
            All Posts ({posts.length})
          </h2>

          {posts.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-8 text-center">
              <p className="text-zinc-600 dark:text-zinc-400">
                No posts yet. Create your first post above!
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-black dark:text-zinc-50 mb-2">
                      {post.title}
                    </h3>
                    {post.content && (
                      <p className="text-zinc-600 dark:text-zinc-400 mb-3">
                        {post.content}
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          post.published
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                            : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                        }`}
                      >
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-500">
                        ID: {post.id}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
