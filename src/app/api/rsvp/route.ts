import { NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data");
const RSVP_FILE = join(DATA_DIR, "rsvp-responses.json");

interface RSVPData {
  firstName: string;
  lastName: string;
  email: string;
  attending: string;
  guests: string;
  dietary: string;
  message: string;
  accommodation: string;
  accommodationGroup?: string;
  songSuggestion?: string;
  days?: string[];
}

export async function POST(request: Request) {
  try {
    const data: RSVPData = await request.json();

    // Basic validation
    if (!data.firstName || !data.lastName || !data.email || !data.attending) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants" },
        { status: 400 }
      );
    }

    // Ensure data directory exists
    await mkdir(DATA_DIR, { recursive: true });

    // Read existing responses
    let responses: (RSVPData & { submittedAt: string })[] = [];
    try {
      const existing = await readFile(RSVP_FILE, "utf-8");
      responses = JSON.parse(existing);
    } catch {
      // File doesn't exist yet, start fresh
    }

    // Add new response with timestamp
    responses.push({
      ...data,
      submittedAt: new Date().toISOString(),
    });

    // Write back
    await writeFile(RSVP_FILE, JSON.stringify(responses, null, 2), "utf-8");

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const data = await readFile(RSVP_FILE, "utf-8");
    const responses = JSON.parse(data);
    return NextResponse.json(responses);
  } catch {
    return NextResponse.json([]);
  }
}
