'use client';

const LoginFrom = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form className="w full max-w-md bg-white p-6 rounded-lg shadow-md space-y-5">
        <h1 className="text-2xl font-semibold text-center">
          Login
        </h1>

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>

          <input
            type="email"
            id="email"
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your email" />
        </div>
        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>

          <input
            id="password"
            type="password"
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  )
}

export default LoginFrom;