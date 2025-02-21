import { useState } from "react";
import { 
  Container, TextField, Select, MenuItem, FormControl, 
  InputLabel, Checkbox, FormControlLabel, Button, Typography, 
  Alert, Box
} from "@mui/material";
import axios from "axios";
import AdminHeader from "./AdminHeader";

const CreateExercise = () => {
  const [formData, setFormData] = useState({
    name: "",
    muscleGroup: "CHEST",
    сompound: false,
    description: "",
    executionInstructions: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Ошибка: отсутствует токен аутентификации");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/admin/add_exercise",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setMessage("Упражнение успешно создано");
      setFormData({
        name: "",
        muscleGroup: "CHEST",
        сompound: false,
        description: "",
        executionInstructions: "",
      });
    } catch (err) {
      setError("Ошибка при создании упражнения");
      console.error("Ошибка при создании упражнения", err);
    }
  };

  return (
    <>
    <AdminHeader />
    <Container maxWidth="sm" sx={{ mt: 4, p: 3, bgcolor: "#f5f5f5", borderRadius: 2, boxShadow: 3 }}>
       
      <Typography variant="h4" gutterBottom textAlign="center">Создание упражнения</Typography>
      {message && <Alert severity="success">{message}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Название упражнения"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
        />
        <FormControl fullWidth>
          <InputLabel>Группа мышц</InputLabel>
          <Select
            name="muscleGroup"
            value={formData.muscleGroup}
            onChange={handleChange}
          >
            {["CHEST", "BACK", "SHOULDERS", "BICEPS", "TRICEPS", "LEGS", "CORE", "GLUTES", "FOREARMS", "CARDIO"].map((group) => (
              <MenuItem key={group} value={group}>{group}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControlLabel
          control={<Checkbox checked={formData.сompound} onChange={handleChange} name="сompound" />}
          label="Сложное упражнение (Compound)"
        />
        <TextField
          label="Описание"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          required
        />
        <TextField
          label="Инструкции по выполнению"
          name="executionInstructions"
          value={formData.executionInstructions}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Создать упражнение
        </Button>
      </Box>
    </Container>
    </>
  );
};

export default CreateExercise;