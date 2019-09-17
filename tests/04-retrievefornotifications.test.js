const axios = require('axios');
const {API_URL, API_VERSION} = require('../config');
const {Users, sequelize} = require('../db/models');
const {expect} = require('chai');

axios.defaults.baseURL = `${API_URL}/${API_VERSION}`;

describe('Retrieve For Notification Module Test', function() {
  before(async function() {
    try {
      await sequelize.sync({force: true}); // drop and create User tables.
      // create 2 teachers and with 2 common students
      await axios.post('/register', {
        teacher: 'teacherken@gmail.com',
        students: [
          'non_tagged_student@gmail.com',
          'non_tagged_suspended_student@gmail.com',
          'tagged_student1@gmail.com',
        ],
      });
      await axios.post('/register', {
        teacher: 'teacherjoe@example.com',
        students: [
          'tagged_student2@gmail.com',
          'tagged_suspended_student2@gmail.com',
        ],
      });
      await axios.post('/suspend', {
        student: 'non_tagged_suspended_student@gmail.com',
      });
      await axios.post('/suspend', {
        student: 'tagged_suspended_student2@gmail.com',
      });
    } catch (error) {
      console.error(error);
    }
  });
  describe('Request Body Test', function() {
    describe('Teacher Field Test', function() {
      it('400 Bad Request: Provide null/empty value in teacher field.', async function() {
        try {
          await axios.post('/retrievefornotifications', {
            teacher: null,
            notification: 'Hello everyone!',
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
      it('400 Bad Request: Provide different data type in teacher field.', async function() {
        try {
          await axios.post('/retrievefornotifications', {
            teacher: 101,
            notification: 'Hello everyone!',
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
      it('400 Bad Request: Provide invalid email in teacher field.', async function() {
        try {
          await axios.post('/retrievefornotifications', {
            teacher: 'invalidEmailAddress',
            notification: 'Hello everyone!',
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
      it('400 Bad Request: Provide non-exist email in teacher field.', async function() {
        try {
          await axios.post('/retrievefornotifications', {
            teacher: 'nonExistEmailAddress@example.com',
            notification: 'Hello everyone!',
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
            .to.equal('Please ensure the provided teacher email is exist.');
        }
      });
    });
    describe('Notification Field Test', function() {
      it('400 Bad Request: Provide null/empty value in notification field.', async function() {
        try {
          await axios.post('/retrievefornotifications', {
            teacher: 'teacherken@gmail.com',
            notification: null,
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
            .to.equal('Please provide student notification');
        }
      });
      it('400 Bad Request: Provide different data type in notification field.', async function() {
        try {
          await axios.post('/retrievefornotifications', {
            teacher: 'teacherken@gmail.com',
            notification: 101,
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
            .to.equal('notification field only support String data type.');
        }
      });
    });
  });
  describe('Retrieve For Notfication Test', function() {
    it('200 Ok: Return students that are registered by the teacher, except suspended student.', async function() {
      try {
        const response = await axios.post('/retrievefornotifications', {
          teacher: 'teacherken@gmail.com',
          notification: 'Hello world!',
        });
        expect(response).to.have.property('status');
        expect(response).to.have.property('data');

        const {status, data} = response;
        expect(response.status).to.equal(200);
        expect(data)
          .to.have.property('students')
          .with.lengthOf(2);
      } catch (error) {
        console.error(error);
      }
    });
    it('200 Ok: Return students that are tagged with "@" and registered by the teacher, except suspended student.', async function() {
      try {
        const response = await axios.post('/retrievefornotifications', {
          teacher: 'teacherken@gmail.com',
          notification:
            'Hello students! @tagged_student1@gmail.com @tagged_student2@gmail.com @tagged_suspended_student2@gmail.com',
        });
        expect(response).to.have.property('status');
        expect(response).to.have.property('data');

        const {status, data} = response;
        expect(response.status).to.equal(200);
        expect(data)
          .to.have.property('students')
          .with.lengthOf(3);
      } catch (error) {
        console.error(error);
      }
    });
  });
});
