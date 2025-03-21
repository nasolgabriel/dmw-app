import {
    Modal,
    Box,
    ModalProps,
    SxProps,
    Theme,
    Backdrop,
  } from '@mui/material';
  import React, { useState } from 'react';
  
  interface CustomModalProps extends Omit<ModalProps, 'children' | 'onClose'> {
    sx?: SxProps<Theme>;
    blurIntensity?: number;
    onClose?: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
    defaultOpen?: boolean;
    contentSx?: SxProps<Theme>;
    children: React.ReactNode;
  }
  
  const CustomModal = React.forwardRef<HTMLDivElement, CustomModalProps>(
    (
      {
        open: controlledOpen,
        onClose,
        sx = {},
        blurIntensity = 0,
        children,
        defaultOpen = false,
        contentSx = {},
        ...props
      },
      ref
    ) => {
      const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
      const isControlled = typeof controlledOpen !== 'undefined';
      const open = isControlled ? controlledOpen : uncontrolledOpen;
  
      const handleClose = (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => {
        if (!isControlled) {
          setUncontrolledOpen(false);
        }
        onClose?.(event, reason);
      };
  
      const backdropStyles = {
        backdropFilter: blurIntensity ? `blur(${blurIntensity}px)` : 'none',
      };
  
      const mergedSx: SxProps<Theme> = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx,
      };
  
      const contentStyles: SxProps<Theme> = {
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        minWidth: 300,
        outline: 'none',
        position: 'relative',
        maxHeight: '90vh',
        overflow: 'auto',
        ...contentSx,
      };
  
      return (
        <Modal
          ref={ref}
          open={open}
          onClose={handleClose}
          sx={mergedSx}
          slots={{
            backdrop: Backdrop,
          }}
          slotProps={{
            root: {
              // @ts-ignore - MUI types issue
              'data-testid': 'custom-modal',
            },
            backdrop: {
              sx: backdropStyles,
            },
          }}
          {...props}
        >
          <Box sx={contentStyles}>{children}</Box>
        </Modal>
      );
    }
  );
  
  export default CustomModal;