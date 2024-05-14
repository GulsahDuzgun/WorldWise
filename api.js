import fs from "fs/promises";

async function readDataFromFile() {
  const data = await fs.readFile("./db.json", "utf-8");
  return JSON.parse(data);
}

async function writeDatatoFile(data) {
  await fs.writeFile("./db.json", JSON.stringify(data, null, 2));
}

export const handler = async (event) => {
  if (event.httpMethod === "GET") {
    try {
      const data = await readDataFromFile();
      return {
        statusCode: 200,
        body: JSON.stringify(data),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to process GET request" }),
      };
    }
  } else if (event.httpMethod === "POST") {
    try {
      const requestBody = JSON.parse(event.body);
      let existingData = await readDataFromFile();
      existingData.push(requestBody);

      await writeDatatoFile(existingData);

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "POST request processed successfully",
        }),
      };
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Failed to process POST request" }),
      };
    }
  } else if (event.httpMethod === "DELETE") {
    try {
      const requestBody = JSON.parse(event.body);
      let existingData = await readDataFromFile();
      const indexToDelete = existingData.findIndex(
        (item) => item.id === requestBody.id
      );

      if (indexToDelete === -1) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: "Data not found" }),
        };
      }

      existingData.splice(indexToDelete, 1);
      await writeDatatoFile(existingData);

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "DELETE request processed successfully",
        }),
      };
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Failed to process DELETE request" }),
      };
    }
  }
};
