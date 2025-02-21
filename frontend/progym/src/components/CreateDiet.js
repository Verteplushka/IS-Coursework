import React, { useState } from "react";

const Header = () => {
  return (
    <header>
      <h1>Добавление нового блюда</h1>
    </header>
  );
};

const AddMealForm = () => {
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [fats, setFats] = useState("");
  const [carbs, setCarbs] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const mealData = {
      name,
      calories: parseFloat(calories),
      protein: parseFloat(protein),
      fats: parseFloat(fats),
      carbs: parseFloat(carbs),
    };

    try {
      const response = await fetch("http://localhost:8080/api/admin/add_meal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mealData),
      });

      if (!response.ok) {
        throw new Error("Ошибка при добавлении блюда");
      }

      alert("Блюдо успешно добавлено!");
      // Очистка формы
      setName("");
      setCalories("");
      setProtein("");
      setFats("");
      setCarbs("");
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Не удалось добавить блюдо");
    }
  };

  return (
    <div>
      <Header />
      <form onSubmit={handleSubmit}>
        <div>
          <label>Название блюда:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Калории:</label>
          <input
            type="number"
            step="0.1"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Белки:</label>
          <input
            type="number"
            step="0.1"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Жиры:</label>
          <input
            type="number"
            step="0.1"
            value={fats}
            onChange={(e) => setFats(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Углеводы:</label>
          <input
            type="number"
            step="0.1"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
            required
          />
        </div>
        <button type="submit">Добавить блюдо</button>
      </form>
    </div>
  );
};

export default AddMealForm;
