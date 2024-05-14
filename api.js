import data from "./db.json";
import fs from "fs";

function readDataFromFile() {
  const data = fs.readFile("./db.json");
  return JSON.parse(data);
}

function writeDatatoFile() {
  fs.writeFileSync("./db.json", JSON.stringify(data, null, 2));
}

const handler = async (event) => {
  if (event.httpMethod === "GET") {
    try {
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
      let existingData = readDataFromFile();
      existingData.push(requestBody);

      writeDatatoFile(existingData);

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "POST request processed successfully",
        }),
      };
    } catch (error) {
      // Return an error response if there was an issue processing the request
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Failed to process POST request" }),
      };
    }
  } else if (event.httpMethod === "DELETE") {
    const requestBody = JSON.parse(event.body);

    let existingData = readDataFromFile();
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
    writeDatatoFile(existingData);
  }
};

export default handler;
