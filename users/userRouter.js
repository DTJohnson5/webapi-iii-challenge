const express = require("express");

const router = express.Router();
const Users = require("./userDb");
const Create = require("../posts/postDb");

router.get("/", (req, res) => {
    Users.get(req.query)
    .then(users => {
      res.status(200).json({message: "Here is the list of LOTR characters.", users});
    })
    .catch(err => {
      res.status(500).json({error: "There was an error retrieving the requested users."});
    });
});

router.get("/:id", validateUserId, (req, res) => {
    Users.getById(req.params.id)
    .then(user => {
      res.status(200).json({accepted: "Here is the user you requested.", user});
    })
    .catch(err => {
      res.status(500).json({error: "There was an error retrieving that user."});
    });
});

router.get("/:id/posts", validateUserId, (req, res) => {
    Users.getUserPosts(req.params.id)
    .then(posts => {
      res.status(201).json({accepted: "Here are the posts of the user you requested.", posts});
    })
    .catch(err => {
      res.status(500).json({message: "Error getting user's posts."});
    });
});

router.post('/', validateUser, (req, res) => {
    Users.insert(req.body)
    .then(user => {
        res.status(201).json({acceptance: "The user was successfully added."});
    })
    .catch(err => {
        res.status(500).json({error: "There was an error adding this user."});
    });
});

router.post("/:id/posts", [validateUserId, validatePost], (req, res) => {
    Create.insert(req.body)
    .then(post => {
      res.status(201).json({success: "The post was successfully added.", post});
    })
    .catch(err => {
      res.status(500).json({error: "There was an error adding this post."});
    });
});

router.put('/:id', [validateUser, validateUserId], (req, res) => {
    const id = req.params.id;
    const changes = req.body;
    Users
      .update(id, changes)
      .then(post => {
        res.status(201).json({success: "This user was successfully updated.", post});
      })
      .catch(err => {
        res.status(500).json({error: "There was an error editing this user."});
      });
});

router.delete('/:id', validateUserId, (req, res) => {
    Users
    .remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({success: "This user was successfully deleted."});
      } else {
        res.status(404).json({error: "That user no longer exists."});
      }
    })
    .catch(err => {
      res.status(500).json({error: "There was an error deleting this user."});
    });
});

//custom middleware

function validateUserId(req, res, next) {
    const id = req.params.id;

    Users.getById(id)
      .then(user => {
        if (user) {
          next();
        } else {
          res.status(404).json({ error: "There is no user with that ID." });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({error: "There was an error processing your request."});
      });
};

function validateUser(req, res, next) {
    if (req.body && Object.keys(req.body).length > 0) {
        next();
      } else {
        next({error: "The request you made was substandard."});
      }
};

function validatePost(req, res, next) {
    if (req.body && Object.keys(req.body).length > 0) {
        next();
      } else {
        next({error: "The request you made was substandard."});
      }
};

module.exports = router;
