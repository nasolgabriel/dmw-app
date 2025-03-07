// src/pages/loginPage.tsx
import {
  Button,
  Container,
  IconButton,
  InputAdornment,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import Image from "next/image";
import QM_logo from "../../../assets/QM_logo.png";
import Login_BG from "../../../assets/Login_BG.jpg";
import loginContent from "./loginContents";
import CustomTextField from "@/components/TextField";

interface LoginPageProps {
  username: string;
  password: string;
  showPassword: boolean;
  rememberMe: boolean;
  // Changed from a single string to an object with separate errors.
  loginErrors: { username?: string; password?: string };
  onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePasswordVisibility: () => void;
  onRememberMeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({
  username,
  password,
  showPassword,
  rememberMe,
  loginErrors,
  onUsernameChange,
  onPasswordChange,
  onTogglePasswordVisibility,
  onRememberMeChange,
  onLogin,
}) => {
  return (
    <div className="md:flex flex-coljustify-center items-center pl-20 w-screen h-screen">
      <Image
        src={Login_BG}
        alt="Login Background"
        layout="fill"
        objectFit="cover"
        quality={100}
        style={{ opacity: 0.9, filter: "brightness(0.6) blur(1.5px)" }}
      />
      <div className="flex flex-col justify-start items-center bg-[#FFFF] rounded-[10px] lg:w-[700px] px-[20px] sm:px-0 z-[1] pb-5">
        <Image
          src={QM_logo}
          alt="queueMaster"
          className="pt-5 h-auto 
             w-[200px] sm:w-[300px] md:w-[400px] lg:w-[450px]"
        />
        <div className="flex flex-col gap-3 w-[80%] xl:px-10 lg:pb-20 py-10 text-[10px] md:text-[14px] lg:text-[16px]">
          <p className="text-[#1a3463] font-bold">USERNAME</p>
          <CustomTextField
            name="username"
            variant="outlined"
            placeholder="Username"
            value={username}
            onChange={onUsernameChange}
            outlinedColor="#bbb9b9"
            filledColor="#d8d4d4"
            error={!!loginErrors.username}
            helperText={loginErrors.username || ""}
          />
          <p className="pt-5 text-[#1a3463] font-bold">PASSWORD</p>
          <CustomTextField
            name="password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            placeholder="Password"
            value={password}
            onChange={onPasswordChange}
            outlinedColor="#bbb9b9"
            filledColor="#d8d4d4"
            error={!!loginErrors.password}
            helperText={loginErrors.password || ""}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? "hide the password" : "display the password"
                  }
                  onClick={onTogglePasswordVisibility}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          <div className="flex justify-between items-stretch font-bold text-[#1a3463]">
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={onRememberMeChange}
                  name="rememberMe"
                  color="primary"
                />
              }
              label="Remember Me"
            />
          </div>
          <Button
            variant="contained"
            name="Login"
            className="w-[full]"
            sx={{
              fontFamily: "arial",
              fontSize: "20px",
              height: "50px",
              borderRadius: "8px",
              textTransform: "none",
              backgroundColor: "#0038A8",
              "&:hover": {
                backgroundColor: "#002a7a",
              },
            }}
            onClick={onLogin}
          >
            Login
          </Button>
        </div>
      </div>
      <Container className="flex flex-col justify-end items-start md:pb-[14rem] h-full z-10">
        <div className="flex flex-col justify-start gap-4 mx-8">
          <Typography
            className="text-white"
            sx={{ fontWeight: "bold", fontSize: "24px" }}
          >
            {loginContent.welcome}
          </Typography>
          <Typography className="text-white" sx={{ fontSize: "24px" }}>
            {loginContent.subSection}
          </Typography>
          <Typography
            className="text-white"
            sx={{ fontWeight: "bold", fontSize: "24px" }}
          >
            {loginContent.institute}
          </Typography>
        </div>
      </Container>
    </div>
  );
};

export default LoginPage;
