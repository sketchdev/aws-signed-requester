const sinon = require('sinon');
const {handler} = require('../index');
const {Readable, Writable} = require('stream');
const https = require('https');
const {expect} = require('chai');

describe('index handler', () => {
  let httpsRequestStub;
  beforeEach(() => {
    httpsRequestStub && httpsRequestStub.restore();
  });
  
  it('fails if the event does not have a url property', (done) => {
    handler({}, {
      fail: (msg) => {
        expect(msg).to.equal('missing url property');
        done();
      }
    });
  });
  
  it('fails if the https request returns with a failure code', (done) => {
    let fakeResponse = buildFakeResponse(401, 'not authorized');
    httpsRequestStub = sinon.stub(https, 'request').callsArgWith(1, fakeResponse).returns(buildFakeRequest());
    handler({url: 'https://some-fake-host.com/blah'}, {
      fail: (msg) => {
        expect(msg).to.equal('not authorized');
        done();
      }
    });
  });
  
  it('succeeds if the https request returns a success code', (done) => {
    let fakeResponse = buildFakeResponse(200);
    httpsRequestStub = sinon.stub(https, 'request').callsArgWith(1, fakeResponse).returns(buildFakeRequest());
    handler({url: 'https://some-fake-host.com/blah'}, {
      succeed: done,
      fail: () => done(new Error('got fail instead of succeed'))
    });
  });
});

function buildFakeResponse(statusCode=200, body='') {
  const res = new Readable();
  res.push(body);
  res.push(null);
  res.statusCode = statusCode;
  res.setEncoding = () => {};
  return res;
}

function buildFakeRequest() {
  return new Writable();
}