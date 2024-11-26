import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Forward the request to the Python backend
    const pythonBackendResponse = await fetch(
      "https://flood-detection-system-backend.onrender.com/api/detect-flood",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!pythonBackendResponse.ok) {
      throw new Error(
        `Python backend responded with status: ${pythonBackendResponse.status}`
      );
    }

    const data = await pythonBackendResponse.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in analyze route:", error);
    return NextResponse.json(
      { error: "Failed to analyze image" },
      { status: 500 }
    );
  }
}
