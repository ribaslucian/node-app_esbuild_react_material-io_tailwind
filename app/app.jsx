// React
import * as React from 'react'
import ReactDOM from 'react-dom'

// import "./app.scss";

const element = <h1>Hello world, react</h1>;
ReactDOM.render(element, document.getElementById('root'));



// Material TextField
import {MDCTextField} from '@material/textfield';
const textField = new MDCTextField(document.querySelector('.mdc-text-field'));


// MUI Components
import './MUIButton';

// const welcome = <Welcome name="Sara" />;

// ReactDOM.render(
//   welcome,
//   document.getElementById('mui')
// );

// const muiButton = <MUIButton />;
// ReactDOM.render(muiButton, document.getElementById('mui'));
