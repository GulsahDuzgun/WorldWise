import data from "../../db.json";

export const handler = async function (event, context, callback) {
  const id = event.queryStringParameters.id;
  console.log(id);

  if (event.httpMethod === "GET") {
    try {
      const cityData = [...data.cities].find((city) => city.id === id);

      callback(null, {
        body: JSON.stringify(cityData),
        statusCode: 200,
      });
    } catch (error) {
      callback(new Error("City detail was not fetched"));
    }
  }
};

export const config = {
  path: "/.netlify/functions/getCity/:id",
};
