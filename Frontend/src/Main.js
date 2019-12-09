import React, {Component} from 'react';
import {Route} from 'react-router-dom';
//import SignIn from './components/SignIn.js';
import SignupBuyer from './components/SignupBuyer.js';
import SignupOwner from './components/SignupOwner.js';
import SignIn from './components/SignIn.js';
import GrubhubHome from './components/GrubhubHome.js';
import {OwnerHome} from './components/owner/OwnerHome';
//import {BuyerHome} from './components/buyer/BuyerHome';
import {BuyerProfile} from './components/buyer/BuyerProfile';
import {OwnerProfile} from './components/owner/OwnerProfile';



//Create a Main Component
/*
<Route path="/signin" component={SignIn}/>
                <Route path="/signupbuyer" component={SignupBuyer}/>
                <Route path="/signupowner" component={SignupOwner}/>
               
*/
export class Main extends Component {
    render(){
        console.log("react version...");
        console.log(React.version);
        return(
            <div>
                {/*Render Different Component based on Route*/}
                <Route exact path="/" component={GrubhubHome}/>
                <Route path="/signupbuyer" component={SignupBuyer}/>
                <Route path="/signupowner" component={SignupOwner}/>
                <Route path="/signin" component={SignIn}/>
                <Route path="/owner/ownerHome" component={OwnerHome}/>
                
                <Route path="/buyerProfile" component={BuyerProfile}/>
                <Route path="/ownerProfile" component={OwnerProfile}/>

               
            </div>
        );
    }
}
//Export The Main Component
export default Main;
