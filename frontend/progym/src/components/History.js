import React from "react";
import { Box, Typography } from "@mui/material";

const History = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        История тренировок и питания
      </Typography>
      <Typography variant="body1">
        Здесь будет отображаться история ваших тренировок и питания.
      </Typography>
      {/* Логика отображения истории тренировок и питания */}
    </Box>
  );
};

export default History;
