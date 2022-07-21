import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Pressable , ScrollView, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useSelector } from 'react-redux';
import { selectAccessToken } from '../redux/slices/authSlice';
import FlipCard from 'react-native-flip-card';
import PollBar from './PollBar';
import axios from 'axios';
import Modal from 'react-native-modal';
import { ChevronUp, ChevronDown, X } from 'react-native-feather';

const WhistleDisplay = (props) => {
    const whistle = props.whistle;
    const isOwner = props.isOwner;
    const navigation = props.navigation;

    const jwtToken = useSelector(selectAccessToken);
    const [backside, setBackside] = React.useState(false);
    const [currentDateTime, setCurrentDateTime] = React.useState(new Date());
    const [hasVoted, setHasVoted] = React.useState(false);
    const [topReasons, setTopReasons] = React.useState([]);
    const [keyboardOffset, setKeyboardOffset] = React.useState(0);
    const [replyingTo1, setReplyingTo1] = React.useState(null);
    const [replyingTo2, setReplyingTo2] = React.useState(null);

    const onKeyboardShow = event => setKeyboardOffset(event.endCoordinates.height);
    const onKeyboardHide = () => {
        setKeyboardOffset(0)
        setReplyingTo1(null)
        setReplyingTo2(null)
    };
    const keyboardDidShowListener = React.useRef();
    const keyboardDidHideListener = React.useRef();
    const replyingInputRef1 = React.useRef();
    const replyingInputRef2 = React.useRef();

    React.useEffect(() => {
        keyboardDidShowListener.current = Keyboard.addListener('keyboardWillShow', onKeyboardShow);
        keyboardDidHideListener.current = Keyboard.addListener('keyboardWillHide', onKeyboardHide);
        return () => {
            keyboardDidShowListener.current.remove();
            keyboardDidHideListener.current.remove();
        }
    }, []);

    React.useEffect(() => {
        if (replyingTo1) {
            replyingInputRef1.current.focus()
        }
    }, [replyingTo1]);

    React.useEffect(() => {
        if (replyingTo2) {
            replyingInputRef2.current.focus()
        }
    }, [replyingTo2]);

    const [isComment1Visible, setIsComment1Visible] = React.useState(false);
    const [scrollOffset1, setScrollOffset1] = React.useState(null);
    const [comments1, setComments1] = React.useState([]);
    const [upvotes1, updateUpvotes1] = React.useState([]);
    const [downvotes1, updateDownvotes1] = React.useState([]);
    const [comment1Text, updateComment1Text] = React.useState("");
    const [comment1Tree, updateComment1Tree] = React.useState({});

    const [isComment2Visible, setIsComment2Visible] = React.useState(false);
    const [scrollOffset2, setScrollOffset2] = React.useState(null);
    const [comments2, setComments2] = React.useState([]);
    const [upvotes2, updateUpvotes2] = React.useState([]);
    const [downvotes2, updateDownvotes2] = React.useState([]);
    const [comment2Text, updateComment2Text] = React.useState("");
    const [comment2Tree, updateComment2Tree] = React.useState({});

    const commentModal1Ref = React.createRef();
    const close1 = () => {
        setIsComment1Visible(false);
    }

    const commentModal2Ref = React.createRef();
    const close2 = () => {
        setIsComment2Visible(false);
    }
    
    const handleScrollTo1 = p => {
        if (commentModal1Ref.current) {
            commentModal1Ref.current.scrollTo(p);
        }
    }

    const handleScrollTo2 = p => {
        if (commentModal2Ref.current) {
            commentModal2Ref.current.scrollTo(p);
        }
    }

    const handleOnScroll1 = event => {
        setScrollOffset1(event.nativeEvent.contentOffset.y);
    }

    const handleOnScroll2 = event => {
        setScrollOffset2(event.nativeEvent.contentOffset.y);
    }

    function handleVoteComment1(commentId, index, action) {
        axios.post("https://trywhistle.app/api/app/votecomment", {
            commentId: commentId,
            action: action
        }, {
            headers: {
                'x-access-token': jwtToken
            }
        })
        .then(resp => {
            switch (action) {
                case "upvote":
                    updateUpvotes1((upvotes) => {
                        return [...upvotes.slice(0, index), true, ...upvotes.slice(index + 1)]
                    });
                    setComments1((comments) => {
                        let newEle = comments[index]
                        newEle.upvotes += 1;
                        newEle.votes += 1;
                        return [...comments.slice(0, index), newEle, ...comments.slice(index + 1)]
                    })
                    break;
                case "downvote":
                    updateDownvotes1((downvotes) => {
                        return [...downvotes.slice(0, index), true, ...downvotes.slice(index + 1)]
                    });
                    setComments1((comments) => {
                        let newEle = comments[index]
                        newEle.downvotes += 1;
                        newEle.votes -= 1;
                        return [...comments.slice(0, index), newEle, ...comments.slice(index + 1)]
                    });
                    break;
                case "unupvote":
                    updateUpvotes1((upvotes) => {
                        return [...upvotes.slice(0, index), false, ...upvotes.slice(index + 1)]
                    });
                    setComments1((comments) => {
                        let newEle = comments[index]
                        newEle.upvotes -= 1;
                        newEle.votes -= 1;
                        return [...comments.slice(0, index), newEle, ...comments.slice(index + 1)]
                    });
                    break;
                case "undownvote":
                    updateDownvotes1((downvotes) => {
                        return [...downvotes.slice(0, index), false, ...downvotes.slice(index + 1)]
                    });
                    setComments1((comments) => {
                        let newEle = comments[index]
                        newEle.downvotes -= 1;
                        newEle.votes += 1;
                        return [...comments.slice(0, index), newEle, ...comments.slice(index + 1)]
                    });
                    break;
                default:
                    break;
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    function handleVoteComment2(commentId, index, action) {
        axios.post("https://trywhistle.app/api/app/votecomment", {
            commentId: commentId,
            action: action
        }, {
            headers: {
                'x-access-token': jwtToken
            }
        })
        .then(resp => {
            switch (action) {
                case "upvote":
                    updateUpvotes2((upvotes) => {
                        return [...upvotes.slice(0, index), true, ...upvotes.slice(index + 1)]
                    });
                    setComments2((comments) => {
                        let newEle = comments[index]
                        newEle.upvotes += 1;
                        newEle.votes += 1;
                        return [...comments.slice(0, index), newEle, ...comments.slice(index + 1)]
                    })
                    break;
                case "downvote":
                    updateDownvotes2((downvotes) => {
                        return [...downvotes.slice(0, index), true, ...downvotes.slice(index + 1)]
                    });
                    setComments2((comments) => {
                        let newEle = comments[index]
                        newEle.downvotes += 1;
                        newEle.votes -= 1;
                        return [...comments.slice(0, index), newEle, ...comments.slice(index + 1)]
                    });
                    break;
                case "unupvote":
                    updateUpvotes2((upvotes) => {
                        return [...upvotes.slice(0, index), false, ...upvotes.slice(index + 1)]
                    });
                    setComments2((comments) => {
                        let newEle = comments[index]
                        newEle.upvotes -= 1;
                        newEle.votes -= 1;
                        return [...comments.slice(0, index), newEle, ...comments.slice(index + 1)]
                    });
                    break;
                case "undownvote":
                    updateDownvotes2((downvotes) => {
                        return [...downvotes.slice(0, index), false, ...downvotes.slice(index + 1)]
                    });
                    setComments2((comments) => {
                        let newEle = comments[index]
                        newEle.downvotes -= 1;
                        newEle.votes += 1;
                        return [...comments.slice(0, index), newEle, ...comments.slice(index + 1)]
                    });
                    break;
                default:
                    break;
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    function submitComment1(replyId=null) {
        axios.post("https://trywhistle.app/api/app/commentwhistle", {
            whistleId: whistle.id,
            comment: comment1Text,
            associatedSide: keys[0],
            replyingTo: replyId,
        }, {
            headers: {
                'x-access-token': jwtToken
            }
        })
        .then(resp => {
            setComments1((comments) => {
                return [...comments, resp.data.comment]
            })
            updateComment1Text("");
            if (replyId) {
                updateComment1Tree(tree => {
                    if (tree[replyId]) {
                        tree[replyId].push(resp.data.comment.id)
                    } else {
                        tree[replyId] = [resp.data.comment.id]
                    }
                    return tree
                })
            }
        })
        .catch(err => {
            console.log(err);
        })
    }

    function submitComment2(replyId=null) {
        axios.post("https://trywhistle.app/api/app/commentwhistle", {
            whistleId: whistle.id,
            comment: comment2Text,
            associatedSide: keys[1],
            replyingTo: replyId,
        }, {
            headers: {
                'x-access-token': jwtToken
            }
        })
        .then(resp => {
            setComments2((comments) => {
                return [...comments, resp.data.comment]
            })
            updateComment2Text("");
            if (replyId) {
                updateComment2Tree(tree => {
                    if (tree[replyId]) {
                        tree[replyId].push(resp.data.comment.id)
                    } else {
                        tree[replyId] = [resp.data.comment.id]
                    }
                    return tree
                })
            }
        })
        .catch(err => {
            console.log(err);
        })
    }

    const getTimeDifference = (d) => {
        const currentDate = new Date();
        const date = new Date(d);
        const diff = currentDate.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor(diff / (1000 * 60));
        const seconds = Math.floor(diff / (1000));
        if (days > 0) {
            return days + "d";
        } else if (hours > 0) {
            return hours + "h";
        } else if (minutes > 0) {
            return minutes + "m";
        } else if (seconds > 0) {
            return seconds + "s";
        } else {
            return "Just now";
        }
    }

    const hasExpired = currentDateTime > new Date(whistle.closeDateTime);
    const keys = Object.keys(whistle.options);
    let totalVotes = 0;
    
    for (let i = 0; i < keys.length; i++) {
        totalVotes += whistle.options[keys[i]];
    }

    React.useEffect(() => {
        if (!isOwner && !hasExpired) {
            axios.post("https://trywhistle.app/api/user/checkhasvoted", {
                "whistleId": whistle.id,
            }, {
                headers: {
                    "x-access-token": jwtToken
                }
            })
            .then(resp => {
                if (resp.data.hasVoted) {
                    setHasVoted(true);
                }
            })
        }
        if (!hasExpired) {
            const handle = setInterval(() => {
                setCurrentDateTime(new Date());
            }, 1000);
            return () => {
                clearInterval(handle);
            }
        }
    }, []);

    React.useEffect(() => {
        axios.post("https://trywhistle.app/api/app/getreasons", {
            "whistleId": whistle.id,
        }, {
            headers: {
                "x-access-token": jwtToken
            }
        })
        .then(resp => {
            setTopReasons((topReasons) => [...topReasons, resp.data])
        })
        .catch(err => {
            console.log(err);
        })
    }, []);

    React.useEffect(() => {
        if (isComment1Visible && comments1.length === 0) {
            axios.post("https://trywhistle.app/api/app/getcomments", {
                "whistleId": whistle.id,
                "associatedSide": keys[0]
            }, {
                headers: {
                    "x-access-token": jwtToken
                }
            })
            .then(resp => {
                setComments1((comments1) => [...resp.data]);
                for (let i = 0; i < resp.data.length; i++) {
                    updateUpvotes1((upvotes1) => [...upvotes1, false]);
                    updateDownvotes1((downvotes1) => [...downvotes1, false]);
                }
                resp.data.forEach(comment => {
                    if (comment.replyingTo) {
                        updateComment1Tree(tree => {
                            if (tree[comment.replyingTo]) {
                                tree[comment.replyingTo].push(comment.id);
                            } else {
                                tree[comment.replyingTo] = [comment.id];
                            }
                            return tree
                        })
                    }
                })
            })
            .catch(err => {
                console.log(err);
            });
        }
    }, [isComment1Visible]);

    React.useEffect(() => {
        if (isComment2Visible && comments2.length === 0) {
            axios.post("https://trywhistle.app/api/app/getcomments", {
                "whistleId": whistle.id,
                "associatedSide": keys[1]
            }, {
                headers: {
                    "x-access-token": jwtToken
                }
            })
            .then(resp => {
                setComments2((comments) => [...resp.data]);
                for (let i = 0; i < resp.data.length; i++) {
                    updateUpvotes2((upvotes) => [...upvotes, false]);
                    updateDownvotes2((downvotes) => [...downvotes, false]);
                }
                resp.data.forEach(comment => {
                    if (comment.replyingTo) {
                        updateComment2Tree(tree => {
                            if (tree[comment.replyingTo]) {
                                tree[comment.replyingTo].push(comment.id);
                            } else {
                                tree[comment.replyingTo] = [comment.id];
                            }
                            return tree
                        })
                    }
                })
            })
            .catch(err => {
                console.log(err);
            });
        }
    }, [isComment2Visible]);

    function getIndex(comments, id) {
        for (let i = 0; i < comments.length; i++) {
            if (comments[i].id === id) {
                return i;
            }
        }
        return -1;
    }

    const CommentReplies1 = (props) => { 
        const commentId = props.commentId;

        function generateAllReplies(id) {
            let replies = [id];
    
            if (comment1Tree[id]) {
                replies = replies.concat(...comment1Tree[id].map(reply => generateAllReplies(reply)));
            }
    
            return replies;
        }
    
        let allReplies = generateAllReplies(commentId);
        // pop front of allReplies
        allReplies.shift();
    
        return (
            <View style={{ paddingLeft: 20 }}>
                {allReplies.map((replyKey, index) => {
                    const ind = getIndex(comments1, replyKey);
                    return (
                    <View key={ind} style={{ flex: 4, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 18, color: '#8CA9F2' }} onPress={() => {
                                setIsComment1Visible(false)
                                navigation.navigate('UserFeature', {username: comments1[ind].commenter})
                                }}>{comments1[ind].commenter}</Text>
                            <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 16, color: 'black' }}>{comments1[ind].comment}</Text>
                            {/* display largest denomination of difference between current time and comment.createdAt (e.g. 2yr, 5d, 2hr, 3m) */}
                            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 16, color: '#8CA9F2' }}>{getTimeDifference(comments1[ind].createdAt)} </Text>
                                <Pressable onPress={() => setReplyingTo1(comments1[ind].id)}>
                                    <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 16, color: '#2C65F6' }}>Reply</Text>
                                </Pressable>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <Pressable onPress={() => {
                                if (downvotes1[ind]) {
                                    handleVoteComment1(replyKey, ind, 'undownvote')
                                }
                                if (upvotes1[ind]) {
                                    handleVoteComment1(replyKey, ind, 'unupvote')
                                } else {
                                    handleVoteComment1(replyKey, ind, 'upvote')
                                }
                            }}>
                                <ChevronUp style={{ color: upvotes1[ind] ? '#2C65F6' : '#8CA9F2' }} width={30} height={30} />
                            </Pressable>
                            <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 18, color: 'black' }}>{comments1[ind].votes}</Text>
                            <Pressable onPress={() => {
                                if (upvotes1[ind]) {
                                    handleVoteComment1(replyKey, ind, 'unupvote')
                                }
                                if (downvotes1[ind]) {
                                    handleVoteComment1(replyKey, ind, 'undownvote')
                                } else {
                                    handleVoteComment1(replyKey, ind, 'downvote')
                                }
                            }}>
                                <ChevronDown style={{ color: downvotes1[ind] ? '#2C65F6' : '#8CA9F2' }} width={30} height={30} />
                            </Pressable>
                        </View>
                    </View>
                    )
                })}
            </View>
        );
    };

    const CommentReplies2 = (props) => { 
        const commentId = props.commentId;

        function generateAllReplies(id) {
            let replies = [id];
    
            if (comment2Tree[id]) {
                replies = replies.concat(...comment2Tree[id].map(reply => generateAllReplies(reply)));
            }
    
            return replies;
        }
    
        let allReplies = generateAllReplies(commentId);
        // pop front of allReplies
        allReplies.shift();
    
        return (
            <View style={{ paddingLeft: 20 }}>
                {allReplies.map((replyKey, index) => {
                    const ind = getIndex(comments2, replyKey);
                    return (
                    <View key={ind} style={{ flex: 4, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 18, color: '#8CA9F2' }} onPress={() => {
                                setIsComment2Visible(false)
                                navigation.navigate('UserFeature', {username: comments2[ind].commenter})
                                }}>{comments2[ind].commenter}</Text>
                            <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 16, color: 'black' }}>{comments2[ind].comment}</Text>
                            {/* display largest denomination of difference between current time and comment.createdAt (e.g. 2yr, 5d, 2hr, 3m) */}
                            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 16, color: '#8CA9F2' }}>{getTimeDifference(comments2[ind].createdAt)} </Text>
                                <Pressable onPress={() => setReplyingTo1(comments2[ind].id)}>
                                    <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 16, color: '#2C65F6' }}>Reply</Text>
                                </Pressable>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <Pressable onPress={() => {
                                if (downvotes2[ind]) {
                                    handleVoteComment2(replyKey, ind, 'undownvote')
                                }
                                if (upvotes2[ind]) {
                                    handleVoteComment2(replyKey, ind, 'unupvote')
                                } else {
                                    handleVoteComment2(replyKey, ind, 'upvote')
                                }
                            }}>
                                <ChevronUp style={{ color: upvotes2[ind] ? '#2C65F6' : '#8CA9F2' }} width={30} height={30} />
                            </Pressable>
                            <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 18, color: 'black' }}>{comments2[ind].votes}</Text>
                            <Pressable onPress={() => {
                                if (upvotes2[ind]) {
                                    handleVoteComment2(replyKey, ind, 'unupvote')
                                }
                                if (downvotes2[ind]) {
                                    handleVoteComment2(replyKey, ind, 'undownvote')
                                } else {
                                    handleVoteComment2(replyKey, ind, 'downvote')
                                }
                            }}>
                                <ChevronDown style={{ color: downvotes2[ind] ? '#2C65F6' : '#8CA9F2' }} width={30} height={30} />
                            </Pressable>
                        </View>
                    </View>
                    )
                })}
            </View>
        );
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <FlipCard
                flipHorizontal={true}
                friction={1000}
                flipVertical={false}
                flip={backside}
                clickable={false}>
                <View style={styles.whistleContainer}>
                    <View style ={{ width: 353, height: Dimensions.get('window').height - 170, flexDirection: 'column' }}>
                        <View style={{ flex: 1.2, alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Text style={styles.whistleTitle}>{whistle.title}</Text>
                        </View>
                        <View style={{ flex: 0.5, flexDirection: 'row', justifyContent: 'center', paddingTop: 4 }}>
                            <Text style={styles.whistleAuthor} onPress={() => navigation.navigate('UserFeature', {username: whistle.author})}>{whistle.author}: </Text>
                            <Text style={styles.whistleBackground}>{whistle.background}</Text>
                        </View>
                        <View style={{ flex: 4.5}}>
                            <Text style={styles.whistleContext}>{whistle.context}</Text>
                        </View>
                        {
                            isOwner || hasExpired || hasVoted
                            ? <View style={{ flex: 2.7, flexDirection: 'column' }}>
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                    <TouchableOpacity onPress={() => {
                                            if (totalVotes > 0) {
                                                setBackside(true)
                                            }
                                        }} style={{ backgroundColor: 'white', borderColor: '#5B57FA', borderWidth: 1, width: 347, height: 62, borderRadius: 6, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 20, color: '#5B57FA' }}>Show Results</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 30, color: '#2C65F6' }}>{totalVotes} Votes</Text>
                                </View>
                            </View>
                            : <View style={{ flex: 2.7, flexDirection: 'column' }}>
                                <View style={{ flex: 1.1, justifyContent: 'center', alignItems: 'center' }}>
                                    <TouchableOpacity style={styles.whistleOptionBtn} onPress={() => {
                                        axios.post("https://trywhistle.app/api/app/votewhistle", {
                                            whistleId: whistle.id,
                                            optionSelected: keys[0]
                                        }, {
                                            headers: {
                                                "x-access-token": jwtToken,
                                            }
                                        })
                                        .then(resp => {
                                            whistle.options[keys[0]] += 1;
                                            setBackside(true);
                                            setHasVoted(true);
                                        })
                                        .catch(err => console.log(err));
                                    }}>
                                        <Text style={styles.whistleOptionText}>{keys[0]}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flex: 1.1, justifyContent: 'center', alignItems: 'center' }}>
                                    <TouchableOpacity style={styles.whistleOptionBtn} onPress={() => {
                                        axios.post("https://trywhistle.app/api/app/votewhistle", {
                                            whistleId: whistle.id,
                                            optionSelected: keys[1]
                                        }, {
                                            headers: {
                                                "x-access-token": jwtToken,
                                            }
                                        })
                                        .then(resp => {
                                            whistle.options[keys[1]] += 1;
                                            setBackside(true);
                                            setHasVoted(true);
                                        })
                                        .catch(err => console.log(err));
                                    }}>
                                        <Text style={styles.whistleOptionText}>{keys[1]}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'flex-end' }}>
                                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 22, color:'#2C65F6' }}>{totalVotes} Votes</Text>
                                </View>
                            </View>
                        }
                        <View style={{ flex: 1.4, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 20, color: '#4D7AEF', textAlign: 'center' }}>Time left </Text>
                            {
                                hasExpired
                                ? <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 18, color: '#E21313', textAlign: 'center' }}>Expired</Text>
                                : <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 18, color: '#E21313', textAlign: 'center' }}>{Math.floor((new Date(whistle.closeDateTime) - currentDateTime) / (1000 * 60 * 60 * 24))} days : {Math.floor(((new Date(whistle.closeDateTime) - currentDateTime) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))} hrs : {Math.floor(((new Date(whistle.closeDateTime) - currentDateTime) % (1000 * 60 * 60)) / (1000 * 60))} mins : {Math.floor(((new Date(whistle.closeDateTime) - currentDateTime) % (1000 * 60)) / 1000)} secs</Text>
                            }
                        </View>
                    </View>
                </View>
                <View style={styles.whistleContainerBack}>
                    <View style ={{ width: 353, height: Dimensions.get('window').height - 170, flexDirection: 'column', justifyContent: 'center' }}>
                        <View style={{ flex: 1.2, alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Text style={styles.whistleTitle}>{whistle.title}</Text>
                        </View>
                        <View style={{ flex: 0.5, flexDirection: 'row', justifyContent: 'center', paddingTop: 4 }}>
                            <Text style={styles.whistleAuthor} onPress={() => navigation.navigate('UserFeature', {username: whistle.author})}>{whistle.author}</Text>
                        </View>
                        <View style={{ flex: 7, flexDirection: 'row', justifyContent: 'center', width: 340, alignSelf: 'center' }}>
                            <Pressable onPress={() => setIsComment1Visible(true)} style={styles.pollBarContainer}>
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <Text style={styles.percentage}>{whistle.options[keys[0]]} Votes ({(whistle.options[keys[0]] / (whistle.options[keys[0]] + whistle.options[keys[1]])).toFixed(2) * 100}%)</Text>
                                </View>
                                <View style={{ flex: 5, justifyContent: 'flex-end' }}>
                                    <PollBar key={0} percent={whistle.options[keys[0]] / (whistle.options[keys[0]] + whistle.options[keys[1]])} style={styles.pollBar}></PollBar>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <Text style={styles.pollBarText}>
                                        {keys[0]}
                                    </Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    {
                                        topReasons.length > 0 && topReasons[0][keys[0]] && topReasons[0][keys[0]].length > 0
                                        && <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', width: 150 }}>
                                                <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 16, color: '#2C65F6' }}>1. </Text>
                                                <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 16, color: '#2C65F6' }} numberOfLines={1}>{topReasons[0][keys[0]][0].comment}</Text>
                                            </View> 
                                    }
                                    {
                                        topReasons.length > 0 && topReasons[0][keys[0]] && topReasons[0][keys[0]].length > 1
                                        && <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', width: 150 }}>
                                                <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 16, color: '#2C65F6' }}>2. </Text>
                                                <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 16, color: '#2C65F6' }} numberOfLines={1}>{topReasons[0][keys[0]][1].comment}</Text>
                                            </View>
                                    }
                                </View>
                            </Pressable>
                            <Pressable onPress={() => setIsComment2Visible(true)} style={styles.pollBarContainer}>
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <Text style={styles.percentage}>{whistle.options[keys[1]]} Votes ({(whistle.options[keys[1]] / (whistle.options[keys[0]] + whistle.options[keys[1]])).toFixed(2) * 100}%)</Text>
                                </View>
                                <View style={{ flex: 5, justifyContent: 'flex-end' }}>
                                    <PollBar key={1} percent={whistle.options[keys[1]] / (whistle.options[keys[0]] + whistle.options[keys[1]])} style={styles.pollBar}></PollBar>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <Text style={styles.pollBarText}>
                                        {keys[1]}
                                    </Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    {
                                        topReasons.length > 0 && topReasons[0][keys[1]] && topReasons[0][keys[1]].length > 0
                                        && <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', width: 150 }}>
                                                <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 16, color: '#2C65F6' }}>1. </Text>
                                                <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 16, color: '#2C65F6' }} numberOfLines={1}>{topReasons[0][keys[1]][0].comment}</Text>
                                            </View>
                                    }
                                    {
                                        topReasons.length > 0 && topReasons[0][keys[1]] && topReasons[0][keys[1]].length > 1
                                        && <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', width: 150 }}>
                                            <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 16, color: '#2C65F6' }}>2. </Text>
                                            <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 16, color: '#2C65F6' }} numberOfLines={1}>{topReasons[0][keys[1]][1].comment}</Text>
                                        </View>
                                    }
                                </View>
                            </Pressable>
                        </View>
                        <Pressable style={{ position: 'absolute', top: 15, right: 1 }} onPress={() => setBackside(false)}>
                            <Text style={{ fontFamily: 'WorkSans-Medium', color: '#4D7AEF', fontSize: 16, textDecorationLine: 'underline' }}>Go Back</Text>
                        </Pressable>
                    </View>
                    <View>
                        <Modal
                            onSwipeComplete={close1}
                            swipeDirection={['down']}
                            scrollTo={handleScrollTo1}
                            scrollOffset={scrollOffset1}
                            scrollOffsetMax={100}
                            propagateSwipe={true}
                            style={styles.modal}
                            isVisible={isComment1Visible}
                            >
                            <View style={styles.scrollableModal}>
                                <View style={{ height: 480 }}>
                                    <ScrollView 
                                        ref={commentModal1Ref}
                                        onScroll={handleOnScroll1}
                                        scrollEventThrottle={16}
                                        >
                                        <View style={{ width: 350, flexDirection: 'column', marginTop: 15, alignSelf: 'center' }}>
                                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                <View style={{ flex: 1 }}></View>
                                                <View style={{ flex: 5, flexDirection: 'row', justifyContent: 'center' }}>
                                                    <Text style={{ fontFamily: 'WorkSans-Bold', fontSize: 24, color: '#2C65F6' }}>{keys[0]} </Text>
                                                    <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 24, color: '#2C65F6' }}>({comments1.length})</Text>
                                                </View>
                                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                                    <Pressable onPress={() => setIsComment1Visible(false)}>
                                                        <X width={24} height={24} />
                                                    </Pressable>
                                                </View>
                                            </View>
                                            {
                                                comments1.map((comment, index) => {
                                                    if (!comment.replyingTo) {
                                                        return (
                                                            <>
                                                                <View key={index} style={{ flex: 4, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                                                    <View style={{ flexDirection: 'column' }}>
                                                                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 18, color: '#8CA9F2' }} onPress={() => {
                                                                            setIsComment1Visible(false)
                                                                            navigation.navigate('UserFeature', {username: comment.commenter})
                                                                            }}>{comment.commenter}</Text>
                                                                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 16, color: 'black' }}>{comment.comment}</Text>
                                                                        {/* display largest denomination of difference between current time and comment.createdAt (e.g. 2yr, 5d, 2hr, 3m) */}
                                                                        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                                                            <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 16, color: '#8CA9F2' }}>{getTimeDifference(comment.createdAt)} </Text>
                                                                            <Pressable onPress={() => setReplyingTo1(comment.id)}>
                                                                                <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 16, color: '#2C65F6' }}>Reply</Text>
                                                                            </Pressable>
                                                                        </View>
                                                                    </View>
                                                                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                                                        <Pressable onPress={() => {
                                                                            if (downvotes1[index]) {
                                                                                handleVoteComment1(comment.id, index, 'undownvote')
                                                                            }
                                                                            if (upvotes1[index]) {
                                                                                handleVoteComment1(comment.id, index, 'unupvote')
                                                                            } else {
                                                                                handleVoteComment1(comment.id, index, 'upvote')
                                                                            }
                                                                        }}>
                                                                            <ChevronUp style={{ color: upvotes1[index] ? '#2C65F6' : '#8CA9F2' }} width={30} height={30} />
                                                                        </Pressable>
                                                                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 18, color: 'black' }}>{comment.votes}</Text>
                                                                        <Pressable onPress={() => {
                                                                            if (upvotes1[index]) {
                                                                                handleVoteComment1(comment.id, index, 'unupvote')
                                                                            }
                                                                            if (downvotes1[index]) {
                                                                                handleVoteComment1(comment.id, index, 'undownvote')
                                                                            } else {
                                                                                handleVoteComment1(comment.id, index, 'downvote')
                                                                            }
                                                                        }}>
                                                                            <ChevronDown style={{ color: downvotes1[index] ? '#2C65F6' : '#8CA9F2' }} width={30} height={30} />
                                                                        </Pressable>
                                                                    </View>
                                                                </View>
                                                                {/* CommentReplies passing comment1Tree, commend.id and comments1 through */}
                                                                {
                                                                    comment1Tree[comment.id] && <CommentReplies1 replyTree={comment1Tree} commentId={comment.id} comments={comments1} />
                                                                }
                                                            </>
                                                        )
                                                    }
                                                })
                                            }
                                        </View>
                                    </ScrollView>
                                </View>
                                <View style={{ height: 70, width: '100%', position: 'absolute', bottom: keyboardOffset, alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'white' }}>
                                    {
                                        replyingTo1
                                        ? <TextInput ref={replyingInputRef1} editable placeholderTextColor="#9D9D9D" placeholder={`Replying to ${comments1[getIndex(comments1, replyingTo1)].commenter}...`} value={comment1Text} onChangeText={updateComment1Text} style={styles.commentInput} onSubmitEditing={() => {
                                            if (comment1Text.trim().length > 0)
                                                submitComment1(replyingTo1);
                                        }}/>
                                        : <TextInput editable placeholderTextColor="#9D9D9D" placeholder="Add comment..." value={comment1Text} onChangeText={updateComment1Text} style={styles.commentInput} onSubmitEditing={() => {
                                            if (comment1Text.trim().length > 0)
                                                submitComment1();
                                        }}/>
                                    }
                                </View>
                            </View>
                        </Modal>
                    </View>
                    <View>
                        <Modal
                            onSwipeComplete={close2}
                            swipeDirection={['down']}
                            scrollTo={handleScrollTo2}
                            scrollOffset={scrollOffset2}
                            scrollOffsetMax={100}
                            propagateSwipe={true}
                            style={styles.modal}
                            isVisible={isComment2Visible}
                            >
                            <View style={styles.scrollableModal}>
                                <View style={{ height: 480 }}>
                                    <ScrollView 
                                        ref={commentModal2Ref}
                                        onScroll={handleOnScroll2}
                                        scrollEventThrottle={16}
                                        >
                                        <View style={{ width: 350, flexDirection: 'column', marginTop: 15, alignSelf: 'center' }}>
                                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                <View style={{ flex: 1 }}></View>
                                                <View style={{ flex: 5, flexDirection: 'row', justifyContent: 'center' }}>
                                                    <Text style={{ fontFamily: 'WorkSans-Bold', fontSize: 24, color: '#2C65F6' }}>{keys[1]} </Text>
                                                    <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 24, color: '#2C65F6' }}>({comments2.length})</Text>
                                                </View>
                                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                                    <Pressable onPress={() => setIsComment2Visible(false)}>
                                                        <X width={24} height={24} />
                                                    </Pressable>
                                                </View>
                                            </View>
                                            {
                                                comments2.map((comment, index) => {
                                                    if (!comment.replyingTo) {
                                                        return (
                                                            <>
                                                                <View key={index} style={{ flex: 4, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                                                    <View style={{ flexDirection: 'column' }}>
                                                                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 18, color: '#8CA9F2' }} onPress={() => {
                                                                            setIsComment2Visible(false)
                                                                            navigation.navigate('UserFeature', {username: comment.commenter})
                                                                            }}>{comment.commenter}</Text>
                                                                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 16, color: 'black' }}>{comment.comment}</Text>
                                                                        {/* display largest denomination of difference between current time and comment.createdAt (e.g. 2yr, 5d, 2hr, 3m) */}
                                                                        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                                                            <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 16, color: '#8CA9F2' }}>{getTimeDifference(comment.createdAt)} </Text>
                                                                            <Pressable onPress={() => setReplyingTo2(comment.id)}>
                                                                                <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 16, color: '#2C65F6' }}>Reply</Text>
                                                                            </Pressable>
                                                                        </View>
                                                                    </View>
                                                                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                                                        <Pressable onPress={() => {
                                                                            if (downvotes2[index]) {
                                                                                handleVoteComment2(comment.id, index, 'undownvote')
                                                                            }
                                                                            if (upvotes2[index]) {
                                                                                handleVoteComment2(comment.id, index, 'unupvote')
                                                                            } else {
                                                                                handleVoteComment2(comment.id, index, 'upvote')
                                                                            }
                                                                        }}>
                                                                            <ChevronUp style={{ color: upvotes2[index] ? '#2C65F6' : '#8CA9F2' }} width={30} height={30} />
                                                                        </Pressable>
                                                                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 18, color: 'black' }}>{comment.votes}</Text>
                                                                        <Pressable onPress={() => {
                                                                            if (upvotes2[index]) {
                                                                                handleVoteComment2(comment.id, index, 'unupvote')
                                                                            }
                                                                            if (downvotes2[index]) {
                                                                                handleVoteComment2(comment.id, index, 'undownvote')
                                                                            } else {
                                                                                handleVoteComment2(comment.id, index, 'downvote')
                                                                            }
                                                                        }}>
                                                                            <ChevronDown style={{ color: downvotes2[index] ? '#2C65F6' : '#8CA9F2' }} width={30} height={30} />
                                                                        </Pressable>
                                                                    </View>
                                                                </View>
                                                                {/* CommentReplies passing comment1Tree, commend.id and comments1 through */}
                                                                {
                                                                    comment2Tree[comment.id] && <CommentReplies2 replyTree={comment2Tree} commentId={comment.id} comments={comments2} />
                                                                }
                                                            </>
                                                        )
                                                    }
                                                })
                                            }
                                        </View>
                                    </ScrollView>
                                </View>
                                <View style={{ height: 70, width: '100%', position: 'absolute', bottom: keyboardOffset, alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'white' }}>
                                    {
                                        replyingTo2
                                        ? <TextInput ref={replyingInputRef2} editable placeholderTextColor="#9D9D9D" placeholder={`Replying to ${comments2[getIndex(comments2, replyingTo2)].commenter}...`} value={comment2Text} onChangeText={updateComment2Text} style={styles.commentInput} onSubmitEditing={() => {
                                            if (comment1Text.trim().length > 0)
                                                submitComment2(replyingTo2);
                                        }}/>
                                        : <TextInput editable placeholderTextColor="#9D9D9D" placeholder="Add comment..." value={comment2Text} onChangeText={updateComment2Text} style={styles.commentInput} onSubmitEditing={() => {
                                            if (comment1Text.trim().length > 0)
                                                submitComment2();
                                        }}/>
                                    }
                                </View>
                            </View>
                        </Modal>
                    </View>
                </View>
            </FlipCard>
        </TouchableWithoutFeedback>
    );
}

