import { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import Characters from "./components/Characters";

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showPassword, setShowPassword] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  let typingTimer: NodeJS.Timeout;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleTyping = () => {
    setIsTyping(true);
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      setIsTyping(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-[1000px] flex">
        <div className="w-1/2 bg-gray-50 p-12 flex items-center justify-center">
          <Characters
            mousePosition={mousePosition}
            isTyping={isTyping}
            showPassword={showPassword}
          />
        </div>

        <div className="w-1/2 px-16 py-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Welcome back!</h2>
            <p className="text-gray-500 mt-1 text-sm">
              Please enter your details
            </p>
          </div>

          <form className="space-y-5">
            <div className="relative">
              <label
                className={`absolute transition-all duration-200 ${
                  isEmailFocused || email
                    ? "-top-2 left-2 text-xs bg-white px-1 text-gray-700"
                    : "top-2.5 left-3.5 text-gray-500"
                }`}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  handleTyping();
                }}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                className="block w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              />
            </div>

            <div className="relative">
              <label
                className={`absolute transition-all duration-200 ${
                  isPasswordFocused || password
                    ? "-top-2 left-2 text-xs bg-white px-1 text-gray-700"
                    : "top-2.5 left-3.5 text-gray-500"
                }`}
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  handleTyping();
                }}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                className="block w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                <Eye className="h-4 w-4 text-gray-400" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-gray-900 focus:ring-gray-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-600">
                  Remember me for 30 days
                </label>
              </div>
              <a href="#" className="text-sm text-gray-900 hover:text-gray-700">
                Forgot password?
              </a>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Log in
              </button>
            </div>

            <div className="mt-4">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="w-4 h-4"
                />
                Log in with Google
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <a
              href="#"
              className="font-medium text-gray-900 hover:text-gray-700"
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
