const express = require("express");
const bodyParser = require("body-parser");
const turf = require("@turf/turf");
const cors = require("cors");

const { point, distance, destination } = turf;
const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = 3000;
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/goal", (req, res) => {
  const userPoint = point([req.body.lng, req.body.lat]);
  const goalPoint = generateGoalPoint(req.body);
  const distanceFromUser = distance(userPoint, goalPoint);
  res.send({ goal: goalPoint, distanceFromUser });
});

app.post("/distance", (req, res) => {
  const userPoint = point([req.body.lng, req.body.lat]);
  const goalPoint = point([req.body.goalLng, req.body.goalLat]);
  const distanceFromUser = distance(userPoint, goalPoint);
  res.send({ distance: distanceFromUser });
});

app.listen(PORT, () => {
  console.log("Example app listening on port 3000!");
});

function generateGoalPoint({ lat, lng }) {
  const distanceFromPoint = 1;
  const bearing = generateRandomBearing();
  const userPoint = point([lat, lng]);
  const goalPoint = destination(userPoint, distanceFromPoint, bearing);
  return goalPoint;
}

function generateRandomBearing() {
  return Math.floor(Math.random() * 360) - 180;
}
