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

const buyerProfileDetails =  new GraphQLObjectType({
    name: 'buyerProfileDetails',
    fields: () => ({
        message : { type : GraphQLObjectType},
        /*name: { type: GraphQLBoolean },
        email: { type: GraphQLString },
        password: { type: GraphQLString }*/
    })
});

const ownerProfileDetails =  new GraphQLObjectType({
    name: 'ownerProfileDetails',
    fields: () => ({
        message : { type : GraphQLObjectType},
       /* isValidUser: { type: GraphQLBoolean },
        user_type: { type: GraphQLString },
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        responseMessage : { type: GraphQLString }*/
    })
});

const buyerProfileType = new GraphQLObjectType({
    name: 'buyerProfileType',
    fields: () => ({
        buyer_id: {
            type: GraphQLString
        },
        buyer_name: {
            type: GraphQLString
        },
        buyer_email: {
            type: GraphQLString
        },
        buyer_address: {
            type: GraphQLString
        }
    })
});

const ownerProfileType = new GraphQLObjectType({
    name: 'ownerProfileType',
    fields: () => ({
        owner_id: {
            type: GraphQLString
        },
        owner_name: {
            type: GraphQLString
        },
        owner_email: {
            type: GraphQLString
        },
        owner_restCuisine: {
            type: GraphQLString
        },
        owner_restZipcode: {
            type: GraphQLString
        },
        owner_restName: {
            type: GraphQLString
        },
    })
});

