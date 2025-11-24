/**
 *
 * Idempotent Methods: The ones whose 1st calling or Nth calling does not change the output on frontend or backend.
 * Examples: GET, PUT, DELETE, OPTIONS and HEAD
 * Non-Idempotent Methods: The ones whose 1st calling and 2nd calling changes the output on frontend or backend.
 * Examples: POST and PATCH
 *
 * Response Codes:
 * 200 = OK
 * 201 = Content Created
 * 204 = No Content
 * GET = 200
 * POST = 201
 * PUT = 200, 201, 204
 * PATCH = 200, 204
 * DELETE = 204
 */

async function api(URL, config = {}) {
  try {
    const readableStream = await fetch(URL, config);
    if (!readableStream.ok) {
      throw new Error("Response from backend not ok", readableStream.status);
    }
    const data = await readableStream.json();
    console.log("data obtained from backend", data);
    return data;
  } catch (error) {
    console.log(error);
  }
}

api("https://dummyjson.com/products/1");
api("https://dummyjson.com/products/add", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    title: "BMW Pencil",
  }),
});
api("https://dummyjson.com/products/1", {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    title: "iPhone Galaxy +2",
  }),
});
