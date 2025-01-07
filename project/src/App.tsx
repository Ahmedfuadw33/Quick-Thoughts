import React, { useState, useEffect } from 'react';
import { Search, PenLine, Calendar, Tag, X } from 'lucide-react';

interface Thought {
  id: string;
  content: string;
  category: string;
  timestamp: number;
}

const categories = ['Work', 'Personal', 'Study', 'Ideas', 'Tasks'];

function App() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [newThought, setNewThought] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Personal');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedThoughts = localStorage.getItem('thoughts');
    if (savedThoughts) {
      setThoughts(JSON.parse(savedThoughts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('thoughts', JSON.stringify(thoughts));
  }, [thoughts]);

  const addThought = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThought.trim()) return;

    const thought: Thought = {
      id: Date.now().toString(),
      content: newThought,
      category: selectedCategory,
      timestamp: Date.now(),
    };

    setThoughts([thought, ...thoughts]);
    setNewThought('');
  };

  const deleteThought = (id: string) => {
    setThoughts(thoughts.filter(thought => thought.id !== id));
  };

  const filteredThoughts = thoughts.filter(thought => {
    const matchesSearch = thought.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         thought.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto p-6">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Quick Thoughts</h1>
          <p className="text-gray-600">Capture your ideas, instantly.</p>
        </header>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={addThought} className="space-y-4">
            <div className="flex gap-4">
              <textarea
                value={newThought}
                onChange={(e) => setNewThought(e.target.value)}
                placeholder="What's on your mind?"
                className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>
            <div className="flex justify-between items-center">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <PenLine size={20} />
                Add Thought
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search thoughts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>

          <div className="space-y-4">
            {filteredThoughts.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No thoughts found. Start adding some!
              </div>
            ) : (
              filteredThoughts.map(thought => (
                <div
                  key={thought.id}
                  className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Tag size={16} className="text-blue-500" />
                      <span className="text-sm font-medium text-blue-600">
                        {thought.category}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteThought(thought.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <p className="text-gray-800 whitespace-pre-wrap">{thought.content}</p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <Calendar size={14} />
                    <span>{formatDate(thought.timestamp)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;