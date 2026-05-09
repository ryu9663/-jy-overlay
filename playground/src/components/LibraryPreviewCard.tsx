import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Overlay } from "@ryu9663/overlay";

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
      <Overlay isOpen={true} onClose={() => {}}>
        <CardActions sx={{ px: 2, pb: 2 }}>
          <Button fullWidth size="large" variant="contained">
            테스트 시작하기
          </Button>
        </CardActions>
      </Overlay>
    </Card>
  );
}
