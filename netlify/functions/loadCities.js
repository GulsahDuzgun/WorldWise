// import jsonData from "../../db.json";

export const handler = function (event, context, callback) {
  const jsonData = [];
  if (event.httpMethod === "GET") {
    try {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(jsonData),
      });
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to process GET request" }),
      };
    }
  }
};
