const { faker } = require('@faker-js/faker');

module.exports.getMockUser = () => ({
    email: `email_${faker.internet.email()}`,
    name: faker.internet.userName(),
    gender: 'male',
    status: 'active',
});