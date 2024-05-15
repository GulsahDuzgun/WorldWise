import data from "../../db.json";

export const handler = function (event, context, callback) {
  const { id } = event.queryStringParameters.id;
  if (event.httpMethod === "DELETE") {
    try {
      const cityList = data.cities.filter((city) => city.id !== id);

      callback(null, { statusCode: 200, body: JSON.stringify(cityList) });
    } catch (error) {
      callback(new Error("City was not deleted"));
    }
  }
};

export const config = {
  path: "/.netlify/functions/deleteCity/:id",
};
