import React, { Component } from 'react';
import logo from './logo.svg';
import './css/Enunciado.css';
import Registro from './Registro';
import {BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";
import Header from './Header';
import Home from './Home';
import axios from 'axios';
import {FormGroup, ControlLabel, FormControl, HelpBlock, Navbar, NavItem, MenuItem, NavDropdown, Nav} from "react-bootstrap"
var CodeMirror = require('../src/codemirror/CodeMirror.js');
const createReactClass = require('create-react-class');

require('codemirror/lib/codemirror.css');
require('codemirror/mode/python/python');
require('codemirror/mode/xml/xml');
require('codemirror/mode/markdown/markdown');
var defaults = {
	C: '# Heading\n\nSome **bold** and _italic_ text\nBy [Jed Watson](https://github.com/JedWatson)',
	python: '#Python 2.7'
};

class Enunciado extends Component {
    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.updateCode = this.updateCode.bind(this); 
        this.changeMode = this.changeMode.bind(this);
        this.limpiarValores = this.limpiarValores.bind(this);
        this.toggleReadOnly = this.toggleReadOnly.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.addClick = this.addClick.bind(this);
        this.removeClick = this.removeClick.bind(this);


        this.state = {
            isLoading: true,
            nameSolution:"",
            nameStatement: "",
            text:"",
            code: "",
			readOnly: false,
			mode: {name: "python",
            version: 2.7,
            singleLineStringErrors: false},
            lineNumbers: true,
            indentUnit: 4,
            matchBrackets: true,
            sections: [],
            values: [],
            sectionName: "",
            header: "",

        };
    }
    createUI(){
        return this.state.values.map((el, i) => 
            <div key={i}>
               <input type="text" value={el||''} onChange={this.handleChange.bind(this, i)} />
               <input type='button' value='Remover' onClick={this.removeClick.bind(this, i)}/>
            </div>          
        )
     }
   
     handleChange(i, event) {
        let values = [...this.state.values];
        values[i] = event.target.value;
        this.setState({ values });
        console.log(i, values[i])
     }
     
     addClick(){
       this.setState(prevState => ({ values: [...prevState.values, '']}))
     }
     
     removeClick(i){
        let values = [...this.state.values];
        values.splice(i,1);
        this.setState({ values });
     }
    componentDidMount(){
        if(this.props.typeUser===2){
        fetch('http://localhost:8081/sections/allSection')
            .then(response => response.json())
            .then(data => this.setState({sections: data, isLoading: false}))
            .then(this.setState({
                isLoading: false,
                nameSolution:"",
                text:"",
                code: defaults.python,
                readOnly: false,
                mode: {name: "python",
                   version: 3,
                   singleLineStringErrors: false},
                
    
            }));
        }
        else if(this.props.typeUser===3){
            fetch('http://localhost:8081/sections/search/profesor/'+this.props.activeUser.idUser)
            .then(response => response.json())
            .then(data => this.setState({sections: data, isLoading: false, sectionName: data.idSection}));
        }
        else{
            return;
        }
        }
    subirFormulario(e) {
        console.log("formulario enviado c:");

        var statement = {section: "", nameStatement: "", text: "", code: ""}
        var testCases = [];
        statement.nameStatement = e.nameStatement;
        statement.text =e.text;
        testCases = e.values;
        statement.header = '\"'+e.code+'\"';
        console.log("texto en codemirror: "+ statement.header)
        statement.section = e.sectionName;
        console.log("Datos seccion: " + statement.section)

        if(statement.nameStatement==="" || statement.text ==="" ||statement.section==="" || statement.header==="" ||testCases===[]){
            console.log("Debe llenar todos las casillas");
            return;
        }
        else{
            if(this.props.typeUser===2){
            this.limpiarValores(1);
            }
            else{
            this.limpiarValores(2);

            }
            console.log("Usuario: "+ statement);
            console.log("Datos: "+ statement.nameStatement);
            console.log("Datos: "+ statement.text);
            //console.log("Datos: "+ statement.section.idSection + "uwu" + statement.section.nameSection);
            console.log("Datos: "+ statement.header);
            console.log("Datos: "+ testCases);
            console.log("Datos seccion: " + statement.section)
            //testCases.forEach(element => {
            //    console.log("uguu" + element);
            //});
            let axiosConfig = {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    "Access-Control-Allow-Origin": "http://localhost:3000",
                    "Access-Control-Allow-Methods": "POST",
                }
                

              };
            //fetch('http://localhost:8081/api/statements/add?statementName='+statement.nameStatement+'&statementText='+statement.text+'&section='+statement.section+'&header='+statement.header)
           //.then(response => console.log("Producto Agregado"+response)) 
            axios.post('http://localhost:8081/api/statements/add?statementName='+statement.nameStatement+'&statementText='+statement.text+'&section='+statement.section+'&header='+statement.header,axiosConfig)
            .then(function(response) {
            console.log(response);
            }) .catch(function (error) {
            console.log(error);
            });
            /*axios({
                method: 'post',
                url: 'http://localhost:8081/api/statements/add',
                data: {
                    statementName: statement.statementName,
                    text:statement.header,
                    section: statement.section,
                    header: statement.header,

                },
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    "Access-Control-Allow-Origin": "http://localhost:3000",
                    "Access-Control-Allow-Methods": "POST",
                },
             });*/
            //axios.post('http://localhost:8081/api/statements/add',axiosConfig)
            //.then(function(response) {
            //console.log(response);
            //}) .catch(function (error) {
            //console.log(error);
            //});
            }
       
        return;
        }
    limpiarValores(i){
        
        if(i===1){
            this.setState({sectionName: "", nameStatement: "", text: "", values: [], code: ""});
            this.render();
        }
        else{
            this.setState({nameStatement: "", text: "", values: [], code: ""});

        }
    
    }
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name; 
        this.setState({
            [name]: value
            });
        console.log(name, value, target);
        }
        getInitialState () {
            return {
                code: "",
                readOnly: false,
                mode: {name: "python",
               version: 3,
               singleLineStringErrors: false},
            };
        }
        updateCode (newCode) {
            this.setState({
                code: newCode
            });
            console.log(this.state.code);
        }
        changeMode (e) {
            var mode = e.target.value;
            this.setState({
                mode: mode,
                code: defaults[mode]
            });
        }
        toggleReadOnly () {
            this.setState({
                readOnly: !this.state.readOnly
            }, () => this.refs.editor.focus());
        }


        render() {
            const typeUser = this.props.typeUser;
            const activeUser = this.props.activeUser;
            const isLoading = this.state.isLoading;
            var options = {
                lineNumbers: true,
                readOnly: this.state.readOnly,
                mode: this.state.mode
            };
            const sections = this.state.sections;
            console.log("secciones enunciado: ")
            console.log(sections)
            if(isLoading){
                return <p> Cargando...</p>;
            }
            if(typeUser==2){
                return (
                <body className="body">
                    <form className="form1">
                    <div className="div1">
                    <label className="label1"> Nombre Enunciado:  </label>
                    </div>
                    <div className="div1">
                        <input className="input" name= "nameStatement" type = "text" value={this.state.nameStatement}
                        onChange = {this.handleInputChange} />
                    </div>
                    <div className="div1">
                    <label className="label2"> Enunciado:  </label>
                    </div>

                    {this.createUI()}        
          <input type='button' value='Agregar Caso de Prueba' onClick={this.addClick.bind(this)}/>
                    
                    
                    <div className="div2">
                        
                        <textarea className="text" name= "text" type = "text" value={this.state.text} 
                        onChange = {this.handleInputChange} />
                    </div>
                    <div className="div6"> <label className="label3"> Seccion:  </label></div>

                    <div className="div6">
                        <select name="sectionName" component="select" onChange = {this.handleInputChange}>
                        <option > </option>
                        {sections.map((section) =>
                    <option key={section.idSection} value={section.idSection}>{section.sectionName}</option>
                        )}
                        
                        </select>
                    </div>

                    <div className="div2">
                    <label className="labels"> Cabecera Propuesta:  </label>
                    </div>
                   
                    <div className="div3">
				<CodeMirror className="codemirror" ref="editor" value={this.state.code} onChange={this.updateCode} options={options} autoFocus={true} />
				<div style={{ marginTop: 10 }} className="div4">
					<select onChange={this.changeMode} value={this.state.mode}>
						<option value="python">Python</option>
						<option value="C">C</option>
                        <option value="java">Java</option>
					</select>
				</div>
			</div>

                    <div className="div3">
                      <button type="button" onClick={(e) => this.subirFormulario(this.state)}>Subir Enunciado</button>
                      <button type="button" onClick={(e) => this.limpiarValores(1)}>Limpiar Casillas</button>
                    </div>
                  </form>
                </body>
                    
                );
            }
            else if(typeUser ===3){

                return (
                    <body className="body">
                        <form className="form1">
                        <div className="div1">
                        <label className="label1"> Nombre Enunciado:  </label>
                        </div>
                        <div className="div1">
                            <input className="input" name= "nameStatement" type = "text" value={this.state.nameStatement}
                            onChange = {this.handleInputChange} />
                        </div>
                        <div className="div1">
                        <label className="label2"> Enunciado:  </label>
                        </div>
    
                        {this.createUI()}        
              <input type='button' value='Agregar Caso de Prueba' onClick={this.addClick.bind(this)}/>
                        
                        
                        <div className="div2">
                            
                            <textarea className="text" name= "text" type = "text" value={this.state.text} 
                            onChange = {this.handleInputChange} />
                        </div>
                        <div className="div6"> <label className="label3"> Seccion:  </label></div>
    
                        <div className="div6">
                            <input name="sectionName" type= "number" value={this.state.sections.idSection} disabled = "true" hidden="true" onChange = {this.handleInputChange}/>      
                       
                        </div>
                        <div className="div6">
                        <input name= "placeholder" value={this.state.sections.sectionName} disabled = "true" />
                        </div>
                        <div className="div2">
                        <label className="labels"> Cabecera Propuesta:  </label>
                        </div>
                       
                        <div className="div3">
                    <CodeMirror className="codemirror" ref="editor" value={this.state.code} onChange={this.updateCode} options={options} autoFocus={true} />
                    <div style={{ marginTop: 10 }} className="div4">
                        <select onChange={this.changeMode} value={this.state.mode}>
                            <option value="python">Python</option>
                            <option value="C">C</option>
                            <option value="java">Java</option>
                        </select>
                    </div>
                </div>
    
                        <div className="div3">
                          <button type="button" onClick={(e) => this.subirFormulario(this.state)}>Subir Enunciado</button>
                          <button type="button" onClick={(e) => this.limpiarValores(2)}>Limpiar Casillas</button>
                        </div>
                      </form>
                    </body>
                        
                    );
            }
            else{
                alert("No posee permisos para acceder a esta vista")
                return(
                    <div> {this.props.history.push("/")} </div>
                );
            }
            }
          }
    
    
    export default Enunciado;