import url from "url";

export const getRoomName = (URL) => {
  const parts = url.parse(URL, true);
  const query = parts.query;
  return query[roomBasedOn()];
};

export const roomBasedOn = () => {
  // Can be changed to dynamically alter the query being used as basis of room name.
  return "assetId";
};
