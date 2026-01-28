import React from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  IconButton,
  Box,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

export default function DietHistorySection({
  dietHistory,
  expandedIndex,
  onToggle,
}) {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" gutterBottom>
          История диет
        </Typography>

        {dietHistory.length === 0 ? (
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            Ого, похоже твоя история диет пустая...
          </Typography>
        ) : (
          <List disablePadding>
            {dietHistory.map((diet, idx) => (
              <ListItem
                key={idx}
                disablePadding
                sx={{
                  mb: 1.5,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  overflow: "hidden",
                  bgcolor: "background.paper",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" fontWeight={500}>
                      {diet.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(diet.dietDate).toLocaleDateString("ru-RU")}
                    </Typography>
                  </Box>

                  <IconButton
                    size="small"
                    onClick={() => onToggle(idx)}
                    sx={{ color: "text.secondary" }}
                  >
                    {expandedIndex === idx ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>

                {expandedIndex === idx && (
                  <Box sx={{ px: 2, pb: 2.5, pt: 1, bgcolor: "action.hover" }}>
                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}
                    >
                      <Typography variant="body2">
                        <strong>Калории:</strong> {Math.round(diet.calories)}{" "}
                        ккал
                      </Typography>
                      <Typography variant="body2">
                        <strong>Б:</strong> {Math.round(diet.protein)} г
                      </Typography>
                      <Typography variant="body2">
                        <strong>Ж:</strong> {Math.round(diet.fats)} г
                      </Typography>
                      <Typography variant="body2">
                        <strong>У:</strong> {Math.round(diet.carbs)} г
                      </Typography>
                    </Box>

                    <Typography variant="subtitle2" gutterBottom>
                      Блюда:
                    </Typography>

                    <List disablePadding>
                      {diet.meals.map((meal, i) => (
                        <ListItem key={i} disablePadding sx={{ py: 0.5 }}>
                          <Typography variant="body2">
                            {meal.name} — {Math.round(meal.calories)} ккал
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
