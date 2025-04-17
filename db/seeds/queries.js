const db = require("../connection")

// Get all of the users
const allUsers = () => {
    return db.query('SELECT DISTINCT username FROM users')
        .then(results => {
            console.log(results.rows);
        });
};

allUsers();

// Get all of the articles where the topic is coding

const articlesTopicCoding = () => {
    return db.query('SELECT * FROM articles WHERE topic = $1', ['coding'])
        .then(result => {
            console.log(result.rows);
        });
};

articlesTopicCoding();

// Get all of the comments where the votes are less than zero

const commentsZerVotes = () => {
    return db.query('SELECT * FROM comments WHERE votes = $1', [0])
        .then(result => {
            console.log(result.rows);
        });
};

commentsZerVotes();

// Get all of the topics

const getAllTopics = () => {
    return db.query('SELECT DISTINCT slug FROM topics UNION SELECT DISTINCT topic FROM articles')
        .then(result => {
            console.log(result.rows);
        });
};

getAllTopics();


// Get all of the articles by user grumpy19

const articlesByUser = () => {
    return db.query('SELECT * FROM articles WHERE author = $1', ['grumpy19'])
        .then(result => {
            console.log(result.rows);
        });
};

articlesByUser();


// Get all of the comments that have more than 10 votes

const commentsByVotes = () => {
    return db.query('SELECT * FROM comments WHERE votes > 10')
        .then(result => {
            console.log(result.rows);
        });
};

commentsByVotes();