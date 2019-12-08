import React, { Component } from 'react';
import '../App.css';
import { Redirect } from 'react-router';

import { graphql } from "react-apollo";
import { signupBuyermutation } from '../mutations/signupLoginProfileMutations';
import swal from 'sweetalert';
import {Container, Row, Col} from 'react-bootstrap';
import {isFieldEmpty} from "./genericapis";

class SignupBuyer extends Component {
    state = {
        // isFaculty: null,
         redirect: false,
         responseMessage : ''
     };

    constructor(props) {
        super(props);
        this.submitHandler = this.submitHandler.bind(this);
    }
        showDisplayMessage=(message)=>{
            console.log("message is...");
            console.log(message);
            if(!isFieldEmpty(message)){
                return(
                    <div className = "form-group">
                            <label>{message} Click <a href="/signin">here</a> to login</label>
                        </div>
                );
            } else {
                return (
                    <div></div>
                );
            }
        }

    submitHandler = async (event) => {
        event.preventDefault();
         const formData = new FormData(event.target);
        let data = { "name": formData.get('name'), "email": formData.get('email'), "password": formData.get('password')};
        console.log(data);
        this.props.mutate({variables: data })
        .then( res => {
            console.log(res);
            let {valid, responseMessage} = res.data.signupBuyer;
            debugger;
            if(valid === "true"){
                swal(responseMessage+"\n Try logging in");
                this.setState({redirect: true, responseMessage : responseMessage});
            } else {
                swal(responseMessage);
            }
            
        })
        .catch( err => {
            console.log(err);
        });
    }

    render() {
        let redirectVar = null;
        if (this.state.redirect === true) {
            redirectVar = <Redirect to="/login" />
        }
        return (
            <div>
            <div id="grubhubFixedTop" className="fixed-top text-light bg-dark"><h4>GRUBHUB</h4></div>
            <Container>
                <Row className="signup_signin_panel">
                    <Col xs={6} className="card signupsignin-card">
                        <h5 id="SignInText">Signup Buyer</h5>    
                            <hr/>
                        <form onSubmit={this.submitHandler} name="signupbuyer">
                            <div className="form-group">
                                <label className="control-label">Name</label>
                                <input type="text" name="name" required className="form-control" placeholder="Enter your Name"/>
                            </div>
                            <div className="form-group">
                                <label className="control-label">Email</label>
                                <input type="email" name="email" required className="form-control" placeholder="Enter your Email"/>
                            </div>
                            <div className="form-group">
                                <label className="control-label"> Password</label>
                                <input type="password" name="password" required className="form-control" placeholder=" Password"/>
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-success">Submit</button>
                            </div>
                            {this.showDisplayMessage(this.state.responseMessage)}
                        </form>
                    </Col>
                </Row>
            </Container>
            </div>
        )
    }
}

SignupBuyer = graphql (signupBuyermutation) (SignupBuyer)
export default SignupBuyer;