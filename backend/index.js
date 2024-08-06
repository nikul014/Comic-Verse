import express from 'express';
import { createPool } from 'mysql2/promise';
import serverless from 'serverless-http';
import cors from 'cors';
import AWS from 'aws-sdk';

const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'username'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());


const db = createPool({
    host: 'blog-sphere-db.cnzdci0btcku.us-east-1.rds.amazonaws.com',
    user: 'kenil',
    password: 'Kenil@7566',
    database: 'blog_sphere'
});

// Configure AWS SDK
AWS.config.update({ region: 'us-east-1' });
const sns = new AWS.SNS({ apiVersion: '2008-10-17' });
const snsTopicArn = 'arn:aws:sns:us-east-1:086987906940:NewBlogNotification';

// Function to subscribe a user to the SNS topic
const subscribeToSNSTopic = async (email) => {
    const params = {
        Protocol: 'email',
        TopicArn: snsTopicArn,
        Endpoint: email
    };
    return sns.subscribe(params).promise();
};

// Function to publish a message to the SNS topic
const publishToSNS = async (message, subject) => {
    const params = {
        Message: message,
        Subject: subject,
        TopicArn: snsTopicArn,
    };
    return sns.publish(params).promise();
};

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    try {
        const [results] = await db.query(query, [username, password]);
        if (results.length > 0) {
            res.status(200).send('Login successful !!!');
        } else {
            res.status(401).send('Invalid username or password');
        }
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).send('Error logging in');
    }
});


app.post('/reg', async (req, res) => {
    console.log("Inside reg");
    const { username, email, password } = req.body;
    console.log("req.body:", req.body);

    if (!username || !email || !password) {
        console.error('Missing required fields');
        return res.status(400).send('Missing required fields');
    }

    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    try {
        const [result] = await db.query(query, [username, email, password]);
        console.log('User registered successfully:', result);

        // Subscribe the user to the SNS topic
        await subscribeToSNSTopic(email);
        console.log('Subscription email sent to:', email);

        res.status(201).send('User registered successfully');
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).send('Error registering user');
    }
});



const authenticateUser = async (username) => {
    const query = 'SELECT user_id FROM users WHERE username = ?';
    const [results] = await db.query(query, [username]);
    if (results.length > 0) {
        return results[0].user_id;
    }
    return null;
};

app.post('/add-blog', async (req, res) => {
    const { title, description, category } = req.body;
    const { username } = req.headers;

    console.log('Received request to add blog with:', { title, description, category });
    console.log('Authenticating user with:', { username });

    try {
        const user_id = await authenticateUser(username);
        if (user_id) {
            console.log('User authenticated with ID:', user_id);
            const query = 'INSERT INTO blogs (title, user_id, date, description, category) VALUES (?, ?, NOW(), ?, ?)';
            const [result] = await db.query(query, [title, user_id, description, category]);
            console.log('Blog added successfully:', result);
            res.status(201).send('Blog added successfully');
        } else {
            console.log('Invalid username');
            res.status(401).send('Invalid username');
        }
    } catch (err) {
        console.error('Error adding blog:', err.message);
        res.status(500).send('Error adding blog');
    }
});


app.get('/blogs', async (req, res) => {
    const query =
        `SELECT b.blog_id, b.title, u.username, b.date, b.category
        FROM blogs b
        JOIN users u ON b.user_id = u.user_id
        ORDER BY b.date DESC`;
    try {
        const [blogs] = await db.query(query);
        res.status(200).json(blogs);
    } catch (err) {
        console.error('Error retrieving blogs:', err);
        res.status(500).send('Error retrieving blogs');
    }
});


// Get details of a specific blog by blog_id from query string
app.get('/get-blog-by-id', async (req, res) => {
    const { blog_id } = req.query;
    const query = `
        SELECT b.blog_id ,b.title, u.username, b.date, b.category, b.description
        FROM blogs b
        JOIN users u ON b.user_id = u.user_id
        WHERE b.blog_id = ?
    `;
    try {
        const [blogs] = await db.query(query, [blog_id]);
        if (blogs.length > 0) {
            res.status(200).json(blogs[0]);
        } else {
            res.status(404).send('Blog not found');
        }
    } catch (err) {
        console.error('Error retrieving blog:', err);
        res.status(500).send('Error retrieving blog');
    }
});




