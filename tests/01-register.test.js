const axios = require('axios');
const {API_URL, API_VERSION} = require('../config');
const {Users, sequelize} = require('../db/models');
const {expect} = require('chai');

axios.defaults.baseURL = `${API_URL}/${API_VERSION}`;

describe('Register Module Test', function() {
  before(async function() {
    try {
      await sequelize.sync({force: true}); // drop and create User tables.
    } catch (error) {
      console.error(error);
    }
  });
  describe('Request Body Test', function() {
    describe('Teacher Field Test', function() {
      it('Http 400 Bad Request: Provide null/empty value in teacher field.', async function() {
        try {
          const {status, message} = await axios.post('/register', {
            teacher: null,
            students: ['studentjon@example.com', 'studenthon@example.com'],
          });
        } catch (error) {
          expect(error).to.have.property('response');

          const {response} = error;
          expect(response).to.have.property('status');
          expect(response).to.have.property('data');

          const {status, data} = response;
          expect(status).to.equal(400);
          expect(data)
            .to.have.property('message')
            .to.equal('Please provide teacher email');
        }
      });
      it('Http 400 Bad Request: Provide different data type in teacher field.', async function() {
        try {
          const {status, message} = await axios.post('/register', {
            teacher: 101,
            students: ['studentjon@example.com', 'studenthon@example.com'],
          });
        } catch (error) {
          expect(error).to.have.property('response');

          const {response} = error;
          expect(response).to.have.property('status');
          expect(response).to.have.property('data');

          const {status, data} = response;
          expect(status).to.equal(400);
          expect(data)
            .to.have.property('message')
            .to.equal('teacher field only support String data type.');
        }
      });
      it('Http 400 Bad Request: Provide invalid email in teacher field.', async function() {
        try {
          const {status, message} = await axios.post('/register', {
            teacher: 'notAnEmailAddress',
            students: ['studentjon@example.com', 'studenthon@example.com'],
          });
        } catch (error) {
          expect(error).to.have.property('response');

          const {response} = error;
          expect(response).to.have.property('status');
          expect(response).to.have.property('data');

          const {status, data} = response;
          expect(status).to.equal(400);
          expect(data)
            .to.have.property('message')
            .to.equal('Please provide valid teacher email');
        }
      });
    });
    describe('Students Field Test', function() {
      it('Http 400 Bad Request: Provide null/empty value in students field.', async function() {
        try {
          const {status, message} = await axios.post('/register', {
            teacher: 'teacherken@gmail.com',
            students: null,
          });
        } catch (error) {
          expect(error).to.have.property('response');

          const {response} = error;
          expect(response).to.have.property('status');
          expect(response).to.have.property('data');

          const {status, data} = response;
          expect(status).to.equal(400);
          expect(data)
            .to.have.property('message')
            .to.equal('Please provide student email(s)');
        }
      });
      it('Http 400 Bad Request: Provide different data type in students field.', async function() {
        try {
          const {status, message} = await axios.post('/register', {
            teacher: 'teacherken@gmail.com',
            students: 'studenthon@example.com',
          });
        } catch (error) {
          expect(error).to.have.property('response');

          const {response} = error;
          expect(response).to.have.property('status');
          expect(response).to.have.property('data');

          const {status, data} = response;
          expect(status).to.equal(400);
          expect(data)
            .to.have.property('message')
            .to.equal('students field only support Array data structure.');
        }
      });
      it('Http 400 Bad Request: Provide invalid email in students field.', async function() {
        try {
          const {status, message} = await axios.post('/register', {
            teacher: 'teacherken@gmail.com',
            students: ['notAnEmailAddress'],
          });
        } catch (error) {
          expect(error).to.have.property('response');

          const {response} = error;
          expect(response).to.have.property('status');
          expect(response).to.have.property('data');

          const {status, data} = response;
          expect(status).to.equal(400);
          expect(data)
            .to.have.property('message')
            .to.equal('Please provide valid student email(s)');
        }
      });
    });
  });
  describe('Registration Test', function() {
    it('Http 204 No Content: Register and students if not exist, and students are registered by the teacher.', async function() {
      try {
        const response = await axios.post('/register', {
          teacher: 'teacherken@gmail.com',
          students: ['studentjon@example.com', 'studenthon@example.com'],
        });
        expect(response).to.have.property('status');
        expect(response.status).to.equal(204);
      } catch (error) {
        console.error(error);
      }
    });
  });
});
