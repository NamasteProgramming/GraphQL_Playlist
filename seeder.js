const mongoose = require('mongoose')
const faker = require('faker')
const { User, Address } = require('./schema')

mongoose.connect('mongodb://localhost:27017/graphql', {
    useNewUrlParser: true,
});

for (let i = 0; i < 10; i++) {
    const user = new User({
        name: faker.name.findName(),
        email: faker.internet.email()
    })

    user.save()
    .then(userRef => {
        console.log(`${userRef.name} saved successfully`);
        const address = new Address({
            user: user._id,
            city: faker.address.city(),
            country: faker.address.country()
        })

        address.save()
        .then(addressRef => {
            console.log(`${userRef.name} lives in ${addressRef.city}`)
            userRef.address = addressRef._id
            userRef.save().then(_ => _)
        })
    })
}