import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Hash,
  Send,
  Reply,
  Heart,
  CornerDownRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  getAllQuestions,
  createQuestion,
  getAnswersByQuestion,
  createAnswer
} from '@/services/ForumService';
import type QuestionDto from '@/models/QuestionDto';
import type AnswerDto from '@/models/AnswerDto';

interface ReplyData {
  id: string;
  author: { name: string };
  content: string;
  timeAgo: string;
}

interface Post {
  id: string;
  author: {
    name: string;
  };
  timeAgo: string;
  title: string;
  content: string;
  hashtags: string[];
  likes: number;
  replies: ReplyData[];
}

function toPost(question: QuestionDto, answers: AnswerDto[] = []): Post {
  return {
    id: question.id || '',
    author: {
      name: 'User',
    },
    timeAgo: question.createdAt ? new Date(question.createdAt).toLocaleDateString() : 'Just now',
    title: question.heading || 'Discussion',
    content: question.content,
    hashtags: question.tags || [],
    likes: 0,
    replies: answers.map(toReplyData),
  };
}

function toReplyData(answer: AnswerDto): ReplyData {
  return {
    id: answer.id || '',
    author: {
      name: 'User',
    },
    content: answer.content,
    timeAgo: answer.createdAt ? new Date(answer.createdAt).toLocaleDateString() : 'Just now',
  };
}

