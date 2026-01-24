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

export default function TrainingHistorySection({
  trainingHistory,
  expandedIndex,
  onToggle,
}) {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" gutterBottom>
          История тренировок
        </Typography>

        {trainingHistory.length === 0 ? (
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            Ого, похоже твоя история тренировок пустая...
          </Typography>
        ) : (
          <List disablePadding>
            {trainingHistory.map((training, idx) => (
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
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Typography
                      sx={{
                        fontSize: "1.4rem",
                        color: training.completed
                          ? "success.main"
                          : "error.main",
                      }}
                    >
                      {training.completed ? "✔️" : "❌"}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={500}>
                      Тренировка от {training.trainingDate}
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
                  <Box sx={{ px: 2, pb: 2, pt: 1, bgcolor: "action.hover" }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
                      Упражнения:
                    </Typography>

                    <List disablePadding>
                      {training.exercises.map((ex, i) => (
                        <ListItem key={i} disablePadding sx={{ py: 0.5 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              width: "100%",
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="body2">{ex.name}</Typography>

                            {ex.sets && ex.repetitions && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {ex.sets} × {ex.repetitions}
                              </Typography>
                            )}
                          </Box>
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
