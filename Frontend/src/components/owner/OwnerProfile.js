import React, { Component } from 'react';
import { Redirect } from 'react-router';
import './OwnerCss.css';
import { gql, graphql } from 'react-apollo';
import { Query, Mutation } from 'react-apollo';
import { ownerProfilequery } from '../../queries/profileQuery';
import {updateOwnerProfileMutation} from '../../mutations/signupLoginProfileMutations';
import swal from 'sweetalert';
import { Row, Col, Container } from 'react-bootstrap';

export class OwnerProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            owner_name :'',
            owner_email :'',
            owner_id : '',
            owner_address : ''
        };
    }

    changeHandler = (evt) => {
        let target = evt.target;
        let name = target.name;
        let value = target.value;
        this.setState({
            [name] : value
        });
    }

    submitHandler = (owner_id, evt) =>{
        const formData = new FormData(evt.target);
        console.log("owner_id is..", owner_id);
        let data = {
            "owner_id": owner_id, "owner_name": formData.get('owner_name'),
             "owner_email": formData.get('owner_email'), 
            "owner_restName": formData.get('owner_restName'), "owner_restZipcode": formData.get('owner_restZipcode'), 
            "owner_restCuisine": formData.get('owner_restCuisine') 
        };
        this.props.mutate({variables: data }).then( res => {
            console.log(res);
            let {responseMessage} = res.data.updateOwnerProfile;
            swal(responseMessage);
        })
        .catch( err => {
            console.log(err);
        });
    }
    componentDidMount(){

    }
    render(){
        return(
            <Query 
            query={ownerProfilequery}
            variables={{ id: localStorage.getItem('id') }}
        >
        { ({ loading, data }) => {
            debugger;
                if (loading) return <div>Loading profile details!!!</div>;
                if(data) {
                    console.log(data);
                    let owner_id = data.ownerProfile.owner_id;
                    return(
                    <div>
            <div id="grubhubFixedTop" className="fixed-top text-light bg-dark"><h4>GRUBHUB</h4></div>
            <Container>
                <Row className="signup_signin_panel">
                    <Col xs={6} className="card signupsignin-card">
                        <h5 id="updateText">Update Profile</h5>    
                            <hr/>
                        <form onSubmit={(evt) => {evt.preventDefault();this.submitHandler(owner_id, evt);}} name="updateOwner">
                            <div className="form-group">
                                <label className="control-label">Name</label>
                                <input type="text" name="owner_name" required className="form-control" placeholder="Enter your Name" defaultValue={data.ownerProfile.owner_name} onChange = {this.changeHandler}/>
                            </div>
                            <div className="form-group">
                                <label className="control-label">Email</label>
                                <input type="email" name="owner_email" required className="form-control" placeholder="Enter your Email" defaultValue={data.ownerProfile.owner_email} onChange = {this.changeHandler}/>
                            </div>
                            <div className="form-group">
                                <label className="control-label">Restaurant name</label>
                                <input type="text" required name="owner_restName" defaultValue={data.ownerProfile.owner_restName} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label className="control-label">Restaurant zipcode</label>
                                <input type="number" required name="owner_restZipcode" defaultValue={data.ownerProfile.owner_restZipcode} className="form-control"/>
                            </div>
                            <div className="form-group">
                                <label className="control-label">Restaurant Cuisine</label>
                                <input type="text" required name="owner_restCuisine" defaultValue={data.ownerProfile.owner_restCuisine} className="form-control"/>
                            </div>


                            <div className="form-group">
                                <button type="submit" className="btn btn-success">Submit</button>
                            </div>
                        </form>
                    </Col>
                </Row>
            </Container>
            </div>
          )
                }
        }
       }
       </Query>
        )
        
}
}
OwnerProfile = graphql (updateOwnerProfileMutation) (OwnerProfile)
export default OwnerProfile;