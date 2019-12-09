import { gql } from 'apollo-boost';

const buyerProfilequery = gql`
query buyerProfile($id:String!){
  buyerProfile(id:$id){
      buyer_id,
      buyer_name,
      buyer_email,
      buyer_address
    }
  }
`

const ownerProfilequery = gql`
query ownerProfile($id:String!){
  ownerProfile(id:$id){
      owner_id,
      owner_name,
      owner_email,
      owner_restCuisine,
      owner_restZipcode,
      owner_restName
    }
  }
`

export {buyerProfilequery, ownerProfilequery};