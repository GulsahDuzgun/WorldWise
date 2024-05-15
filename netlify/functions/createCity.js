import { v4 as uuidv4 } from "uuid";

export const handler = async (event, context, callback) => {
  if (event.httpMethod === "POST") {
    try {
      const parseBody = JSON.parse(event.body);
      const cityList = { ...parseBody, id: uuidv4() };

      callback(null, {
        statusCode: 200,
        body: JSON.stringify(cityList),
      });
    } catch (error) {
      callback(
        new Error({
          statusCode: 500,
          body: JSON.stringify({ error: "City was not created" }),
        })
      );
    }
  }
};
