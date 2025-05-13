import React, { useEffect } from "react";
import { Box, Button, Typography, Tooltip } from "@mui/material";
import CustomModal from "@/components/modal/customModal";
import { dataPrivacyContent } from "./dataPrivacy";

interface SubmissionModalProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  handleConfirmSubmission: () => void;
}

const SubmissionModal: React.FC<SubmissionModalProps> = ({
  isModalOpen,
  handleCloseModal,
  handleConfirmSubmission,
}) => {
  // Add keyboard event listeners for Enter (confirm) and Escape (cancel)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isModalOpen) return;
      if (event.key === "Enter") {
        event.preventDefault();
        handleConfirmSubmission();
      } else if (event.key === "Escape") {
        event.preventDefault();
        handleCloseModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen, handleConfirmSubmission, handleCloseModal]);

  return (
    <CustomModal
      open={isModalOpen}
      onClose={handleCloseModal}
      blurIntensity={5}
      contentSx={{
        maxWidth: 800,
        width: "100%",
        p: 4,
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Data Privacy Notice
        </Typography>
        <Box
          sx={{
            maxHeight: "60vh",
            overflow: "auto",
            textAlign: "left",
            border: "1px solid #eee",
            borderRadius: 1,
            p: 2,
            mt: 2,
            mb: 4,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "pre-line",
              lineHeight: 1.6,
              "& .section-heading": {
                fontWeight: 600,
                mt: 2,
                mb: 1,
              },
            }}
          >
            {dataPrivacyContent}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Tooltip title="Press Esc to cancel" arrow placement="top">
            <Button
              variant="outlined"
              color="error"
              onClick={handleCloseModal}
              sx={{ width: "45%" }}
            >
              Cancel
            </Button>
          </Tooltip>
          <Tooltip title="Press Enter to agree" arrow placement="top">
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmSubmission}
              sx={{
                width: "45%",
                bgcolor: "#FEAF00",
                "&:hover": { bgcolor: "#E9A000" },
                "&:active": { bgcolor: "forestgreen" },
              }}
            >
              I Agree
            </Button>
          </Tooltip>
        </Box>
      </Box>
    </CustomModal>
  );
};

export default SubmissionModal;
