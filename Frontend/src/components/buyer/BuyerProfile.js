import React, { Component } from 'react';
import { Redirect } from 'react-router';
import './buyerHome.css';
import { gql, graphql } from 'react-apollo';
import { Query, Mutation } from 'react-apollo';
import { buyerProfilequery } from '../../queries/profileQuery';
import {updateBuyerProfileMutation} from '../../mutations/signupLoginProfileMutations';
import swal from 'sweetalert';
import { Row, Col, Container } from 'react-bootstrap';

export class BuyerProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buyer_name :'',
            buyer_email :'',
            buyer_id : '',
            buyer_address : ''
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

    submitHandler = (buyer_id, evt) =>{
        const formData = new FormData(evt.target);
        console.log("buyer_id is..", buyer_id);
        let data = {
            "buyer_id": buyer_id, "buyer_name": formData.get('buyer_name'),
            "buyer_address": formData.get('buyer_address'), "buyer_email": formData.get('buyer_email')
        };
        this.props.mutate({variables: data }).then( res => {
            console.log(res);
            let {responseMessage} = res.data.updateBuyerProfile;
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
            query={buyerProfilequery}
            variables={{ id: localStorage.getItem('id') }}
        >
        { ({ loading, data }) => {
            debugger;
                if (loading) return <div>Loading profile details!!!</div>;
                if(data) {
                    console.log(data);
                    let buyer_id = data.buyerProfile.buyer_id;
                    return(
                    <div>
            <div id="grubhubFixedTop" className="fixed-top text-light bg-dark"><h4>GRUBHUB</h4></div>
            <Container>
                <Row className="signup_signin_panel">
                    <Col xs={6} className="card signupsignin-card">
                        <h5 id="updateText">Update Profile</h5>    
                            <hr/>
                        <form onSubmit={(evt) => {evt.preventDefault();this.submitHandler(buyer_id, evt);}} name="signupbuyer">
                            <div className="form-group">
                                <label className="control-label">Name</label>
                                <input type="text" name="buyer_name" required className="form-control" placeholder="Enter your Name" defaultValue={data.buyerProfile.buyer_name} onChange = {this.changeHandler}/>
                            </div>
                            <div className="form-group">
                                <label className="control-label">Email</label>
                                <input type="email" name="buyer_email" required className="form-control" placeholder="Enter your Email" defaultValue={data.buyerProfile.buyer_email} onChange = {this.changeHandler}/>
                            </div>
                            <div className="form-group">
                                <label className="control-label">Address</label>
                                <input type="text" name="buyer_address" required className="form-control" placeholder="Enter your Address" defaultValue={data.buyerProfile.buyer_address} onChange = {this.changeHandler}/>
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
BuyerProfile = graphql (updateBuyerProfileMutation) (BuyerProfile)
export default BuyerProfile;