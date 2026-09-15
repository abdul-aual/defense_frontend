import "./Login.css";

function Login() {
  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-logo">
          Rentwise
        </div>

        <h1>Welcome Back</h1>

        <p className="login-subtitle">
          Login to continue your journey with Rentwise
        </p>

        <form>

          <div className="login-form-group">
            <label>Phone Number</label>

            <input
              type="text"
              placeholder="Enter your phone number"
            />
          </div>

          <div className="login-form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
            />
          </div>

          <div className="login-options">

            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>

            <button
              type="button"
              className="forgot-password"
            >
              Forgot Password?
            </button>

          </div>

          <button
            type="submit"
            className="login-submit"
          >
            Login
          </button>

        </form>

        <div className="login-divider">
          <span>OR</span>
        </div>

        <p className="register-text">
          Don't have an account?
          <button
            type="button"
            className="register-link"
          >
            Create Account
          </button>
        </p>

      </div>

    </div>
  );
}

export default Login;