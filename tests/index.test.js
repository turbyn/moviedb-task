const expect = require('expect');
const request = require('supertest')

const {app} = require('./../src/index.js');
const {Movie} = require('./../src/models/Movie.js')
const {Comment} = require('./../src/models/Comment.js')
const {getDummyMovies, getDummyComments} = require('./testData.js')
const dummyMovies = getDummyMovies()
const dummyComments = getDummyComments()

const delay = () => {
  return new Promise((resolve,reject) => {
    setTimeout(()=>{resolve()},500);
  })
}

beforeEach(async () => {
await Movie.deleteMany({});
await Movie.insertMany(dummyMovies)
// await delay()
await Comment.deleteMany({})
await Comment.insertMany(dummyComments)
// await delay()
})

// beforeEach((done) => {
//   Comment.deleteMany({}).then(() => {
//     return Comment.insertMany(dummyComments)
//   })
// })



describe('POST /movies', () => {
  it('should create a new movie', (done) => {

    let exampleRequest = {
      'title':'monty python'
    }
    let id;

    request(app)
    .post('/movies')
    .send(exampleRequest)
    .expect(200)
    .expect((res) => {
      expect(res.body.data.Response).toBe("True");
      expect(res.body.queryTitle).toBe(exampleRequest.title);
      expect(res.body._id).toBeA('string');
      expect(res.body._id.length).toBe(24);
      id = res.body._id;
    })
    .end((err,res) => {
      if(err) {
        return done(err)
      }

      Movie.find( {_id : id} ).then((movies) => {
        expect(movies.length).toBe(1);
        expect(movies[0].queryTitle).toBe(exampleRequest.title);
        done()
      }).catch((e) => {
        return done(e)
      })
    })


  })

  it('should reject invalid request', (done) => {
    const invalidRequestOne = {
      'testowosc':'abc'
    }

    const invalidRequestTwo = {
      'title' : ''
    }

    request(app)
    .post('/movies')
    .send(invalidRequestOne)
    .expect(400)
    .end((err, res) => {
      if(err){
        return done(err)
      }
    })

    request(app)
    .post('/movies')
    .send(invalidRequestTwo)
    .expect(400)
    .end((err,res) => {
      if(err){return done(err)}
      done()
    })

  })
});

describe('POST /comments', () => {
  it('should create a new comment', (done) => {
    let commentRequest = {
	   "content" : "new django movie comment",
	   "movieId" : "tt0060315"
    }
    let commentDbId;

    request(app)
    .post('/comments')
    .send(commentRequest)
    .expect(200)
    .expect((res) => {
      expect(res.body._id.length).toBe(24)
      commentDbId=res.body._id
    })
    .end((err,res) => {
      if(err){return done(err)}


      Comment.find( {_id : commentDbId} ).then((comments) => {
        expect(comments.length).toBe(1)
        done()
      }).catch((e) => {
        return done(e)
      })
    })
  })

  it('should not create a new comment if no movie with id is present', (done) => {

    let commentRequest = {
     "content" : "new django movie comment",
     "movieId" : "asdadasdadsdsadasd"
    }

    request(app)
    .post('/comments')
    .send(commentRequest)
    .expect(400)
    .end(() => {
      return done()
    })

  })
})


describe('GET /movies', () => {
  it('should get all movies', (done) => {
    request(app)
    .get('/movies')
    .expect(200)
    .expect((res) => {
      expect(res.body.result.length).toBe(4);
    })
    .end(done)
  })
})

describe('GET /comments', () => {
  it('should get all comments', (done) => {
    request(app)
    .get('/comments')
    .expect(200)
    .expect((res) => {
      expect(res.body.result.length).toBe(4)
    })
    .end(done)
  })

  it('should get comments for specific id', (done) => {
    request(app)
    .get('/comments?id=tt0060315')
    .expect(200)
    .expect((res) => {
      expect(res.body.result.length).toBe(1);
    })
    .end(done);
  })

  it('should return empty array if no comments or no movie found', (done) => {
    request(app)
    .get('/comments?id=abcd')
    .expect(200)
    .expect((res) => {
      expect(res.body.result.length).toBe(0)
    })
    .end(done);
  })
})
