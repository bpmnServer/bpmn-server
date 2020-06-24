//During the test the env variable is set to test
process.env.NODE_ENV = 'test';


//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
//let server = require('../../app.js');
let url = 'localhost:3000';
let should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('Books', () => {
    /*
      * Test the /GET route
      */
    describe(`/GET book`, () => {

        it('it should GET all the books', (done) => {
            chai.request(url)
                .get('/api/definitions/list')
                .end((err, res) => {
                    console.log(res.body);
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.not.eql(0);
                    done();
                });
        });

        it('it should GET all the books', (done) => {
            chai.request(url)
                .get('/api/definitions/load/Buy Used Car')
                .end((err, res) => {
                    console.log(res.body);
                    res.should.have.status(200);
                    let elements = res.body.elements;
                    elements.should.be.a('array');

                    done();
                });
        });



    });

});