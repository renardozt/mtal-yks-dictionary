import React, { Component } from 'react';
import mtal from '../assets/mtal.png';

export default class Home extends Component {
    render() {
        return (
            <div className='home text-center'>
                <img className='mtal-logo my-4' src={mtal} alt="MTAL Logo" />
                <h1>YKS Sözlüğe Hoş Geldiniz!</h1>
                <h4>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nulla magnam earum repellendus ducimus saepe, eaque alias? Nisi deserunt quae fuga optio libero, non doloremque voluptatum, blanditiis magni culpa saepe facere.</h4>
            </div>
        )
    }
}