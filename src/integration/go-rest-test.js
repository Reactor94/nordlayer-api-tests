const assert = require('assert');
const { getMockUser } = require('../utils/mock-data');
const each = require('mocha-each');
const { getUser, postUser, putUser, deleteUser, patchUser, getAllUsers } = require('../utils/api');
const { faker } = require('@faker-js/faker');

describe('API Users tests', () => {

  let postUserCreate;
  const expectedProperties = ["id", "name", "email", "gender", "status"];

  beforeEach(() => {
    postUserCreate = getMockUser()
  })

  describe('POST /users', () => {
    it('should create user', async () => {
      const user = await postUser(postUserCreate)
      const updatedPostUserCreate = { ...postUserCreate, id: user.id }

      expectedProperties.forEach(property => {
        assert.equal(user[property], updatedPostUserCreate[property], `${property} should match the value in updatedPostUserCreate`);
      });
    });

    it('should not create user with already existing email', async () => {
      await postUser(postUserCreate)
      const errorResponse = await postUser(postUserCreate, 422)

      assert.deepEqual(errorResponse[0], {
        field: 'email',
        message: 'has already been taken'
      });
    });

    it('should not create user with empty body', async () => {
      const expectedErrors = [
        { field: 'email', message: "can't be blank" },
        { field: 'name', message: "can't be blank" },
        { field: 'gender', message: "can't be blank, can be male of female" },
        { field: 'status', message: "can't be blank" }
      ];
      const emptyBodyUser = await postUser({ }, 422)
      assert.deepStrictEqual(emptyBodyUser, expectedErrors);
    });

    it('should not create user with invalid email', async () => {
      const invalidEmailUser = await postUser({...postUserCreate, email: "invalid" }, 422)
    
      assert.deepEqual(invalidEmailUser[0], {
        field: 'email',
        message: 'is invalid'
      });
    });

    each([
      ['email', "can't be blank"],
      ['name', "can't be blank"],
      ['gender', "can't be blank, can be male of female"],
      ['status', "can't be blank"]
    ]).it('should not create user when %s is missing', async (mandatoryField, errorMessage) => {
      const postData = { ...postUserCreate };
      delete postData[mandatoryField];
      const errorResponse = await postUser(postData, 422);
  
      assert.deepStrictEqual(errorResponse[0], {
        field: mandatoryField,
        message: errorMessage
      });
    });
  })

  describe('GET /users/:id', () => {

    it('should get created user', async () => {
      const user = await postUser(postUserCreate, 201)
      const userGet = await getUser(user.id, 200)
      const updatedPostUserCreate = { ...postUserCreate, id: user.id }

      expectedProperties.forEach(property => {
        assert.equal(userGet[property], updatedPostUserCreate[property], `${property} should match the value in updatedPostUserCreate`);
      });
    })

    it('should return an error response for non existing user', async () => {
      const nonExistingUserId = faker.number.int()
      const userGet = await getUser(nonExistingUserId, 404)

      assert.deepEqual(userGet, { message: 'Resource not found' });
    })

  })

  describe('GET /users', () => {
    it('should get all users', async () => {
      const users = await getAllUsers()

      expectedProperties.forEach((property, index) => {
        assert(property in users[index], `${property} should exist in the response`);
        assert(users[index][property], `${property} should have a non-empty value`);
      });
    })

    it('should get proper amount of users per pagination', async () => {
      const page = 1
      const perPage = 3
      const users = await getAllUsers(200, page, perPage)

      assert.equal(users.length, perPage, `Expected ${perPage} users per page`);
    })
  })

  describe('PUT /users/:id', () => {
    it('should update created user with PUT method', async () => {
      const user = await postUser(postUserCreate)
      const updateUser = await putUser({ ...postUserCreate, status: "inactive", name: "Vitalii Pylypets" }, user.id)

      assert.equal(updateUser.status, "inactive", "User status should be 'inactive' after update");
    });

  })

  describe('PATCH /users/:id', () => {
    it('should update created user with PATCH method', async () => {
      const user = await postUser(postUserCreate)
      const updateUser = await patchUser({ name: "Vitalii Pylypets" }, user.id)

      assert.equal(updateUser.name, "Vitalii Pylypets", "User name should be 'Vitalii Pylypets' after update");
    });

  })

  describe('DELETE /users/:id', () => {
    it('should delete created user', async () => {
      const user = await postUser(postUserCreate)
      await deleteUser(user.id, 204)
      const userGet = await getUser(user.id, 404)

      assert.deepEqual(userGet, { message: 'Resource not found' });
    })
  })
})