const { spec } = require('pactum');

const apiUrl = 'https://gorest.co.in/public/v2/users';
const token = '53f7796adb98bd41ab18a63f9cab292bd915b7cfc8dec41ef3e588dfad39a2d3'

module.exports = {
  postUser: async function (userData, expectedStatus = 201) {
    const response = await spec()
      .post(apiUrl)
      .withHeaders({
        'Authorization': `Bearer ${token}`,
      })
      .withJson(userData)
      .expectStatus(expectedStatus);
  
      const responseBody = response.json;
      return responseBody;
  },
  putUser: async function(userData, userId, expectedStatus = 200){
    const response = await spec()
    .put(`${apiUrl}/${userId}`)
    .withHeaders({
      'Authorization': `Bearer ${token}`,
    })
    .withBody(userData)
    .expectStatus(expectedStatus)

    const responseBody = response.json;
    return responseBody;
  },
  patchUser: async function(userData, userId, expectedStatus = 200){
    const response = await spec()
    .put(`${apiUrl}/${userId}`)
    .withHeaders({
      'Authorization': `Bearer ${token}`,
    })
    .withBody(userData)
    .expectStatus(expectedStatus)

    const responseBody = response.json;
    return responseBody;
  },
  getUser: async function(userId, expectedStatus = 200){
    const response = await spec()
    .get(`${apiUrl}/${userId}`).withHeaders({
      'Authorization': `Bearer ${token}`,
    })
    .expectStatus(expectedStatus)

    const responseBody = response.json;
    return responseBody;
  },
  getAllUsers: async function(expectedStatus = 200, page = undefined, perPage = undefined){
    let request;
    if (page !== undefined && perPage !== undefined) {
      request = spec().get(`${apiUrl}?page=${page}&per_page=${perPage}`).expectStatus(expectedStatus);
    } else {
      request = spec().get(apiUrl).expectStatus(expectedStatus);
    }
  
    const response = await request.toss();
    const responseBody = response.json;
    return responseBody;
  },
  deleteUser: async function(userId, expectedStatus = 204){
    await spec()
    .delete(`${apiUrl}/${userId}`)
    .withHeaders({
      'Authorization': `Bearer ${token}`,
    }).expectStatus(expectedStatus)
  },
  apiUrl: apiUrl,
  token: token
};
