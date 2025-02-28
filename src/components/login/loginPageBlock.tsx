import { useRememberMe } from "@/hooks/useRememberMe";
import { useState } from "react";
import LoginPage from "./loginPage";
import * as yup from "yup";
import { loginSchema } from "./validation";
import { mockUser } from "@/mocks/loginMock";

const LoginPageBlock: React.FC = () => {
  const [username, setUsername, rememberMe, setRememberMe] = useRememberMe(
    "rememberedUser",
    ""
  );
  const [password, setPassword, rememberPassword, setRememberPassword] =
    useRememberMe("rememberedPassword", "", true);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (loginError) setLoginError(null);
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (loginError) setLoginError(null);
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setRememberMe(checked);
    setRememberPassword(checked);
  };

  const handleLogin = async () => {
    try {
      await loginSchema.validate({ username, password }, { abortEarly: false });
      if (username === mockUser.username && password === mockUser.password) {
        setLoginError(null);
        // If "Remember Me" is not checked, clear both stored items.
        if (!rememberMe || !rememberPassword) {
          localStorage.removeItem("rememberedUser");
          localStorage.removeItem("rememberedPassword");
        }
        alert("Login Successful");
      } else {
        setLoginError("Invalid username or password.");
        setTimeout(() => setLoginError(null), 2000);
      }
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        setLoginError(error.errors.join(" "));
        setTimeout(() => setLoginError(null), 2000);
      }
    }
  };

  return (
    <LoginPage
      username={username}
      password={password}
      showPassword={showPassword}
      rememberMe={rememberMe}
      onUsernameChange={handleUsernameChange}
      onPasswordChange={handlePasswordChange}
      onTogglePasswordVisibility={togglePasswordVisibility}
      onRememberMeChange={handleRememberMeChange}
      onLogin={handleLogin}
      loginError={loginError}
    />
  );
};

export default LoginPageBlock;