export default function CommunityForum() {
  const [newMessage, setNewMessage] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);
  // tracks which post IDs have all replies expanded
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  const fetchForumData = useCallback(async () => {
    setLoading(true);
    try {
      const questions = await getAllQuestions();
      const postsWithAnswers = await Promise.all(
        questions.map(async (q) => {
          let answers: AnswerDto[] = [];
          if (q.id) {
            try {
              answers = await getAnswersByQuestion(q.id);
            } catch (err) {
              console.error(`Error fetching answers for question ${q.id}:`, err);
            }
          }
          return toPost(q, answers);
        })
      );
      setPosts(postsWithAnswers);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchForumData();
  }, [fetchForumData]);

  const toggleReplies = (postId: string) => {
    setExpandedReplies((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const questionData: QuestionDto = {
        heading: newMessage.length > 50 ? newMessage.slice(0, 47) + '...' : newMessage,
        content: newMessage,
        tags: ['general'],
      };
      const savedQuestion = await createQuestion(questionData);
      const newPost = toPost(savedQuestion, []);
      setPosts((prevPosts) => [newPost, ...prevPosts]);
      setNewMessage('');
    } catch (error) {
      console.error('Error creating question:', error);
    }
  };

  // backend: POST /forum/questions/{questionId}/answers
  const handleSendReply = async (postId: string) => {
    if (!replyText.trim()) return;

    try {
      const answerData: AnswerDto = {
        content: replyText,
        questionId: postId,
      };
      const savedAnswer = await createAnswer(postId, answerData);
      const newReply = toReplyData(savedAnswer);

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, replies: [...post.replies, newReply] }
            : post
        )
      );
      setReplyText('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error creating answer:', error);
    }
  };

  const toggleLike = (postId: string) => {
    // Keep likes completely local as it's not supported by the backend DTO/endpoints
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, likes: post.likes + 1 }
          : post
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-950 p-4 md:p-8 pt-28 md:pt-32 font-sans text-slate-900 dark:text-slate-100">
      <div className="max-w-4xl mx-auto flex flex-col gap-8 relative h-full">
        
        <div className="flex-1 space-y-6 pb-24">
          
          <div className="mb-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Community Discussions
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Share insights and ask questions within the community network.
            </p>
          </div>

          <div className="space-y-5">
            {loading && posts.length === 0 ? (
              <div className="text-center py-12 text-slate-500 font-medium bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm animate-pulse">
                Loading discussions...
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12 text-slate-500 font-medium bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                No discussions yet. Start one below!
              </div>
            ) : (
              posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-sm rounded-2xl bg-white dark:bg-slate-900 overflow-hidden">
                  <div className="p-6">
                    
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-slate-900 dark:text-white">
                            {post.author.name}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm text-slate-500 font-medium">
                        {post.timeAgo}
                      </span>
                    </div>

                    <h2 className="text-xl md:text-2xl font-medium text-slate-900 dark:text-white leading-snug mb-3 hover:text-blue-700 cursor-pointer transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 text-[15px] leading-relaxed mb-4">
                      {post.content}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.hashtags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#2B547E] dark:bg-blue-900/30 dark:text-blue-300 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                        >
                          <Hash className="h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => toggleLike(post.id)}
                        className="flex items-center gap-1.5 text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 text-sm font-medium transition-colors"
                      >
                        <Heart className="h-4 w-4" />
                        {post.likes}
                      </button>

                      <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                        <MessageSquare className="h-4 w-4" />
                        {post.replies.length} {post.replies.length === 1 ? 'Reply' : 'Replies'}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setReplyingTo(replyingTo === post.id ? null : post.id);
                          setReplyText('');
                        }}
                        className="ml-auto text-slate-500 hover:text-[#2B547E] dark:hover:text-blue-400 gap-1.5"
                      >
                        <Reply className="h-4 w-4" />
                        Reply
                      </Button>
                    </div>

                    {/* Replies — only 1 visible by default, expand on "Show more" */}
                    <AnimatePresence>
                      {post.replies.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-4 space-y-3 pl-4 border-l-2 border-slate-100 dark:border-slate-800"
                        >
                          {/* Always show the first reply */}
                          {[post.replies[0]].map((reply) => (
                            <div key={reply.id} className="flex gap-3">
                              <Avatar className="h-7 w-7 shrink-0 mt-0.5">
                                <AvatarFallback className="text-xs">{reply.author.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                    {reply.author.name}
                                  </span>
                                  <span className="text-xs text-slate-400">{reply.timeAgo}</span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                  {reply.content}
                                </p>
                              </div>
                            </div>
                          ))}

                          {/* Hidden replies revealed on expand */}
                          <AnimatePresence>
                            {expandedReplies.has(post.id) && post.replies.length > 1 && (
                              <motion.div
                                key="extra-replies"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25 }}
                                className="space-y-3 overflow-hidden"
                              >
                                {post.replies.slice(1).map((reply) => (
                                  <div key={reply.id} className="flex gap-3">
                                    <Avatar className="h-7 w-7 shrink-0 mt-0.5">
                                      <AvatarFallback className="text-xs">{reply.author.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                          {reply.author.name}
                                        </span>
                                        <span className="text-xs text-slate-400">{reply.timeAgo}</span>
                                      </div>
                                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {reply.content}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Show more / Show less toggle */}
                          {post.replies.length > 1 && (
                            <button
                              onClick={() => toggleReplies(post.id)}
                              className="text-xs font-semibold text-[#2B547E] dark:text-blue-400 hover:underline mt-1 transition-colors"
                            >
                              {expandedReplies.has(post.id)
                                ? 'Show less'
                                : `Show ${post.replies.length - 1} more ${post.replies.length - 1 === 1 ? 'reply' : 'replies'}`}
                            </button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* backend: POST /forum/posts/{postId}/replies */}
                    <AnimatePresence>
                      {replyingTo === post.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 overflow-hidden"
                        >
                          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                            <CornerDownRight className="h-4 w-4 text-slate-400 shrink-0 ml-1" />
                            <Input
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder={`Reply to ${post.author.name}...`}
                              className="flex-1 bg-transparent border-0 focus-visible:ring-0 shadow-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSendReply(post.id);
                              }}
                              autoFocus
                            />
                            <Button
                              onClick={() => handleSendReply(post.id)}
                              size="sm"
                              className="bg-[#2B547E] hover:bg-[#1E3F60] text-white rounded-full px-4 transition-colors shadow-sm shrink-0"
                            >
                              <Send className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                </Card>
              </motion.div>
            )))}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 w-full p-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-2 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Write a message to the community..."
                className="flex-1 bg-transparent border-0 focus-visible:ring-0 shadow-none px-4 text-slate-900 dark:text-white placeholder:text-slate-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
              />
              <Button 
                onClick={handleSendMessage}
                className="bg-[#2B547E] hover:bg-[#1E3F60] text-white rounded-full px-6 transition-colors shadow-sm shrink-0"
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
