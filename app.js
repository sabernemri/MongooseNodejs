const mongoose= require("mongoose"); 
require("dotenv").config(); 




mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Failed to connect to MongoDB:', err));
const express = require('express');
const app = express();
const port = 7000;
const path = require('path');

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number
    },
    favoriteFoods: {
        type: [String] 
    }
});
const Person = mongoose.model('Person', personSchema);

const peopleData = [
    { name: 'John Doe', age: 30, favoriteFoods: ['pizza', 'sushi'] },
    { name: 'Jane Smith', age: 25, favoriteFoods: ['pasta', 'burger'] },
    { name: 'Alice Johnson', age: 40, favoriteFoods: ['salad', 'fish'] },
    { name: 'Bob Brown', age: 35, favoriteFoods: ['steak', 'chicken'] }
  ];
  Person.create(peopleData)
  .then((people) => {
    console.log('People successfully inserted:', people);
  })
  .catch((err) => {
    console.error('Error inserting people:', err);
  });


  
  const personId = '6750bb2423b02530b5053ece'; 
  Person.findById(personId)
  .then(person => {
    if (person) {
      console.log('Person found:', person);
    } else {
      console.log('No person found with the given _id');
    }
  })
  .catch(err => {
    console.error('Error finding person by _id:', err);
  });


  const updatePersonAge = async (personName) => {
    try {
      const updatedPerson = await Person.findOneAndUpdate(
        { name: personName }, 
        { age: 20 },           
        { new: true }         
      );
  
      if (updatedPerson) {
        console.log('Person successfully updated:', updatedPerson);
      } else {
        console.log(`No person found with the name: ${personName}`);
      }
    } catch (err) {
      console.error('Error updating person:', err);
    }
  };

  
  updatePersonAge('John Doe');

  const deletePersonById = (personId) => {
    Person.findByIdAndDelete(personId)
      .then(deletedPerson => {
        if (deletedPerson) {
          console.log('Deleted person:', deletedPerson);
        } else {
          console.log(`No person found with the id: ${personId}`);
        }
      })
      .catch(err => console.error('Error deleting person:', err));
  };
  
  deletePersonById('6751f6d3f1d2df36214464f8'); 
  
  const deletePeopleByName = (name) => {
    Person.deleteMany({ name: name }, (err, result) => {
      if (err) {
        console.error('Error deleting people:', err);
      } else {
        console.log(`Deleted ${result.deletedCount} document(s):`, result);
      }
    });
  };
  
  // Exemple d'appel
  deletePeopleByName('Mary');
  

  const findPeopleWhoLoveBurritos = (done) => {
    Person.find({ favoriteFoods: 'burritos' }) 
      .sort({ name: 1 })                     
      .limit(2)                               
      .select('-age')                      
      .exec((err, data) => {                  
        if (err) {
          return done(err);                   
        }
        done(null, data);                     
      });
  };
  
  findPeopleWhoLoveBurritos((err, data) => {
    if (err) {
      console.error('Error finding people:', err);
    } else {
      console.log('People who love burritos:', data);
    }
  });
  



  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
