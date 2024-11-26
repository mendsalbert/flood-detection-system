export async function detectFlood(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  try {
    const response = await fetch(`${apiUrl}/api/detect-flood`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
