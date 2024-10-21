export async function runGeneticAlgorithm() {
  const response = await fetch("/api/genetic-algorithm", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
}