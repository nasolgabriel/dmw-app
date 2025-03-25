import { Typography, Button, Box, styled } from "@mui/material";

const ClientTransferModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <Box
      sx={{
        minWidth: { xs: "100%", md: "500px" },
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        overflow: "auto",
        minHeight: "700px",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="h4" fontWeight="bold">
        TRANSFER CLIENT TO OTHER COUNTER/WINDOW
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          marginX: { xs: "10px", md: "30px" },
        }}
      >
        {buttonGroups.map((group, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: group.row ? "row" : "column",
              gap: 2,
              width: "100%",
            }}
          >
            {group.buttons.map((text, btnIndex) => (
              <TransferButton key={btnIndex}>{text}</TransferButton>
            ))}
          </Box>
        ))}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button
          variant="contained"
          onClick={onClose}
          color="error"
          sx={{ px: 4 }}
        >
          Close
        </Button>
      </Box>
    </Box>
  );
};

const TransferButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "isMobile",
})(({ theme }) => ({
  color: "white",
  fontSize: theme.typography.pxToRem(14),
  [theme.breakpoints.up("md")]: {
    fontSize: theme.typography.pxToRem(18),
  },
  backgroundColor: "#0038A8",
  fontWeight: theme.typography.fontWeightBold,
  width: "100%",
  transition: theme.transitions.create("background-color", {
    duration: theme.transitions.duration.short,
  }),
  "&:hover": {
    backgroundColor: "#00257A",
  },
  padding: theme.spacing(2),
}));

const buttonGroups = [
  {
    buttons: [
      "PROTECTION DIVISION (windows 1-3)",
      "PROCESSING DIVISION (windows 4-7)",
      "WRSD windows (8-10)",
    ],
  },
  {
    buttons: ["PAG-IBIG", "OWWA", "CASHIER"],
    row: true,
  },
];

export default ClientTransferModal;
