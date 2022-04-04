db.createUser(
  {
      user: "simone",
      pwd: "rootroot",
      roles: [
          {
              role: "readWrite",
              db: "my_db"
          }
      ]
  }
);
db.createCollection("test"); //MongoDB creates the database when you first store data in that database