const menuItemsType  = new GraphQLObjectType({
    name: 'menuItemsType',
    fields: () => ({
        owner_id: {
            type: GraphQLString
        },
        sections: {
            type: GraphQLObjectType
        }
    })
});


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        buyerProfile: {
            type: buyerProfileType,
            args: {
                id: {
                    name: "_id",
                    type: GraphQLString
                }
            },
            async resolve(parent, args) {
                console.log('in get profile data args: ', args);
                var profileData = {};
                await BuyersSchema.findById(args.id
                    , (err, user) => {
                        if (err) {
                            console.log("Error while querying user info:", err);
                        }
                        else {
                            console.log('User details: ', user);
                            user.buyer_id = user._id;
                            if(!user.buyer_address){
                                user.buyer_address = "";
                            }
                            profileData = user;
                        }
                    });

                return profileData;
            }
        },

        ownerProfile: {
            type: ownerProfileType,
            args: {
                id: {
                    name: "_id",
                    type: GraphQLString
                }
            },
            async resolve(parent, args) {
                console.log('in get profile data args: ', args);
                var profileData = {};
                await OwnersSchema.findById(args.id
                    , (err, user) => {
                        if (err) {
                            console.log("Error while querying user info:", err);
                        }
                        else {
                            console.log('User details: ', user);
                            user.owner_id = user._id;
                            profileData = user;
                        }
                    });

                return profileData;
            }
        },
        getMenuItems :{
            type: menuItemsType,
            args: {
                owner_id: {
                    name: "_id",
                    type: GraphQLString
                }
            },
            async resolve(parent, args) {
                console.log('in get profile data args: ', args);
                var sectionData = {};
                await OwnersSchema.findById(args.owner_id
                    , (err, owner) => {
                        if (err) {
                            console.log("Error while querying owner info:", err);
                        }
                        else {
                            console.log('Menu  details: ', owner);
                            sectionData = owner.sections;
                        }
                    });

                return sectionData;
            }
        }
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

        updateBuyerProfile : {
            type: signupBuyerResult,
            args: {
                buyer_id: {
                    name: "_id",
                    type: GraphQLString
                },
                buyer_email: { type: GraphQLString },
                buyer_name: { type: GraphQLString },
                buyer_address: { type: GraphQLString }
            },
            resolve: (parent, args) => {
                return new Promise(async (resolve, reject) => {
                    console.log("Inside update buyer profile Mutation");
                    var resultData = {
                        responseMessage: 'Buyer Profile does not exists!'
                    };
                    await BuyersSchema.findByIdAndUpdate(args.buyer_id, {
                        $set:
                        {
                            "name": args.buyer_name,
                            "buyer_email": args.buyer_email,
                            "buyer_address": args.buyer_address
                        }
                    }, (err, user) => {
                        if (err) {
                            console.log("Error while querying user info:", err);
                            resultData = {
                                responseMessage: 'Error: ' + err
                            };
                            resolve(resultData);
                        }
                        else {
                            if (user) {
                                console.log('User details: ', user);
                                //let cookies = {"cookie1": user.role, "cookie2": user._id, "cookie3": user.firstname+" "+user.lastname, "cookie4": user.email };
                                resultData = {
                                    responseMessage: 'Successfully updated!'
                                };
                            }
                            resolve(resultData);
                        }
                    });


                });

            }
        },
        updateOwnerProfile : {
            type: signupOwnerResult,
            args: {
                owner_id: {
                    name: "_id",
                    type: GraphQLString
                },
                owner_email: { type: GraphQLString },
                owner_name: { type: GraphQLString },
                owner_restCuisine : { type: GraphQLString },
                owner_restName : { type: GraphQLString },
                owner_restZipcode : { type: GraphQLString },
            },
            resolve: (parent, args) => {
                console.log("Printing args");
                console.log(args);
                return new Promise(async (resolve, reject) => {
                    console.log("Inside update owner profile Mutation");
                    var resultData = {
                        responseMessage: 'Owner Profile does not exists!'
                    };
                    await OwnersSchema.findByIdAndUpdate(args.owner_id, {
                        $set:
                        {
                            "owner_name": args.owner_name,
                            "owner_email": args.owner_email,
                            "owner_restZipcode": args.owner_restZipcode,
                            "owner_restCuisine" : args.owner_restCuisine,
                            "owner_restName" : args.owner_restName
                        }
                    }, (err, user) => {
                        if (err) {
                            console.log("Error while querying user info:", err);
                            resultData = {
                                responseMessage: 'Error: ' + err
                            };
                            resolve(resultData);
                        }
                        else {
                            if (user) {
                                console.log('User details: ', user);
                                //let cookies = {"cookie1": user.role, "cookie2": user._id, "cookie3": user.firstname+" "+user.lastname, "cookie4": user.email };
                                resultData = {
                                    responseMessage: 'Successfully updated!'
                                };
                            }
                            resolve(resultData);
                        }
                    });


                });

            }
        },

        addSection : {
            type: signupOwnerResult,
            args: {
                owner_id: {
                    name: "_id",
                    type: GraphQLString
                },
                section_type: { type: GraphQLString }
            },
            resolve: (parent, args) => {
                console.log("Printing args");
                console.log(args);
                return new Promise(async (resolve, reject) => {
                    console.log("Inside add a section Mutation");
                    var resultData = {
                        responseMessage: 'Section cannot be added!!'
                    };
                    await OwnersSchema.findByIdAndUpdate(args.owner_id, {
                        $push:
                        {
                            "sections" : {section_type: section_type, menu_items:[]}
                        }
                    }, (err, user) => {
                        if (err) {
                            console.log("Error while adding a section:", err);
                            resultData = {
                                responseMessage: 'Error: ' + err
                            };
                            resolve(resultData);
                        }
                        else {
                            if (user) {
                                resultData = {
                                    responseMessage: 'Successfully added section!'
                                };
                            }
                            resolve(resultData);
                        }
                    });
                });
            }
        },

        addItemToSection : {
            type: signupOwnerResult,
            args: {
                owner_id: {
                    name: "_id",
                    type: GraphQLString
                },
                section_type: { type: GraphQLString },
                item_name :  { type: GraphQLString },
                item_description :  { type: GraphQLString },
                item_price :  { type: GraphQLString }
            },
            resolve: (parent, args) => {
                console.log("Printing args");
                console.log(args);
                let {section_type, item_name, item_description, item_price } = args;
                return new Promise(async (resolve, reject) => {
                    console.log("Inside add an item Mutation");
                    var resultData = {
                        responseMessage: 'Item cannot be added to section!!'
                    };
                    await OwnersSchema.findOne(args.owner_id, (err, owner) => {
                        if (err) {
                            console.log("Error while adding an item:", err);
                            resultData = {
                                responseMessage: 'Error: ' + err
                            };
                            resolve(resultData);
                        }
                        else  if (owner) {
                                owner.sections.forEach(function(section){
                                    console.log("before adding in section....");
                                    console.log(section);
                                    if(section["section_type"] == section_type){
                                        section["menu_items"].push({item_name, item_description, item_price});
                                        console.log(section["menu_items"]);
                                    }
                                });
                                console.log(owner);
                                owner.markModified("sections");
                                owner.save(function(err){
                                    if(!err){
                                        callback(null, { status: 200, message:"item is added successfully!!" });
                                    } else{
                                        callback(null, { status: 200, message:"item not added!!" });
                                    }
                                });
                                resultData = {
                                    responseMessage: 'Successfully added item!'
                                };
                                resolve(resultData);
                            //}
                        } else {
                            resultData = {
                                responseMessage: "Owner doesn't exist!"
                            };
                            resolve(resultData);
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


