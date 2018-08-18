import React, { Component } from 'react';
import logo from './logo.svg';
import './css/Enunciado.css';
import Registro from './Registro';
import {BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";
import Header from './Header';
import Home from './Home';
import qs from 'qs';
import axios from 'axios';
import {Button, FormGroup, ControlLabel, FormControl, HelpBlock, Navbar, NavItem, MenuItem, NavDropdown, Nav} from "react-bootstrap"
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

class MostrarSolucion extends Component {
    constructor(props) {
        super(props);

        this.changeMode = this.changeMode.bind(this);
        this.state = {
            isLoading: false,
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
            solution: "",
            salida: "",
            salida1: "",
            salida2: "",
            salida3: "",
            salida4: "",
            name: "",
            start: "",
            nTest: "",
            sTest: "",

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
     componentWillReceiveProps(){
        this.setState({
                isLoading: false,
                nameSolution:"",
                code: this.props.solution.solutionText,
                readOnly: false,
                mode: {name: "python",
                   version: 3,
                   singleLineStringErrors: false},
    
            });
        //this.cm.codeMirror.setValue(this.props.statement.header)
     }
     componentDidUpdate(){
            this.cm.codeMirror.setValue(this.props.solution.solutionText)
    }
    componentDidMount() {
            
            this.setState({        
                name: "python"
            });
        }   

     getInitialState () {
            return {
                code: this.props.statement.header,
                nameStatement: this.props.statement.nameStatement,
                text: this.props.statement.statementText,
                sectionName: this.props.statement.section.sectionName,
                readOnly: true,
                mode: {name: "python",
               version: 3,
               singleLineStringErrors: false},
            };



        }
    changeMode (e) {
            var mode = e.target.value;
            this.setState({
                mode: mode,
                name: e.target.value,
            });
            console.log(this.state.name)
        }
    mostrarFeedback(e)
        {
            this.solution = {code: "", lang: ""}   
            this.solution.code = e.code;
            this.solution.lang = e.name;
            var algo = {code: "", lang: ""}
            algo.code = "print(33)";
            algo.lang = "python";
            var code = e.code;
            var bodyFormData = new FormData();
            bodyFormData.set('code', e.code);
            bodyFormData.set('lang',e.name);
            axios({
                    method: 'post',
                    url: 'http://209.97.152.30:8080/backendGrupo5/api/compiler/checkCode',
                    data: qs.stringify(this.solution),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        "Access-Control-Allow-Origin": "http://localhost:3000",
                        "Access-Control-Allow-Methods": "POST",
                    },
                    }).then(response => this.setState({salida3: response.data}));
        }
    checkSolutions(e){
        this.mostrarFeedback(e)
        var expected = [];
        var test_cases = [];
        this.props.statement.testCases.map((test) =>
             test_cases.push(test.testCase)   )
        this.props.statement.expectedSolution.map((test) =>
             expected.push(test.expectedSolution)   )
        console.log("DENTRO CHECK SOLUTIONS c:")
        console.log(expected)
        console.log(test_cases)

        this.solution = {code: "", lang: "", expectedSolution: [], testCases: []}
        var lang = "python";
        this.solution.code = this.props.solution.solutionText;
        this.solution.lang = e.name;
        this.solution.expectedSolution = expected;
        this.solution.testCases = test_cases;
        var bodyFormData = new FormData();
        bodyFormData.set('code', this.props.solution.solutionText);
        console.log(this.props.solution.solutionText)
        bodyFormData.set('lang', e.name);
        var i = 0;
        for(i = 0; i<expected.length;i++){
            bodyFormData.append('expectedSolution', expected[i]);
        }
        for(i = 0; i<test_cases.length;i++){
            bodyFormData.append('testCases', test_cases[i]);    
        }
        
        console.log("DATOS MANDADOS EN CHECK SOLUTIONS: ")
        console.log(bodyFormData)
            axios({
                method: 'post',
                url: 'http://209.97.152.30:8080/backendGrupo5/api/compiler/checkSolutions',
                data: bodyFormData,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    "Access-Control-Allow-Origin": "http://209.97.152.30:5050",
                    "Access-Control-Allow-Methods": "POST",
                },
             }).then(response => this.setState({salida4: response.data[0], nTest:response.data[1], sTest: response.data[2]}));    
    }

     
     


        render() {
            const solution = this.props.solution;
            const statement = this.props.statement;
            //const header = this.props.statement.header.split("\"");
      
            var options = {
                lineNumbers: true,
                readOnly: true,
                mode: this.state.mode
            };
                return (
                <body className="body">
                    <form className="form1">
                    <div className="div1">
                    <label className="label1"> Nombre Solucion:  </label>
                    </div>
                    <div className="div1">
                        <input className="input" name= "solutionName" type = "text" value={solution.solutionName}
                        disabled = "true"/>
                    </div>
                    <div className="div1">
                    <label className="label2"> Solucion:  </label>
                    </div>
                    
                    <div className="div1">
                    <label className="label2"> Nombre Enunciado:  </label>
                    </div>

                    <div className="div2">
                        
                        <textarea className="input" name= "text" type = "text" value={solution.statement.statementName} 
                        disabled = "true"/>
                    </div>
                     <div className="div1">
                    <label className="label2"> Enunciado:  </label>
                    </div>

                    <div className="div2">
                        
                        <textarea className="input" name= "text" type = "text" value={solution.statement.statementText} 
                        disabled = "true"/>
                    </div>
                    <div className="div1">
                    <label className="label2"> Nombre Usuario:  </label>
                    </div>
                    <div className="div1">
                        <input className="input" name= "solutionName" type = "text" value={solution.user.userName}
                        disabled = "true"/>
                    </div>
                    <div className="div1">
                    <label className="label1"> Seccion:  </label>
                    </div>
                    <div className="div1">
                        <input className="seccion" name= "nameStatement" type = "text" value={statement.section.sectionName}
                         disabled = "true"/>
                    </div>

                    <div className="div2">
                    <label className="labels"> Cabecera Propuesta:  </label>
                    </div>
                   
                    <div className="div3">
				<CodeMirror className="codemirror" ref={el => this.cm = el} value={solution.solutionText} options={options} autoFocus={true} />
		          <div style={{ marginTop: 10 }} className="div4">
                <div className="div1">
                    <label className="labels"> Lenguaje de la Solución:  </label>
                    
                        <select onChange={this.changeMode} value={this.state.name}>
                            <option value="python">Python</option>
                            <option value="c">C</option>
                            <option value="java">Java</option>
                        </select>
                    </div>
                </div>
			</div>
                  </form>
                  <div>
                  <Button type="button" bsStyle="info" onClick={(e) => this.checkSolutions(this.state) }>Ejecutar Solucion</Button>
                  </div>
                  <div className="div1">
                <label classname="labels"> Feedback de la solución propuesta: </label>
            </div>
            <div class="divTxt">
                <pre class="gb wf" id="preOutput">
                {this.state.salida3}
                </pre>
            </div>
            <div class="divTxt">
                <pre class="gb wf" id="preOutput">
                {this.state.salida4}
                </pre>
            </div>
            <div class="divTxt">
                <pre class="gb wf" id="preOutput">
                N° casos de prueba: {this.state.nTest}
                </pre>
            </div>
            <div class="divTxt">
                <pre class="gb wf" id="preOutput">
                Casos de prueba exitosos: {this.state.sTest}
                </pre>
            </div>
            <div class="divTxt">
                <pre class="gb wf" id="preOutput">
                Porcentaje exito: {100*this.state.sTest/this.state.nTest}%
                </pre>
            </div>
                </body>
                    
                );
            }
          }
    
    
    export default MostrarSolucion;