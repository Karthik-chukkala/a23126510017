import { Box, Chip, Typography } from "@mui/material";

const typeColor = {
  placement: "primary",
  result: "success",
  event: "warning",
};

export function NotificationCard({ notification }) {
  const title = notification?.title ?? notification?.Message ?? notification?.message ?? "Notification";
  const type = notification?.type ?? notification?.Type ?? "";
  const createdAt = notification?.createdAt ?? notification?.Timestamp ?? "";
  const read = notification?.read ?? false;

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: read ? "#fff" : "#f0f7ff",
        borderLeft: read ? "4px solid transparent" : "4px solid #1976d2",
        boxShadow: 1,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 0.5 }}>
        <Typography variant="subtitle1" fontWeight={read ? 400 : 700}>
          {title}
        </Typography>

        {type && (
          <Chip
            label={type}
            size="small"
            color={typeColor[type.toLowerCase()] ?? "default"}
            sx={{ textTransform: "capitalize", ml: 1, flexShrink: 0 }}
          />
        )}
      </Box>

      {createdAt && (
        <Typography variant="caption" color="text.disabled" mt={0.5} display="block">
          {new Date(String(createdAt).replace(" ", "T")).toLocaleString()}
        </Typography>
      )}
    </Box>
  );
}
