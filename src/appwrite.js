import { Client, Databases, ID, Query, Account } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

const client = new Client()
  .setEndpoint("https://nyc.cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);

// **********************
const account = new Account(client);

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
  //   console.log(PROJECT_ID, DATABASE_ID, COLLECTION_ID);

  //1. USE APPWRITE  SDK TO  CHECK IF THE SEARCH TERM EXISTS IN THE DATABASE
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", searchTerm),
    ]);

    //2. IF  IT DOES, UPDATE THE COUNT
    if (result.documents.length > 0) {
      const doc = result.documents[0];

      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: doc.count + 1,
      });

      //3. IF IT DOESN'T, CREATE A NEW DOCUMENT  WITH THE  SEARCH  TERM  AND COUNT AS 1
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

export const getTrendingMovies = async () => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(15),
      Query.orderDesc("count"),
    ]);

    return result.documents;
  } catch (error) {
    console.error(error);
  }
};