app.get('/search-blogs', async (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).send('Search query is required');
    }

    const searchQuery = `%${query}%`;
    const sqlQuery = `
        SELECT b.blog_id, b.title, u.username, b.date, b.description, b.category
        FROM blogs b
        JOIN users u ON b.user_id = u.user_id
        WHERE b.title LIKE ? OR u.username LIKE ? OR b.description LIKE ?
        ORDER BY b.date DESC
    `;

    try {
        const [blogs] = await db.query(sqlQuery, [searchQuery, searchQuery, searchQuery]);
        res.status(200).json(blogs);
    } catch (err) {
        console.error('Error searching blogs:', err);
        res.status(500).send('Error searching blogs');
    }
});

app.get('/filter-blogs', async (req, res) => {
    const { category } = req.query;
    if (!category) {
        return res.status(400).send('Category is required');
    }

    const query = `
        SELECT b.blog_id, b.title, b.date, b.description, b.category, u.username
        FROM blogs b
        JOIN users u ON b.user_id = u.user_id
        WHERE b.category = ?
    `;

    try {
        const [blogs] = await db.query(query, [category]);
        res.status(200).json(blogs);
    } catch (err) {
        console.error('Error filtering blogs:', err);
        res.status(500).send('Error filtering blogs');
    }
});


app.post('/save-blog', async (req, res) => {
    const { blog_id } = req.body;
    const { username } = req.headers;

    try {
        const user_id = await authenticateUser(username);
        if (!user_id) {
            return res.status(401).send('Invalid username');
        }

        // Check if the blog is already saved by the user
        const checkQuery = 'SELECT * FROM saved_blogs WHERE user_id = ? AND blog_id = ?';
        const [existingEntry] = await db.query(checkQuery, [user_id, blog_id]);

        if (existingEntry.length > 0) {
            // Blog is already saved
            return res.status(409).send('Blog already saved');
        }

        // Save the blog if it is not already saved
        const query = 'INSERT INTO saved_blogs (user_id, blog_id) VALUES (?, ?)';
        await db.query(query, [user_id, blog_id]);
        res.status(201).send('Blog saved successfully');
    } catch (err) {
        console.error('Error saving blog:', err);
        res.status(500).send('Error saving blog');
    }
});


app.get('/saved-blogs', async (req, res) => {
    const { username } = req.headers;

    try {
        const user_id = await authenticateUser(username);
        if (user_id) {
            const query = `
                SELECT b.blog_id, b.title, u.username, b.date, b.description, b.category
                FROM blogs b
                JOIN saved_blogs sb ON b.blog_id = sb.blog_id
                JOIN users u ON b.user_id = u.user_id
                WHERE sb.user_id = ?
                ORDER BY b.date DESC
            `;
            const [savedBlogs] = await db.query(query, [user_id]);
            res.status(200).json(savedBlogs);
        } else {
            res.status(401).send('Invalid username');
        }
    } catch (err) {
        console.error('Error retrieving saved blogs:', err);
        res.status(500).send('Error retrieving saved blogs');
    }
});


app.delete('/remove-saved-blog', async (req, res) => {
    const { blog_id } = req.body;
    const { username } = req.headers;

    try {
        const user_id = await authenticateUser(username);
        if (user_id) {
            // Check if - blog is saved
            const checkQuery = 'SELECT * FROM saved_blogs WHERE user_id = ? AND blog_id = ?';
            const [checkResult] = await db.query(checkQuery, [user_id, blog_id]);

            if (checkResult.length === 0) {
                return res.status(404).send('Blog not found in saved list for the user');
            }

            // Remove if -saved
            const deleteQuery = 'DELETE FROM saved_blogs WHERE user_id = ? AND blog_id = ?';
            const [result] = await db.query(deleteQuery, [user_id, blog_id]);
            res.status(200).send('Blog removed from saved list successfully');
        } else {
            res.status(401).send('Invalid username');
        }
    } catch (err) {
        console.error('Error removing saved blog:', err);
        res.status(500).send('Error removing saved blog');
    }
});



export const handler = serverless(app);
