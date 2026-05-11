import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { overlay } from "@ryu9663/overlay";
import { TestModal } from "./TestModal";
import { StackedTestModal } from "./StackedTestModal";

export function LibraryPreviewCard() {
  return (
    <Card
      variant="outlined"
      sx={{
        maxWidth: 420,
        borderRadius: 4,
        boxShadow: "0 18px 48px rgba(15, 23, 42, 0.12)",
      }}
    >
      <CardContent>
        <Stack spacing={2.5}>
          <Box
            sx={{
              alignItems: "center",
              bgcolor: "primary.main",
              borderRadius: 3,
              color: "primary.contrastText",
              display: "inline-flex",
              height: 48,
              justifyContent: "center",
              width: 48,
            }}
          >
            ✨
          </Box>

          <Stack spacing={1}>
            <Typography component="h1" variant="h5">
              Overlay playground
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Publish 전에 실제 React 앱에서 라이브러리 컴포넌트를 확인하는
              공간입니다.
            </Typography>
          </Stack>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            <Chip color="primary" label="React 19" size="small" />
            <Chip label="MUI" size="small" />
            <Chip label="workspace:*" size="small" />
          </Box>
        </Stack>
      </CardContent>
      <CardActions sx={{ flexDirection: "column", gap: 1, px: 2, pb: 2 }}>
        <Button
          fullWidth
          size="large"
          variant="contained"
          onClick={() => {
            overlay.open(({ isOpen, close }) => (
              <TestModal open={isOpen} onClose={close} />
            ));
          }}
        >
          단일 모달 열기
        </Button>
        <Button
          fullWidth
          size="large"
          variant="outlined"
          onClick={() => {
            const openStackedModal = (order: number) => {
              overlay.open(({ isOpen, close }) => (
                <StackedTestModal
                  open={isOpen}
                  order={order}
                  onClose={close}
                  onOpenNext={order < 3 ? () => openStackedModal(order + 1) : undefined}
                />
              ));
            };

            openStackedModal(1);
          }}
        >
          스택 모달 시작하기
        </Button>
      </CardActions>
    </Card>
  );
}
