import fetch from "/app/node_modules/node-fetch/src/index.js";
import pgPromise from "pg-promise";

// Connection parameters
const connectionConfig = {
  user: "jose",
  password: "jose123",
  host: "192.168.254.10",
  port: 5432,
  database: "github_db",
};

// Create an instance of pg-promise
const pgp = pgPromise();
const db = pgp(connectionConfig);

// Search a user and store in the DB
async function fetchAndStoreUserInfo(username, location) {
  if (!username) {
    return;
  }

  try {
    const response = await fetch(`https://api.github.com/users/${username}`);

    if (response.status === 404) {
      console.log(`User '${username}' not found.`);
      return;
    }

    const user = await response.json();

    if (!user.name && !user.location) {
      console.log(`User '${username}' has null name and location. Skipping.`);
      return;
    }

    // Fetch user's repositories
    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos`,
    );
    const repos = await reposResponse.json();

    // Extract programming languages from repositories
    const languages = repos
      .map((repo) => repo.language)
      .filter((language) => language !== null);
    const query = `
      INSERT INTO users (name, location, languages)
      VALUES ($1, $2, $3)
      ON CONFLICT ON CONSTRAINT unique_name DO NOTHING
    `;
    const values = [user.name, location || user.location, languages];

    const result = await db.none(query, values);
    if (result === null) {
      console.log(`User '${username}' information stored successfully..`);
    } else {
      console.log(`User '${username}' already added.`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Display users by location
async function fetchAndDisplayUsersByLocation(location) {
  try {
    const query = `
      SELECT * FROM users
      WHERE lower(location) LIKE lower('%$1:value%')
    `;
    const result = await db.any(query, location);

    if (result.length === 0) {
      console.log(`No users found in location: ${location}`);
      return;
    }

    console.log(`Users in location: ${location}`);
    result.forEach((user) => {
      console.log(`- Name: ${user.name}, Location: ${user.location}`);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

// Display all users
async function fetchAndDisplayAllUsers() {
  try {
    const query = `
      SELECT * FROM users
      ORDER BY id DESC
    `;
    const result = await db.any(query);

    if (result.length === 0) {
      console.log("No users found.");
      return;
    }

    console.log("All users:");
    result.forEach((user) => {
      const languages = user.languages;
      const mostUsedLanguage = getMostUsedLanguage(languages);
      const secondMostUsedLanguage = getSecondMostUsedLanguage(languages);
      console.log(`- Name: ${user.name}, Location: ${user.location}`);
      console.log(`  Most Used Language: ${mostUsedLanguage}`);
      console.log(`  Second Most Used Language: ${secondMostUsedLanguage}`);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

// Get the most used programming language
function getMostUsedLanguage(languages) {
  const languageCount = {};
  languages.forEach((language) => {
    languageCount[language] = (languageCount[language] || 0) + 1;
  });
  const sortedLanguages = Object.keys(languageCount).sort(
    (a, b) => languageCount[b] - languageCount[a],
  );
  return sortedLanguages[0];
}

// Get the second most used programming language
function getSecondMostUsedLanguage(languages) {
  const languageCount = {};
  languages.forEach((language) => {
    languageCount[language] = (languageCount[language] || 0) + 1;
  });
  const sortedLanguages = Object.keys(languageCount).sort(
    (a, b) => languageCount[b] - languageCount[a],
  );
  return sortedLanguages[1];
}

// Display users by programming language
async function fetchAndDisplayUsersByProgrammingLanguage(programmingLanguage) {
  try {
    const query = `
      SELECT * FROM users
      WHERE lower(languages::text) LIKE lower('%$1:value%')
    `;

    const result = await db.any(query, programmingLanguage);

    if (result.length === 0) {
      console.log(`
		No users found using the programming language: ${programmingLanguage},
		    `);
      return;
    }

    console.log(`Users using the programming language: ${programmingLanguage}`);
    result.forEach((user) => {
      console.log(`- Name: ${user.name}, Location: ${user.location}`);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

// The main function
async function runApp() {
  try {
    const username = process.argv[2];
    const location = process.argv[3];
    const programmingLanguageFlagIndex = process.argv.indexOf("-pl");
    const programmingLanguage =
      programmingLanguageFlagIndex !== -1
        ? process.argv[programmingLanguageFlagIndex + 1]
        : null;
    // Check if --all argument is passed
    const allUsers = process.argv.includes("--all");
    if (!username && !allUsers) {
      console.log(
        "Please provide a username or use --all to display all users",
      );
      return;
    }

    if (username && username !== "--all") {
      if (username === "-l") {
        if (location) {
          // Display users by location
          await fetchAndDisplayUsersByLocation(location);
        } else {
          console.log("Please add a location");
        }
      } else if (username === "-pl") {
        if (programmingLanguage) {
          // Display users by programming language
          await fetchAndDisplayUsersByProgrammingLanguage(programmingLanguage);
        } else {
          console.log("Please insert a programming language");
        }
      } else {
        await fetchAndStoreUserInfo(username, location); // Store user info
      }
    } else if (allUsers) {
      await fetchAndDisplayAllUsers(); // Display all users
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    pgp.end();
  }
}

//call the  main function
runApp();
