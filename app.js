/* jshint esversion: 6 */

const express = require('express');
const bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4')
const app = express();

const jsonParser = bodyParser.json();

let postArray = [];

for(let i = 0; i < 10; i++)
{
    const post = {id: uuidv4(),
        title: "The Golden Banana",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel mi at turpis scelerisque posuere. In a turpis in lectus maximus hendrerit. Nunc in blandit lorem. Integer felis enim, placerat quis erat eu, congue varius est. Donec dolor sapien, consectetur nec justo et, dignissim interdum augue. Maecenas ultricies est id ante mattis pulvinar sed vel neque. Vestibulum ullamcorper libero id finibus convallis. Mauris porta nisl et neque efficitur, a vestibulum quam cursus. ",
        author: `King Julian the ${i}`,
        publishDate: "24-03-2019"};

    postArray.push(post);
}

app.get('/blog-posts', (req, res) => {
    res.status(200).json({
        message : "Successfully sent the list of posts",
        status : 200,
        posts : postArray
    });
});

app.get('/blog-posts/:author', (req, res) => {

    if (!('author' in req.params)){
        res.status(406).json({
            message : "Parameter not passed correctly",
            status : 406
        }).send("Finish");
    }

    let postAuthor = req.params.author;

    postArray.forEach(item => {
        if (item.author == postAuthor){
            res.status(200).json({
                message : "Successfully sent the post",
                status : 200,
                post : item
            });
        }
    });

    res.status(404).json({
        message : "Author not found in the list",
        status : 404
    });
});

app.post('/blog-posts', jsonParser, (req, res, next) => {

    let requiredFields = ['title', 'content', 'author', 'publishDate'];

    for ( let i = 0; i < requiredFields.length; i ++){
        let currentField = requiredFields[i];

        if (! (currentField in req.body)){
            res.status(406).json({
                message : `Missing field ${currentField} in body.`,
                status : 406
            }).send("Finish");
        }
    }

    let objectToAdd = {
        id: uuidv4(),
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        publishDate: req.body.publishDate
    };

    postArray.push(objectToAdd);
    res.status(201).json({
        message : "Successfully added the post",
        status : 201,
        post : objectToAdd
    });
});


app.delete( '/blog-posts/', jsonParser, (req, res, next) => {
    res.status(406).json({
        message : "Send id to delete as parameter",
        status : 406
    });
});

app.delete( '/blog-posts/:id', jsonParser, (req, res, next) => {

    resAlreadySent = false;

    let postId = "postId Error";

    if (!('id' in req.params)){
        res.status(406).json({
            message : "Parameter not passed correctly",
            status : 406
        }).send("Finish");
    }
    if (!('id' in req.body)){
        res.status(406).json({
            message : `Missing field id in body.`,
            status : 406
        }).send("Finish");
    }
    if (req.params.id == req.body.id)
        postId = req.params.id;
    else
        res.status(406).json({
            message : `ID passed in body must match id passed in path vars`,
            status : 406
        }).send("Finish");

    postArray.forEach(function(item, index, object) {
        if ( postId == item.id ){

            postArray.splice(index,1);

            res.status(204).json({
                message : `Post with id:${postId} deleted.`,
                status : 204,
                post: item
            });
            resAlreadySent = true;
        }
    });


    if (!resAlreadySent)
        res.status(400).json({
            message : `Post id not found.`,
            status : 400
        });
});

app.put( '/blog-posts/:id', jsonParser, (req, res, next) => {

    resAlreadySent = false;

    if (!('id' in req.params)){
        res.status(406).json({
            message : "Parameter not passed correctly",
            status : 406
        }).send("Finish");
    }

    let postId = req.params.id;

    postArray.forEach(item => {
        if ( postId == item.id ){

            if('title' in req.body)
                item.title = req.body.title;
            if('content' in req.body)
                item.content = req.body.content;
            if('author' in req.body)
                item.author = req.body.author;
            if('publishDate' in req.body)
                item.publishDate = req.body.publishDate;

            res.status(200).json({
                message : `Post successfully updated.`,
                status : 200,
                post: item
            });
            resAlreadySent = true;
        }
    });

    if (!resAlreadySent)
        res.status(400).json({
            message : `Post id not found.`,
            status : 400
        });
});

app.listen(8080, () => {
    console.log('Your app is running in port 8080');
});