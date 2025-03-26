// src/pages/LoginPageBlock.tsx
import { useRememberMe } from "@/hooks/useRememberMe";
import { useState } from "react";
import LoginPage from "./loginPage";
import { useApiCallback } from "@/hooks/useApi";
import { LoginCredentials, LoginResponse } from "@/types/auth";
import { loginApi } from "@/api/authApi";
import { useNavigate } from "react-router-dom";
import { setLoginInfo } from "@/utils/loginInfo";

interface LoginErrors {
  username?: string;
  password?: string;
}

const LoginPageBlock: React.FC = () => {
  const { execute: executeLogin, loading } = useApiCallback<
    LoginResponse,
    [LoginCredentials]
  >(loginApi);

  const navigate = useNavigate();

  const [username, setUsername, rememberMe, setRememberMe] = useRememberMe(
    "rememberedUser",
    ""
  );
  const [password, setPassword, rememberPassword, setRememberPassword] =
    useRememberMe("rememberedPassword", "", true);
  const [showPassword, setShowPassword] = useState(false);
  const [loginErrors, setLoginErrors] = useState<LoginErrors>({});

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (loginErrors.username) {
      setLoginErrors((prev) => ({ ...prev, username: undefined }));
    }
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (loginErrors.password) {
      setLoginErrors((prev) => ({ ...prev, password: undefined }));
    }
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
      const response = await executeLogin({ username, password });
      if (response.access_token) {
        setLoginErrors({});
        setLoginInfo({
          accessToken: response.access_token,
          role: response.role,
          counterId: response.user.counter_id,
          windowTitle: response.user.name,
        });

        if (!rememberMe || !rememberPassword) {
          localStorage.removeItem("rememberedUser");
          localStorage.removeItem("rememberedPassword");
        }

        if (response.role === "firststep") {
          navigate("/first-step-view");
        } else if (response.role === "windows") {
          navigate("/window-view");
        } else {
          navigate("/window-view");
        }
      } else {
        setLoginErrors({
          username: "Invalid username or password.",
          password: "Invalid username or password.",
        });
        localStorage.removeItem("rememberedUser");
        localStorage.removeItem("rememberedPassword");
        setPassword("");
        setTimeout(() => setLoginErrors({}), 2000);
      }
    } catch (error: any) {
      localStorage.removeItem("rememberedUser");
      localStorage.removeItem("rememberedPassword");
      setPassword("");

      if (error.response && error.response.data) {
        const { message, errors } = error.response.data;
        if (message === "Validation Error" && errors) {
          const apiErrors: LoginErrors = {};
          if (errors.username) {
            apiErrors.username = errors.username.join(" ");
          }
          if (errors.password) {
            apiErrors.password = errors.password.join(" ");
          }
          setLoginErrors(apiErrors);
        } else {
          setLoginErrors({
            username: "Invalid username or password.",
            password: "Invalid username or password.",
          });
        }
      } else {
        setLoginErrors({
          username: error.message || "An error occurred during login.",
          password: error.message || "An error occurred during login.",
        });
      }
      setTimeout(() => setLoginErrors({}), 2000);
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
      loginErrors={loginErrors}
    />
  );
};

export default LoginPageBlock;