export default WhistleDisplay;

const styles = StyleSheet.create({
    whistleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ECEEFF',
        height: Dimensions.get('window').height - 170,
    },
    whistleContainerBack: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ECEEFF',
        height: Dimensions.get('window').height - 170,
    },
    whistleTitle: {
        fontFamily: 'WorkSans-Bold',
        fontSize: 30,
        color: '#2C65F6',
        textAlign: 'center'
    },
    whistleAuthor: {
        fontFamily: 'WorkSans-Regular',
        fontSize: 18,
        color: '#8CA9F2'
    },
    whistleBackground: {
        fontFamily: 'WorkSans-SemiBold',
        fontSize: 18,
        color: '#2C65F6'
    },
    whistleContext: {
        fontFamily: 'WorkSans-Regular',
        fontSize: 14,
        color: 'black'
    },
    whistleOptionBtn: {
        width: 347,
        height: 62,
        borderRadius: 6,
        backgroundColor: '#5B57FA',
        alignItems: 'center',
        justifyContent: 'center'
    },
    whistleOptionText: {
        fontFamily: 'WorkSans-Regular',
        fontSize: 19,
        color: 'white'
    },
    pollBarContainer: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: 'column',
        width: 150,
        flex: 1,
    },
    percentage: {
        fontFamily: 'WorkSans-Medium',
        fontSize: 16,
        color: '#2C65F6'
    },
    pollBar: {
        width: 70,
        height: 350,
        backgroundColor: '#5B57FA',
        borderRadius: 10,
    },
    pollBarText: {
        color: 'black',
        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'WorkSans-SemiBold',
        color: '#2C65F6'
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    scrollableModal: {
        height: 550,
        backgroundColor: '#FEFEFE',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24
    },
    commentInput: {
        width: Dimensions.get('window').width - 40,
        height: 35,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'black',
        color: 'black',
        fontFamily: 'WorkSans-Regular',
        fontSize: 14,
        padding: 8,
        marginTop: 8
    }
});