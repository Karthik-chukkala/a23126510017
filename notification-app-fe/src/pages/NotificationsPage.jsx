import { useState } from "react";
import {
  Alert,
  Badge,
  Box,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { NotificationCard } from "../components/NotificationCard";
import { NotificationFilter } from "../components/NotificationFilter";
import { useNotifications } from "../hooks/useNotifications";

const ITEMS_PER_PAGE = 10;

const typePriority = {
  placement: 3,
  result: 2,
  event: 1,
};

function getNotificationType(notification) {
  return String(notification?.Type ?? notification?.type ?? "").toLowerCase();
}

function getNotificationTime(notification) {
  const rawTime = notification?.Timestamp ?? notification?.createdAt ?? "";
  const parsedTime = Date.parse(String(rawTime).replace(" ", "T"));

  return Number.isNaN(parsedTime) ? 0 : parsedTime;
}

function sortByPriority(list) {
  return [...list].sort((first, second) => {
    const firstType = getNotificationType(first);
    const secondType = getNotificationType(second);

    const typeDiff = (typePriority[secondType] ?? 0) - (typePriority[firstType] ?? 0);
    if (typeDiff !== 0) {
      return typeDiff;
    }

    return getNotificationTime(second) - getNotificationTime(first);
  });
}

export function NotificationsPage() {
  const [filter, setFilter] = useState("All");

  const { notifications, unreadCount, loading, error } = useNotifications();

  const filteredNotifications = notifications.filter((notification) => {
    const type = getNotificationType(notification);

    if (filter === "All") {
      return true;
    }

    return type.toLowerCase() === filter.toLowerCase();
  });

  const priorityNotifications = sortByPriority(filteredNotifications).slice(0, ITEMS_PER_PAGE);

  function handleFilterChange(newFilter) {
    setFilter(newFilter);
  }

  return (
    <Box sx={{ maxWidth: 720, mx: "auto", px: 2, py: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <Badge badgeContent={unreadCount} color="primary" max={99}>
          <NotificationsIcon sx={{ fontSize: 28 }} />
        </Badge>
        <Typography variant="h5" fontWeight={700}>
          Top 10 Priority Notifications
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ marginBottom: 3 }}>
        <NotificationFilter value={filter} onChange={handleFilterChange} />
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error">Could not load notifications: {error}</Alert>
      )}

      {!loading && !error && filteredNotifications.length === 0 && (
        <Alert severity="info">No notifications found.</Alert>
      )}

      {!loading && !error && priorityNotifications.length > 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {priorityNotifications.map((n) => (
            <NotificationCard key={n.ID ?? n.id} notification={n} />
          ))}
        </Box>
      )}

    </Box>
  );
}
