import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export interface AnimatedRemoveModalProps {
  open: boolean;
  onClose: () => void;
  onExited: () => void;
}

export function AnimatedRemoveModal({
  open,
  onClose,
  onExited,
}: AnimatedRemoveModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      setIsVisible(open);
    });

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [open]);

  return (
    <Box
      role="presentation"
      onClick={onClose}
      onTransitionEnd={(event) => {
        if (
          event.target === event.currentTarget &&
          event.propertyName === "opacity" &&
          !open
        ) {
          onExited();
        }
      }}
      sx={{
        alignItems: "center",
        bgcolor: "rgba(15, 23, 42, 0.56)",
        display: "flex",
        inset: 0,
        justifyContent: "center",
        opacity: isVisible ? 1 : 0,
        p: 3,
        pointerEvents: isVisible ? "auto" : "none",
        position: "fixed",
        transition: "opacity 220ms ease",
        zIndex: 10000,
      }}
    >
      <Card
        aria-labelledby="animated-remove-modal-title"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
        sx={{
          borderRadius: 4,
          boxShadow: "0 24px 80px rgba(15, 23, 42, 0.32)",
          maxWidth: 440,
          transform: isVisible
            ? "translateY(0) scale(1)"
            : "translateY(12px) scale(0.98)",
          transition: "transform 220ms ease",
          width: "100%",
        }}
      >
        <CardContent>
          <Stack spacing={1.5}>
            <Typography
              component="h2"
              id="animated-remove-modal-title"
              variant="h6"
            >
              close → remove 예제
            </Typography>
            <Typography color="text.secondary" variant="body2">
              닫기 버튼을 누르면 먼저 close가 호출되어 open=false가 됩니다.
              fade-out transition이 끝나면 onExited에서 remove를 호출해
              store에서 완전히 제거합니다.
            </Typography>
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
          <Button onClick={onClose} variant="contained">
            fade-out 후 remove
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
