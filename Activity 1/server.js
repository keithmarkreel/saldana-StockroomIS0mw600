const express = require("express");
const app = express();
const PORT = 3000;

const foodStuff = [
  {
    id: 1,
    food: "Hotdog",
    price: "113",
  },
  {
    id: 2,
    food: "Roasted Chicken Hamburger",
    price: "99",
  },
  {
    id: 3,
    food: "Chicken Sandwich",
    price: "55",
  },
];

// Retrieve all food items
app.get("/api/foodStuff", (req, res) => {
  res.json(foodStuff);
});

// Retrieve one food item by id
app.get("/api/foodStuff/:id", (req, res) => {
  const id = Number(req.params.id);
  const item = foodStuff.find((food) => food.id === id);

  if (!item) {
    return res.status(404).json({
      message: "Food Missing",
    });
  }

  res.json(item);
});

app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});



