import React,{Component} from "react";
import {getOwnerID} from "./genericapis.js";
import axios from 'axios';
import {addItemToSection} from '../../mutations/signupLoginProfileMutations';
const settings = require("../config/settings.js");

export class ModalDialog extends Component{
    state={
        item_name : "",
        item_description : "",
        item_price : "",
        section_type : "",
        modalId : ""
    }
    constructor(props){
        super(props);
        this.state.modalId = this.props.id;
        this.state.item_name = "";
        this.state.item_description = "";
        this.state.item_price = "";
        this.state.section_type = this.props.section_type;
        this.handleInputChange = this.handleInputChange.bind(this);
        this.submitClickHandler = this.submitClickHandler.bind(this);
    }
    handleInputChange(evt){
        var name = evt.target.name;
        var value = evt.target.value;
        this.setState({
            [name] : value
        })
    }
    renderModalBody(){
     
            return(
                <form id={this.props.id} onSubmit={this.submitClickHandler} encType="multipart/form-data">
                    <div className="form-group">
                        <input type="text" required className="form-control" placeholder="Item Name" value={this.props.item_name} name="item_name" onChange={this.handleInputChange}/>
                    </div>
                    <div className="form-group">
                        <input type="text" required className="form-control" placeholder="Item Description" value={this.props.item_description} name="item_description" onChange={this.handleInputChange}/>
                    </div>
                    <div className="form-group">
                        <input type="number" required className="form-control" placeholder="Item Price" value={this.props.item_price} name="item_price" onChange={this.handleInputChange}/>
                    </div>
                    
                    <div className="modal-footer">
                    <button type="submit" className="btn btn-success">Submit</button>
                    <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
                </div>
                </form>
            )
    }
    submitClickHandler=async(evt)=>{
        axios.defaults.withCredentials = true;
        let {item_name, item_description, item_price, section_type} =this.state;
        evt.preventDefault();
        let owner_id = getOwnerID();
        let form_data = new FormData();
        form_data.set('owner_id', owner_id);
        form_data.set('item_name',item_name);
        form_data.set("item_description", item_description);
        form_data.set('item_price',item_price);
        form_data.set("section_type", section_type);
        // this.props.addItemToSection(form_data);
        this.props.mutate({variables:data});
        window.$("#"+this.state.modalId).modal('hide');
    }
    render(){
        var modalId = this.props.id;
        var btnTarget = "#" + modalId;
        return(
            <div>
                <button type="button" className="btn btn-success float-right" data-toggle="modal" data-target={btnTarget}>
                    {this.props.btnName}
                </button>
            <div className="modal" id={modalId}>
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h4 className="modal-title">Add an Item</h4>
                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                </div>
                <div className="modal-body">
                    {this.renderModalBody()}
                </div>
                
                </div>
            </div>
            </div>
        </div>
        )
    }
           
}

ModalDialog = graphql (addSection) (ModalDialog)
export default ModalDialog;