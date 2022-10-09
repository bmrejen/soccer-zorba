export async function checkVictory(userPosition, goalPosition) {
  try {

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/distance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        lat: userPosition.lat,
        lng: userPosition.lng,
        goalLat: goalPosition.lat,
        goalLng: goalPosition.lng
    })
  });
  const { distance } = await res.json();
  if (distance <= 0.03) {
    return alert("GOAAAAAAAAL!");
  }
  } catch (error) {
    console.error(error);
  }
}