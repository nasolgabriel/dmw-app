import { clientTransfer } from "@/api/authApi";
import { useApiCallback } from "@/hooks/useApi";
import { Typography, Button, Box, styled } from "@mui/material";

interface ClientTransferModalProps {
  onClose: () => void;
  clientId: number;
  refetchClientTable: () => void;
  handleClearCard: () => void;
}

const ClientTransferModal = ({
  onClose,
  clientId,
  refetchClientTable,
  handleClearCard,
}: ClientTransferModalProps) => {
  const divisionMap: { [key: string]: string } = {
    "PROTECTION DIVISION (windows 1-3)": "Migrant Workers Protection Division",
    "PROCESSING DIVISION (windows 4-7)": "Migrant Worker Processing Division", 
    "WRSD windows (8-10)": "Welfare Reintegration and Services Division",
    "PAG-IBIG": "PAG IBIG Fund",
    "CASHIER": "Cashier",
    "OWWA": "OWWA"
  };

  const transferClient = useApiCallback(
    async (clientId: number, divisionName: string) => {
      return await clientTransfer(clientId, divisionName);
    }
  );

  const handleTransferButton = async (divisionName: string) => {
    if (!clientId) return;
  
    try {
      await clientTransfer(clientId, divisionName);
      refetchClientTable();
      onClose();
    } catch (error) {
      console.error("Transfer failed:", error);
    }
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
        "Migrant Workers Protection Division",
        "Migrant Worker Processing Division",
        "Welfare Reintegration and Services Division"
      ]
    },
    {
      buttons: [
        "PAG IBIG Fund",
        "OWWA",
        "Cashier"
      ],
      row: true
    }
  ];

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
                <TransferButton
                key={btnIndex}
                onClick={() => {
                  handleTransferButton(text);
                  handleClearCard();
                }}
                disabled={transferClient.loading}
                >
                {transferClient.loading ? "Transferring..." : text}
                </TransferButton>
            ))}
          </Box>
        ))}

        {transferClient.error && (
          <Typography color="error" sx={{ mt: 2 }}>
            Transfer failed: {transferClient.error.message}
          </Typography>
        )}
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

export default ClientTransferModal;
