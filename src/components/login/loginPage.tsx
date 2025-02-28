import {
  Button,
  Container,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import loginContent from "./loginContents";
import Image from "next/image";
import QM_logo from "../../assets/QM_logo.png";
import CustomTextField from "../TextField";
import { VisibilityOff, Visibility, CheckBox } from "@mui/icons-material";
import Login_BG from "../../assets/Login_BG.jpg";

interface LoginPageProps {
  password: string;
  showPassword: boolean;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePasswordVisibility: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({
  password,
  showPassword,
  onPasswordChange,
  onTogglePasswordVisibility,
}) => {
  return (
    <div className="flex justify-center items-center pl-20 w-screen h-screen">
      <Image
        src={Login_BG}
        alt="Login Background"
        layout="fill"
        objectFit="cover"
        quality={100}
        style={{ opacity: 0.9, filter: "brightness(0.6) blur(1.5px)" }}
      />
      <Container
        className="flex flex-col justify-start items-center bg-[#FFFF] rounded-[15px]"
        sx={{
          width: { xs: "90%", sm: "650px" },
          height: { xs: "auto", sm: "750px" },
          padding: { xs: "20px", sm: "0" },
          zIndex: 1,
        }}
      >
        <Image
          src={QM_logo}
          alt={"queueMaster"}
          className="w-auto xl:h-[180px]"
        ></Image>
        <div className="flex flex-col gap-3 w-[80%] px-10 pt-10">
          <p className="text-[#1a3463] font-bold">USERNAME</p>
          <CustomTextField
            name="username"
            variant="outlined"
            placeholder="Username"
            outlinedColor="#bbb9b9"
            filledColor="#d8d4d4"
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
            <div className="flex">
              <CheckBox />
              <p>Remember Me</p>
            </div>
            <p>Forget Password</p>
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
          >
            Login
          </Button>
        </div>
      </Container>
      <Container className="flex flex-col justify-end items-start pb-[10rem] h-full z-10">
        <div className="flex flex-col justify-start gap-5 mx-20">
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
            className="text-white "
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
