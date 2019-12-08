const graphql = require('graphql');
var BuyersSchema = require('../models/BuyersSchema');
var OwnersSchema = require('../models/OwnersSchema');
//var CoursesModel = require('../models/CourseSchema');
const sha1 = require('sha1');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLDate
} = graphql;

const signupBuyerResult = new GraphQLObjectType({
    name: 'signupBuyerResult',
    fields: () => ({
        valid :  { type: GraphQLString },
        responseMessage: { type: GraphQLString }
    })
});

const signupOwnerResult = new GraphQLObjectType({
    name: 'signupOwnerResult',
    fields: () => ({
        valid :  { type: GraphQLString },
        responseMessage: { type: GraphQLString }
    })
});

const signInResult = new GraphQLObjectType({
    name: 'loggedInUserData',
    fields: () => ({
        isValidUser: { type: GraphQLBoolean },
        user_type: { type: GraphQLString },
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        responseMessage : { type: GraphQLString }
    })
});



const FacultyCourseType = new GraphQLObjectType({
    name: 'FacultyCourseType',
    fields: () => ({
        _id: { type: GraphQLString },
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        dept: { type: GraphQLString },
        description: { type: GraphQLString },
        room: { type: GraphQLString },
        capacity: { type: GraphQLInt },
        courseTerm: { type: GraphQLString },
        waitlistCapacity: { type: GraphQLInt },
        currentEnrolledStudents: { type: GraphQLInt }
    })
});

const FacultyCourseList = new GraphQLObjectType({
    name: 'FacultyCourseList',
    fields: () => ({
        courses: { type: new GraphQLList(FacultyCourseType) }
    })
});


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        facultycourses: {
            type: FacultyCourseList,
            args: {
                faculty_id: {
                    type: GraphQLString
                }
            },
            async resolve(parent, args) {
                console.log('in get faculty courses data args: ', args);
                var courseDetails = [];


                await CoursesModel.find({ faculty_id: args.faculty_id }, function (err, results) {
                    if (err) {
                        console.log("Error while querying user info:", err);
                    } else {
                        if (results) {
                            console.log("results:", results);
                            courseDetails = results.concat();
                        }
                    }
                });
                var courseList = {
                    courses: courseDetails
                }
                return courseList;
            }
        },

    })
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        signupBuyer: {
            type: signupBuyerResult,
            args: {
                name: {
                    type: GraphQLString
                },
                email: {
                    type: GraphQLString
                },
                password: {
                    type: GraphQLString
                }
            },

            resolve: (parent, args) => {
                return new Promise(async (resolve, reject) => {
                    console.log("Inside Signup Mutation");
                    console.log("Printing args");
                    console.log(args);
                    await BuyersSchema.findOne({
                        "buyer_email": args.email
                    }, (err, user) => {
                        if (err) {
                            console.log("Error while querying user info:", err);
                        }
                        else {
                            if (user) {
                                console.log('User Exists!', user);
                                var resultData = {
                                    responseMessage: 'User Already exists!',
                                    valid : "false"
                                }
                                resolve(resultData);
                            }
                            else {
                                var user = new BuyersSchema({
                                    buyer_email: args.email,
                                    buyer_password: sha1(args.password),
                                    buyer_name: args.name,
                                });
                                console.log('User saving..');
                                user.save().then((doc) => {
                                    console.log("User saved successfully.", doc);
                                    console.log('EOF');
                                    var resultData = {
                                        responseMessage: 'Successfully Added!',
                                        valid : "true"
                                    }
                                    resolve(resultData);
                                });

                            }

                        }
                    });
                });
            }
        },

        signupOwner: {
            type: signupOwnerResult,
            args: {
                name: {
                    type: GraphQLString
                },
                email: {
                    type: GraphQLString
                },
                password: {
                    type: GraphQLString
                },
                restName : {
                    type: GraphQLString
                },
                restCuisine : {
                    type: GraphQLString
                },
                restZipcode : {
                    type: GraphQLString
                }
            },

            resolve: (parent, args) => {
                return new Promise(async (resolve, reject) => {
                    console.log("Inside Signup owner Mutation");
                    console.log("Printing args");
                    console.log(args);
                    await OwnersSchema.findOne({
                        "owner_email": args.email
                    }, (err, user) => {
                        if (err) {
                            console.log("Error while querying user info:", err);
                        }
                        else {
                            if (user) {
                                console.log('Owner Exists!', user);
                                var resultData = {
                                    responseMessage: 'Owner Already exists!'
                                }
                                resolve(resultData);
                            }
                            else {
                                var user = new OwnersSchema({
                                    owner_email: args.email,
                                    owner_password: sha1(args.password),
                                    owner_name: args.name,
                                    owner_restName : args.restName,
                                    owner_restCuisine : args.restCuisine,
                                    owner_restZipcode : args.restZipcode

                                });
                                console.log('Owner saving..');
                                user.save().then((doc) => {
                                    console.log("Owner saved successfully.", doc);
                                    console.log('EOF');
                                    var resultData = {
                                        responseMessage: 'Successfully Added!'
                                    }
                                    resolve(resultData);
                                });

                            }

                        }
                    });
                });
            }
        },
        

        signin: {
            type: signInResult,
            args: {
                email: {
                    type: GraphQLString
                },
                password: {
                    type: GraphQLString
                },
                userType: {
                    type: GraphQLString
                },
                responseMessage : {
                    type: GraphQLString
                }
                
            },

            resolve: (parent, args) => {
                return new Promise(async (resolve, reject) => {
                    console.log("Inside signin  Mutation");
                    console.log("Printing args");
                    console.log(args);
                    let Users, prefix;
                    let userType = args.userType;
                    if(userType === "owner"){
                        Users = OwnersSchema;
                        prefix = "owner_";
                    } else {
                        Users = BuyersSchema;
                        prefix = "buyer_";
                    }

                    await Users.findOne({
                        [prefix+"email"] : args.email,
                        [prefix+"password"] : sha1(args.password),
                    }, (err, user) => {
                        if (err) {
                            console.log("Error while querying user info:", err);
                        }
                        else {
                            if (user) {
                                console.log('User Exists!', user);
                                let resultData = {
                                    isValidUser : true,
                                    "user_type" : userType,
                                    id :  user._id,
                                    name : user[prefix+"name"],
                                    responseMessage : "successful login"
                                }; 
                                resolve(resultData);
                            }
                            else {
                                let resultData = {};
                               // if(userType == "owner"){
                                    resultData = {
                                        responseMessage: "Invalid credentials!"
                                    }
                                /*} else {
                                    resultData = {
                                        responseMessage: "Invalid credentials!"
                                    }*/
                                //}
                                resolve(resultData);
                            }

                        }
                    });
                });
            }
        },
    })
});

module.exports = new GraphQLSchema({
    query : RootQuery,
    mutation: Mutation
});


