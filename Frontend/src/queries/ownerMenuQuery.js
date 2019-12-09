import { gql } from 'apollo-boost';

const getMenuItems = gql`
query getMenuItems($id:String!){
  getMenuItems(id:$id){
      owner_id,
      sections
    }
  }
`


export {getMenuItems};