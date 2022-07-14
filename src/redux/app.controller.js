const db = require("../models");
const User = db.user;
const Whistle = db.whistle;
const Vote = db.vote;
const Comment = db.comment;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.getFiveWhistles = (req, res) => {
    // current date time
    const currDateTime = new Date();
    User.findOne({
        where: {
            id: req.userId
        }
    })
    .then(user => {
        if (req.body.lastId) {
            Whistle.findAll({
                where: {
                    id: {
                        [Op.lt]: req.body.lastId
                    },
                    author: {
                        [Op.ne]: user.dataValues.username
                    },
                    closeDateTime: {
                        [Op.gt]: currDateTime
                    }
                },
                limit: 5,
                order: [["id", "DESC"]]
            })
            .then(whistles => {
                res.send({ whistles: whistles });
            })
            .catch(err => {
                res.status(500).send({ message: err.message });
            })
        } else {
            Whistle.findAll({
                where: {
                    author: {
                        [Op.ne]: user.dataValues.username
                    },
                    closeDateTime: {
                        [Op.gt]: currDateTime
                    }
                },
                limit: 5,
                order: [["id", "DESC"]]
            })
            .then(whistles => {
                res.send({ whistles: whistles });
            })
            .catch(err => {
                res.status(500).send({ message: err.message });
            })
        } 
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.makeWhistle = (req, res) => {
    User.findOne({
        where: {
            id: req.userId
        }
    })
    .then(user => {
        const anonymous = req.body.anonymous;
        if (anonymous) {
            Whistle.create({
                title: req.body.title,
                background: req.body.background,
                context: req.body.context,
                options: req.body.options,
                closeDateTime: req.body.closeDateTime,
                author: "Anonymous",
            })
            .then(whistle => {
                res.send({ 
                    message: "Whistle was registered successfully!",
                    whistleId: whistle.id 
                });
            })
        } else {
            Whistle.create({
                title: req.body.title,
                background: req.body.background,
                context: req.body.context,
                options: req.body.options,
                closeDateTime: req.body.closeDateTime,
                author: user.username,
            })
            .then(whistle => {
                res.send({ 
                    message: "Whistle was registered successfully!",
                    whistleId: whistle.id 
                });
            })
            .catch(err => {
                res.status(500).send({ message: err.message });
            })
        }
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.getWhistle = (req, res) => {
    Whistle.findOne({
        where: {
            id: req.body.whistleId
        }
    })
    .then(whistle => {
        if (whistle) {
            res.send({ whistle: whistle})
        } else {
            res.status(500).send({ message: "Whistle couldn't be found." });
        }
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    })
}

exports.deleteWhistle = (req, res) => {
    Whistle.findOne({
        where: {
            id: req.body.whistleId
        }
    })
    .then(whistle => {
        if (whistle) {
            User.findOne({
                where: {
                    id: req.userId
                }
            })
            .then(user => {
                if (whistle.author === user.username) {
                    Whistle.destroy({
                        where: {
                            id: req.body.whistleId
                        }
                    })
                    .then(() => {
                        res.send({ message: "Whistle deleted successfully!" });
                    })
                    .catch(err => {
                        res.status(500).send({ message: err.message });
                    })
                } else {
                    res.status(500).send({ message: "Permissions denied for Whistle deletion." });
                }
            })
            .catch(err => {
                res.status(500).send({ message: err.message });
            })
        } else {
            res.status(500).send({ message: "Whistle to delete could not be found." });
        }
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    })
}

exports.voteWhistle = (req, res) => {
    if (req.body.optionSelected) {
        Whistle.findOne({
            where: {
                id: req.body.whistleId
            }
        })
        .then(whistle => {
            if (whistle) {
                const optionSelected = req.body.optionSelected;
                User.findOne({
                    where: {
                        id: req.userId
                    }
                })
                .then(user => {
                    if (whistle.author === user.username) {
                        res.status(500).send({ message: "You can't vote for your own Whistle." });
                    } else {
                        Vote.findOne({
                            where: {
                                voter: user.username,
                                whistle: req.body.whistleId
                            }
                        })
                        .then(vote => {
                            if (vote) {
                                res.status(500).send({ message: "You already voted for this Whistle." });
                            } else {
                                if (whistle.dataValues.options.hasOwnProperty(optionSelected)) {
                                    let options = whistle.dataValues.options;
                                    options[optionSelected] += 1;
                                    Whistle.update({
                                        options: options,
                                    }, {
                                        where: {
                                            id: req.body.whistleId
                                        }
                                    })
                                    .then(() => {
                                        Vote.create({
                                            voter: user.username,
                                            whistle: req.body.whistleId,
                                            option: optionSelected
                                        })
                                        .then(() => {
                                            res.send({ message: "You voted for this Whistle." });
                                        })
                                        .catch(err => {
                                            res.status(500).send({ message: err.message });
                                        });
                                    })
                                    .catch(err => {
                                        res.status(500).send({ message: err.message });
                                    })
                                } else {
                                    res.status(500).send({ message: "Invalid option selected." });
                                }
                            }
                        })
                        .catch(err => {
                            res.status(500).send({ message: err.message });
                        });
                    }
                })
                .catch(err => {
                    res.status(500).send({ message: err.message });
                })
            } else {
                res.status(500).send({ message: "Whistle to vote could not be found." });
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
    } else {
        res.status(500).send({ message: "No option selected." });
    }
}

exports.commentWhistle = (req, res) => {
    Whistle.findOne({
        where: {
            id: req.body.whistleId
        }
    })
    .then(whistle => {
        if (whistle) {
            User.findOne({
                where: {
                    id: req.userId
                }
            })
            .then(user => {
                Comment.create({
                    comment: req.body.comment,
                    associatedSide: req.body.associatedSide,
                    replyingTo: req.body.replyingTo,
                    commenter: user.username,
                    whistle: req.body.whistleId,
                    upvotes: 0,
                    downvotes: 0,
                    votes: 0
                })
                .then(() => {
                    res.send({ message: "Comment added successfully!" });
                })
                .catch(err => {
                    res.status(500).send({ message: err.message });
                });
            })
            .catch(err => {
                res.status(500).send({ message: err.message });
            });
        } else {
            res.status(500).send({ message: "Whistle to comment could not be found." });
        }
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.getReasons = (req, res) => {
    Whistle.findOne({
        where: {
            id: req.body.whistleId
        }
    })
    .then(whistle => {
        if (whistle) {
            const sides = Object.keys(whistle.dataValues.options);
            // get top two comments (by votes) for each side
            let topReasons = {};
            sides.forEach(side => {
                Comment.findAll({
                    where: {
                        associatedSide: side,
                        whistle: req.body.whistleId,
                    },
                    limit: 2,
                    order: [["votes", "DESC"]]    
                })
                .then(comments => {
                    topReasons[side] = comments;
                    if (Object.keys(topReasons).length === sides.length) {
                        res.send(topReasons);
                    }
                })
                .catch(err => {
                    res.status(500).send({ message: err.message });
                });
            });
        } else {
            res.status(500).send({ message: "Whistle to get reasons could not be found." });
        }
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.voteComment = (req, res) => {
    const isUpvote = req.body.isUpvote;
    const commentId = req.body.commentId;
    Comment.findOne({
        where: {
            id: commentId
        }
    })
    .then(comment => {
        if (comment) {
            if (isUpvote) {
                Comment.update({
                    upvotes: comment.dataValues.upvotes + 1,
                    votes: comment.dataValues.votes + 1
                }, {
                    where: {
                        id: commentId
                    }
                })
                .then(() => {
                    res.send({ message: "Comment upvoted successfully!" });
                })
                .catch(err => {
                    res.status(500).send({ message: err.message });
                });
            } else {
                Comment.update({
                    downvotes: comment.dataValues.downvotes + 1,
                    votes: comment.dataValues.votes - 1
                }, {
                    where: {
                        id: commentId
                    }
                })
                .then(() => {
                    res.send({ message: "Comment downvoted successfully!" });
                })
                .catch(err => {
                    res.status(500).send({ message: err.message });
                });
            }
        } else {
            res.status(500).send({ message: "Comment to vote could not be found." });
        }
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.getComments = (req, res) => {
    const whistleId = req.body.whistleId;
    Comment.findAll({
        where: {
            whistle: whistleId
        },
        order: [["votes", "DESC"]]
    })
    .then(comments => {
        res.send(comments);
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
}