import { ToggleButton, ToggleButtonGroup } from "@mui/material";

const filters = ["All", "Placement", "Result", "Event"];

export function NotificationFilter({ value, onChange }) {
  function handleChange(event, newValue) {
    if (newValue !== null) {
      onChange(newValue);
    }
  }

  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      size="small"
      onChange={handleChange}
      sx={{ flexWrap: "wrap", gap: 0.5 }}
    >
      {filters.map((type) => (
        <ToggleButton key={type} value={type} sx={{ textTransform: "none", px: 2 }}>
          {type}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}