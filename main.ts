import { existsSync } from "https://deno.land/std/fs/mod.ts";

const jsonDir = "./JSON/";
const mediaDir = "./Photos/";

// Revised function to find a media file path by jsonData.id
function getMediaFilePath(jsonData: any): string | null {
  let matchedFiles = [];
  for (const file of Deno.readDirSync(mediaDir)) {
    if (file.name.includes(jsonData.id)) {
      matchedFiles.push(`${mediaDir}${file.name}`);
    }
  }

  if (matchedFiles.length === 1) {
    return matchedFiles[0];
  } else if (matchedFiles.length > 1) {
    console.warn(
      `Warning: Multiple files found for JSON ID ${jsonData.id}. No modifications will be made.`,
    );
  } else {
    console.log(`No files found for JSON ID ${jsonData.id}.`);
  }
  return null;
}

// Utility function to format date for touch command
function formatDateForTouch(dateString: string): string {
  const date = new Date(dateString);
  // Format to [[CC]YY]MMDDhhmm[.SS]
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${year}${month}${day}${hours}${minutes}.${seconds}`;
}

// Function to update media file metadata using touch
async function updateMediaMetadata(
  filePath: string,
  dateTaken: string,
) {
  const dateTakenFormatted = formatDateForTouch(dateTaken);

  // Update the creation date (Not directly possible with touch, so this updates the modification time)
  const touchCreation = Deno.run({
    cmd: ["touch", "-mt", dateTakenFormatted, filePath],
  });
  await touchCreation.status();

  // Update the modification date
  const touchModification = Deno.run({
    cmd: ["touch", "-t", dateTakenFormatted, filePath],
  });
  await touchModification.status();
}

// Main function to iterate over JSON files and update corresponding media files
async function main() {
  let counter = 0;
  for (const dirEntry of Deno.readDirSync(jsonDir)) {
    if (dirEntry.isFile && dirEntry.name.endsWith(".json")) {
      const jsonFilePath = `${jsonDir}${dirEntry.name}`;
      const jsonData = JSON.parse(await Deno.readTextFile(jsonFilePath));
      const mediaFilePath = getMediaFilePath(jsonData);

      if (mediaFilePath) {
        await updateMediaMetadata(
          mediaFilePath,
          jsonData.date_taken,
        );
        console.log(`Updated ${mediaFilePath} ${counter++}`);
      }
    }
  }
}

await main();
