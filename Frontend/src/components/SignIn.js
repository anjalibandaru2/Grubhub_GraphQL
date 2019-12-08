import React,{Component} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Col, Card} from 'react-bootstrap';
//import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect}  from 'react-router';
import {RedirectToOwnerHome, RedirectToBuyerHome, getUserType, redirectToUserHome} from "./genericapis.js";
import { graphql } from "react-apollo";
import { signInMutation } from '../mutations/signupLoginProfileMutations';
import {isFieldEmpty} from "./genericapis";


class SignIn extends Component{
    state={
        message : "",
        submitHandler : ""
    }
    constructor(props){
        super(props);
        this.state.message = "";
        this.submitHandler = this.submitHandler.bind(this);
    }
    async submitHandler(evt){
        evt.preventDefault();
        console.log(evt.target);
        var formData = new FormData(evt.target);
        let data = { "email": formData.get('email'), "password": formData.get('password'), "userType" : formData.get('userType')};
        this.props.mutate({variables: data }).then(res => {
            console.log(res);
                
            if(!res.data.login.isValidUser){
                this.setState({ displayErrorMessage: true});
            }
            else{
                localStorage.setItem("user_type", res.data.login["user_type"]);
                localStorage.setItem("name", res.data.login.name);
                localStorage.setItem("id", res.data.login.id);
                swal(res.data.login.responseMessage);
            }
            
        })
        .catch(err => {
            console.log(err);
        });
    }
    render(){
        var redirectVar = "";
        console.log("in login JSX...")
        console.log(cookie.load('user_type'));
        console.log(cookie.load('owner_id'));
        console.log(cookie.load('buyer_id'));
        console.log(cookie.load('name'));
        debugger;
        let userType = getUserType();
        if(userType == "owner"){
            redirectVar = <RedirectToOwnerHome/>;
        } else   if(userType == "buyer"){
            redirectVar = <RedirectToBuyerHome/>;
            //redirectVar = <Redirect to="/buyer/buyerHome"/>;
        }
       // redirectVar = redirectToUserHome();
        console.log(redirectVar);
        return(
            <div>
            <div id="grubhubFixedTop" className="fixed-top text-light bg-dark"><h4>GRUBHUB</h4></div>
            <Container>
            {redirectVar}
                <Row className="signup_signin_panel">
                    <Col xs={6} className="card" >
                        
                    </Col>
                    <Col xs={6} className="card signupsignin-card">
                        <h5 id="SignInText">Sign in</h5>    
                        <hr/>
                        <form onSubmit={this.submitHandler}>
                            <div className="form-group">
                                <label className="control-label">Email</label>
                                <input type="email" name="email" required className="form-control" placeholder="Enter your Email"/>
                            </div>
                            <div className="form-group">
                                <label className="control-label">Password</label>
                                <input type="password" name="password" required className="form-control" placeholder=" Password"/>
                            </div>
                            <div className="form-group">
                                <div className="radio">
                                    <label><input type="radio" name="userType" value="owner" defaultChecked/>Restaurant Owner</label>
                                </div>
                                <div className="radio">
                                    <label><input type="radio" name="userType" value="buyer"/>Buyer</label>
                                </div>
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-success">Submit</button>
                            </div>
                           <div className="float-left">
                            <a href="/signupowner">Create owner account</a> 
                           </div>
                           <div className="float-right">
                           <a href="/signupbuyer" >Create buyer account</a>
                           </div>
                           
                        </form>
                    </Col>
                </Row>
            </Container>
            </div>
        );
    }
    
}

SignIn = graphql (signInMutation) (SignIn)
export default SignIn;