import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export interface TestModalProps {
  open: boolean;
  onClose: () => void;
}

export function TestModal({ open, onClose }: TestModalProps) {
  if (!open) return null;

  return (
    <Box
      role="presentation"
      onClick={onClose}
      sx={{
        alignItems: "center",
        bgcolor: "rgba(15, 23, 42, 0.56)",
        display: "flex",
        inset: 0,
        justifyContent: "center",
        p: 3,
        position: "fixed",
        zIndex: 10000,
      }}
    >
      <Card
        aria-labelledby="test-modal-title"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
        sx={{
          borderRadius: 4,
          boxShadow: "0 24px 80px rgba(15, 23, 42, 0.32)",
          maxWidth: 420,
          width: "100%",
        }}
      >
        <CardContent>
          <Stack spacing={1.5}>
            <Typography component="h2" id="test-modal-title" variant="h6">
              테스트 모달
            </Typography>
            <Typography color="text.secondary" variant="body2">
              overlay.open으로 열린 모달입니다. 바깥 영역이나 닫기 버튼을 누르면
              닫힙니다.
            </Typography>
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
          <Button onClick={onClose}>취소</Button>
          <Button onClick={onClose} variant="contained">
            확인
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
