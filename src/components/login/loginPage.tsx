import { Button, Container, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleQueueDisplayClick = () => {
    navigate("/queue-display");
  };

  return (
    <div className="flex flex-col bg-[#F2F2F2] justify-center items-center w-screen h-screen">
      <Container
        className="flex flex-col justify-center items-center bg-[#FFFF] rounded-[30px]"
        sx={{
          width: { xs: "90%", sm: "600px" },
          height: { xs: "auto", sm: "750px" },
          padding: { xs: "20px", sm: "0" },
        }}
      >
        <div className="w-full h-full">
          <div className="flex flex-col gap-8 mx-10 mt-20">
            <h1 className="font-bold text-[4rem]">LOGIN</h1>
            <TextField
              variant="outlined"
              label="Username"
              sx={{
                "& .MuiOutlinedInput-input": {
                  fontFamily: "arial",
                  fontWeight: 500,
                  fontSize: "20px",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderWidth: "2px",
                    borderRadius: "10px",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "black",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  fontFamily: "arial",
                  fontWeight: 400,
                  color: "black",
                },
              }}
            />
            <TextField
              variant="outlined"
              label="Password"
              type="password"
              sx={{
                "& .MuiOutlinedInput-input": {
                  fontFamily: "arial",
                  fontWeight: 500,
                  fontSize: "20px",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderWidth: "2px",
                    borderRadius: "10px",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "black",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  fontFamily: "arial",
                  fontWeight: 400,
                  color: "black",
                },
              }}
            />
            <Button
              variant="contained"
              name="Login"
              className="w-full"
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
            <hr className="w-full mt-4 border-t-2 border-gray-300" />
            <div className="flex justify-center items-center">
              <Button
                variant="contained"
                name="Queue Display"
                className="w-[50%]"
                sx={{
                  fontFamily: "arial",
                  fontSize: "20px",
                  height: "50px",
                  borderRadius: "8px",
                  textTransform: "none",
                  backgroundColor: "#ED0C25",
                  "&:hover": {
                    backgroundColor: "#CE1126",
                  },
                }}
                onClick={handleQueueDisplayClick}
              >
                Queue Display
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default LoginPage;
