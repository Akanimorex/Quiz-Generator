import { useState } from "react";
import axios from "axios";
import { Sparkles, BrainCircuit, Send, Loader2, Lightbulb, BookOpen, Table as Tabs } from "lucide-react";

export default function App() {
  const [text, setText] = useState("");
  const [quiz, setQuiz] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"input" | "output">("input");

  const generateQuiz = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    setActiveTab("output");
    


    try {
      const response = await axios.post("http://45.45.163.144:5000/chat", { message: text });
      setQuiz(response.data.reply.split("\n"));
    } catch (error) {
      console.error("Error generating quiz:", error);
      setQuiz(["Error generating quiz. Please try again."]);
    }
    
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      generateQuiz();
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div>

        {/* Header */}
        <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-slate-700">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BrainCircuit className="h-8 w-8 text-indigo-400" />
              <h1 className="text-2xl font-bold">AI Quiz Generator</h1>
            </div>
            <div className="hidden md:block text-sm text-slate-400">
              Create custom quizzes from any topic
            </div>
          </div>
        </header>

        {/* Mobile Tabs - Only visible on small screens */}
        <div className="md:hidden flex border-b border-slate-700">
          <button
            className={`flex-1 py-3 font-medium text-center ${
              activeTab === "input" ? "text-indigo-400 border-b-2 border-indigo-400" : "text-slate-400"
            }`}
            onClick={() => setActiveTab("input")}
          >
            <span className="flex items-center justify-center gap-2">
              <BookOpen className="h-4 w-4" />
              Input
            </span>
          </button>
          <button
            className={`flex-1 py-3 font-medium text-center ${
              activeTab === "output" ? "text-indigo-400 border-b-2 border-indigo-400" : "text-slate-400"
            }`}
            onClick={() => setActiveTab("output")}
          >
            <span className="flex items-center justify-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Quiz
            </span>
          </button>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col md:flex-row md:space-x-6">
            {/* Input Section - Hidden on mobile when output tab is active */}
            <div className={`md:w-1/2 ${activeTab === "output" ? "hidden md:block" : ""}`}>
              <div className="bg-slate-800 rounded-lg shadow-lg p-4 h-full">
                <div className="flex items-center mb-4">
                  <BookOpen className="h-5 w-5 text-indigo-400 mr-2" />
                  <h2 className="text-lg font-medium">Topic Input</h2>
                </div>
                
                <div className="space-y-4">
                  <textarea
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-white"
                    rows={8}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter a topic or text for your quiz..."
                  ></textarea>
                  
                  <div className="text-xs text-slate-400 flex justify-between items-center">
                    <span>Press Ctrl+Enter to generate</span>
                    <span>{text.length} characters</span>
                  </div>
                  
                  <button
                    className="w-full flex items-center justify-center py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200 font-medium"
                    onClick={generateQuiz}
                    disabled={loading || !text.trim()}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2" />
                        Generate Quiz
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Output Section - Hidden on mobile when input tab is active */}
            <div className={`md:w-1/2 mt-6 md:mt-0 ${activeTab === "input" ? "hidden md:block" : ""}`}>
              <div className="bg-slate-800 rounded-lg shadow-lg p-4 h-full">
                <div className="flex items-center mb-4">
                  <Lightbulb className="h-5 w-5 text-indigo-400 mr-2" />
                  <h2 className="text-lg font-medium">Generated Quiz</h2>
                </div>
                
                <div className="bg-slate-900 rounded-lg p-4 min-h-[300px] max-h-[500px] overflow-y-auto">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
                    </div>
                  ) : quiz.length > 0 ? (
                    <div className="space-y-4">
                      {quiz.map((q, index) => (
                        <div key={index} className="p-3 bg-slate-800 rounded-lg">
                          <p className="text-slate-200">{q}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center">
                      <Tabs className="h-12 w-12 mb-3 text-slate-500" />
                      <p>Your quiz questions will appear here</p>
                      <p className="text-sm mt-2">Enter a topic and click Generate Quiz to start</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-4 px-4 sm:px-6 lg:px-8 border-t border-slate-700 mt-auto">
          <div className="max-w-7xl mx-auto text-center text-sm text-slate-500">
            Powered by Cudos &copy; {new Date().getFullYear()}
          </div>
        </footer>
      </div>
    </div>
  );
}