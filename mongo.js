const mongoose = require('mongoose');
const process = require('process');

// Check command-line arguments
if (
  process.argv.length < 3 ||
  (process.argv.length > 3 && process.argv.length < 5)
) {
  console.log('Usage: node script.js <password> [name] [number]');
  process.exit(1);
}

// Extract command-line arguments
const [,, password, name, number] = process.argv;

// Define MongoDB connection URL
const url = `mongodb+srv://icecam0001:${password}@fullstack.yvrif.mongodb.net/?retryWrites=true&w=majority&appName=Fullstack`;

// Set up Mongoose and connect to MongoDB
mongoose.set('strictQuery', false);

const personSchema = new mongoose.Schema({
  name: String,
  number: String, // Changed to String to match the original schema
});

const Person = mongoose.model('Person', personSchema);

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB');
    
    // If name and number are provided, add a new person
    if (name && number) {
      const person = new Person({
        name: name,
        number: number,
      });

      return person.save().then(savedPerson => {
        console.log('Added person:', savedPerson);
      });
    } else {
      // Otherwise, list all persons
      return Person.find({}).then(persons => {
        persons.forEach(person => {
          console.log(person);
        });
      });
    }
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message);
  })
  .finally(() => {
    mongoose.connection.close(); // Ensure connection is closed after operations
  });