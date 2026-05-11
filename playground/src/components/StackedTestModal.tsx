import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export interface StackedTestModalProps {
  open: boolean;
  order: number;
  onClose: () => void;
  onOpenNext?: () => void;
}

export function StackedTestModal({
  open,
  order,
  onClose,
  onOpenNext,
}: StackedTestModalProps) {
  if (!open) return null;

  return (
    <Box
      role="presentation"
      onClick={onClose}
      sx={{
        alignItems: "center",
        bgcolor: "rgba(15, 23, 42, 0.42)",
        display: "flex",
        inset: 0,
        justifyContent: "center",
        p: 3,
        position: "fixed",
        zIndex: 10000,
      }}
    >
      <Card
        aria-labelledby={`stacked-modal-${order}-title`}
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
            <Box sx={{ alignItems: "center", display: "flex", justifyContent: "space-between" }}>
              <Typography component="h2" id={`stacked-modal-${order}-title`} variant="h6">
                Stack modal #{order}
              </Typography>
              <Chip color="primary" label={`opened #${order}`} size="small" />
            </Box>
            <Typography color="text.secondary" variant="body2">
              이 모달은 {order}번째로 열렸습니다. 다음 모달을 생각 없이 열어도
              OverlayProvider가 열린 순서대로 렌더링해서 마지막에 열린 모달이 위에
              쌓입니다.
            </Typography>
            <Typography color="text.secondary" variant="body2">
              닫을 때는 현재 보이는 최상단 모달부터 닫으면 #3 → #2 → #1 순서로
              이전 모달이 다시 나타납니다.
            </Typography>
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
          <Button onClick={onClose}>#{order} 닫기</Button>
          {onOpenNext ? (
            <Button onClick={onOpenNext} variant="contained">
              #{order + 1} 열기
            </Button>
          ) : (
            <Button disabled variant="contained">
              마지막 모달
            </Button>
          )}
        </CardActions>
      </Card>
    </Box>
  );
}
