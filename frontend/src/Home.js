import React, { Component } from 'react';
import logo from './logo.svg';
import './css/Home.css';
import Registro from './Registro';
import {Router as Redirect, Router, Route, Link, Switch} from "react-router-dom";
import Header from './Header';
import {Avatar, RaisedButton} from "material-ui";
import {logout} from "./firebase/auth";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import injectTapEventPlugin from "react-tap-event-plugin";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import createBrowserHistory from "history/createBrowserHistory";
import Login2 from './Login2';
import Solucion from './Solucion';
import App from './App';
import { PropTypes } from 'react';
import axios from 'axios';

const muiTheme = getMuiTheme({
  appBar: {
      color: "#37517E",
      height: 50
  },
});

const appTokenKey = "appToken"; // also duplicated in Login.js
export default class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            firebaseUser: JSON.parse(localStorage.getItem('user')),
            userLogged: false,
            name:"",
            userPlaceHolder: null,
            user: {career: "", correo: "", idUser: "", section:"", userName:"", userType:""},
            bool: "",
            state:"",
        };
        if(this.state.firebaseUser!=null){
            console.log("User:", this.state.firebaseUser.displayName);
        }
        this.handleLogout = this.handleLogout.bind(this);

    }

    handleLogout() {
        console.log("deslogueando uwu")
        logout().then(function () {
            localStorage.removeItem(appTokenKey);
            localStorage.removeItem("user");
            localStorage.removeItem("activeUserObject");
            this.props.callbackFromParentHome(this.state.userLogged);
            this.setState({userLogged: false, firebaseUser: ""});
            this.props.history.push("/frontendGrupo5/Login2");
            console.log("user signed out from firebase");
            localStorage.clear();
            window.localStorage.clear(); 

        }.bind(this));
    }
    componentDidMount(){
        if(this.state.firebaseUser!==null){
            this.setState({userLogged: true, name: this.state.firebaseUser.displayName})
        }
        else{
            return this.props.history.push("/frontendGrupo5/Login2")
        }
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET",
            }
          };
          var email = this.state.firebaseUser.email;
          var self = this;
          axios.get('http://209.97.152.30:8080/backendGrupo5/users/searchbyEmail/'+email, axiosConfig)
          .then((response) => {
            this.setState({state: response.data, bool: true});
            console.log("RESPONSE: " + response.data);
          }).catch((error) => {
            console.log(error);
            this.setState({bool: false})
          });


    }
    

    render() {
        console.log("USUARIO LOGUEADO");
        console.log(JSON.parse(localStorage.getItem("user")));
        console.log("USUARIO LOGUEADO");
        console.log("DSADSADASDSADDD")
        const userEmail = this.state.state.correo;
        const bool = this.state.bool;
        if(bool===true){
            return (
                <body className="body">
                    <div className = "div1">
                        <h1 className = "h">Home</h1>
                        <div className = "div2">
                        </div>
                        
                        <h3 className = "h">Bienvenido {this.state.name}</h3>
                
                        <div className = "div3">
                            <RaisedButton className = "button"
                                backgroundColor="#a4c639"
                                labelColor="#ffffff"
                                label="Sign Out"
                                onClick={(e) => this.handleLogout()}
                            />
                        </div>
                    </div>
                </body>
            );
        }
        else if(bool===false){
            alert("No se encuentra registrado, sera regresado al login");

            return(
                <div> {this.handleLogout()} </div>
            );
        }
        else{
            return(
                <p> loading... </p>
                );
        }
       
    }
}
