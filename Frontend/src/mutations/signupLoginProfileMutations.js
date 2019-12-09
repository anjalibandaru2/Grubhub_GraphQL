import { gql } from 'apollo-boost';

const signupBuyermutation = gql`
mutation signupBuyer(
    $email: String!,
    $name: String!,
    $password: String!) {
    signupBuyer(
        email: $email,
        name: $name,
        password: $password,
    ) {
        responseMessage,
        valid
    }
}`;

const signupOwnermutation = gql`
mutation signupOwner(
    $email: String!,
    $name: String!,
    $password: String!,
    $restName :String!,
    $restCuisine : String!,
    $restZipcode : String!
    ) {
    signupOwner(
        email: $email,
        name: $name,
        password: $password,
        restName : $restName,
        restCuisine : $restCuisine,
        restZipcode : $restZipcode
    ) {
        responseMessage,
        valid
    }
}
`;


const signInBuyerMutation = gql`
mutation signin(
    $email: String!,
    $password: String!,
    $userType: String!) {
    signin(
        email: $email,
        password: $password,
        userType: $userType) {
        isValidUser,
        user_type,
        name,
        buyer_email
    }
}
`;

const signInMutation = gql`
mutation signin(
    $email: String!,
    $password: String!,
    $userType: String!) {
    signin(
        email: $email,
        password: $password,
        userType: $userType) {
        isValidUser,
        user_type,
        name,
        id,
        responseMessage
    }
}
`;

const updateBuyerProfileMutation = gql`
mutation updateBuyerProfile(
        $buyer_id:String!,
        $buyer_name:String!,
        $buyer_email:String!,
        $buyer_address :String!
  )
  {
    updateBuyerProfile(
        buyer_id: $buyer_id,
        buyer_name: $buyer_name,
        buyer_email: $buyer_email,
        buyer_address : $buyer_address

        ){
            responseMessage
        }
    }
`;

const updateOwnerProfileMutation = gql`
mutation updateOwnerProfile(
        $owner_id:String!,
        $owner_name:String!,
        $owner_email:String!,
        $owner_restName:String!,
        $owner_restCuisine:String!,
        $owner_restZipcode:String!
  )
  {
    updateOwnerProfile(
        owner_id: $owner_id,
        owner_name: $owner_name,
        owner_email: $owner_email,
        owner_restName:$owner_restName,
        owner_restCuisine: $owner_restCuisine,
        owner_restZipcode:$owner_restZipcode

        ){
            responseMessage
        }
    }
`;

const addSection = gql`
mutation addSection(
        $owner_id:String!,
        $section_type:String!,
  )
  {
    addSection(
        owner_id: $owner_id,
        section_type: $section_type
        ){
            responseMessage
        }
    }
`;

const addItemToSection = gql`
mutation addItemToSection(
        $owner_id:String!,
        $section_type:String!,
        $item_name:String!,
        $item_description:String!,
        $item_price:String!
  )
  {
    addItemToSection(
        owner_id: $owner_id,
        section_type: $section_type,
        item_name : $item_name,
        item_description : $item_description,
        item_price : $item_price
        ){
            responseMessage
        }
    }
`;




export { signupBuyermutation, signupOwnermutation, updateBuyerProfileMutation, signInMutation, updateOwnerProfileMutation, addSection, addItemToSection, getMenuItems };