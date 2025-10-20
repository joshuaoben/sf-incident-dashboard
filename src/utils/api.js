const API_URL = "https://data.sfgov.org/resource/gnap-fj3t.json";

export const fetchIncidents = async () => {
  try {
    const response = await fetch(`${API_URL}?$limit=5000`);
    if (!response.ok) throw new Error("Failed to fetch data");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching incidents:", error);
    throw error;
  }
};
