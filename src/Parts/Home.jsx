import React, { Component } from 'react';
import mtal from '../assets/mtal.png';

export default class Home extends Component {
    render() {
        return (
            <div className='home text-center'>
                <img className='mtal-logo my-4' src={mtal} alt="MTAL Logo" />
                <h1>YKS Sözlüğe Hoş Geldiniz!</h1>
                <h4>Bu sözlük, YKS yoğunluklu kelimeleri içermektedir. Öğrenciye yönelik gerçekleştirilmiş bu proje Mümtaz Turhan Proje Anadolu Lisesi tarafından TÜBİTAK adına yapılmıştır. Unutmayın, sözcüklerin tanımları ve örnekleri için TDK sözlüğü kullanılmaktadır.</h4>
            </div>
        )
    }
}