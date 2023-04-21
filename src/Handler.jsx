import React, { Component } from 'react';
import { Outlet } from 'react-router-dom';
import {
    Navbar
} from './Parts';

export default class Handler extends Component {
    render() {
        return (
            <div className='handler'>
                <Navbar />
                <div className='panel'>
                    <Outlet />
                </div>
            </div>
        )
    }
}