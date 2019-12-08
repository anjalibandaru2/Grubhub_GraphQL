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
        id
    }
}
`;

const updateprofilemutation = gql`
mutation updateProfile(
        $id:String!,
        $firstname:String!,
        $lastname:String!,
        $phoneNumber:String!,
        $aboutMe:String!, 
        $company: String!,
        $city: String!,
        $country: String!,
        $school: String!,
        $hometown: String!,
        $languages: String!,
        $gender: String!
  )
  {
    updateProfile(
        id: $id,
        firstname: $firstname,
        lastname: $lastname,
        phoneNumber: $phoneNumber,
        aboutMe: $aboutMe, 
        company: $company,
        city: $city,
        country: $country,
        school: $school,
        hometown: $hometown,
        languages: $languages,
        gender: $gender
        ){
            responseMessage
        }
    }
`;


export { signupBuyermutation, signupOwnermutation, updateprofilemutation, signInMutation };