import React, { Component } from 'react';
import $ from 'jquery';
import axios from 'axios';

export default class Word extends Component {

    constructor(props) {
        super(props);

        this.state = {
            word: '',
            meanings: [],
            proverbs: [],
            error: false,
        }
    }

    componentDidMount() {
        this.getMeanings();
        $(document).on('click', 'a', () => {
            this.forceUpdate();
            this.getMeanings();
        });
    }

    async getMeanings() {
        $('.word .loader').stop().fadeIn('fast');
        const word = this.getQuery().q;
        const req = await axios.get(`https://sozluk.gov.tr/gts?ara=${decodeURI(word)}`)
            .catch(() => this.setState({
                word, error: true, meanings: [], proverbs: []
            }, () => {
                $('.word .loader').stop().fadeOut('slow');
                $('.panel').css('overflow-y', 'auto');
            }));

        if (!req) return;
        if (!!req.data.error || !word) {
            this.setState({ error: !word, word, meanings: [], proverbs: [] });
            $('.word .loader').stop().fadeOut('slow');
            $('.panel').css('overflow-y', 'auto');
            return;
        }

        this.setState({
            word,
            error: false,
            meanings: req?.data[0]["anlamlarListe"] || [],
            proverbs: req?.data[0]["atasozu"] || []
        }, () => {
            $('.word .loader').stop().fadeOut('slow');
            $('.panel').css('overflow-y', 'auto');
        });
    }

    getQuery() {
        var url = document.location.href;
        var qs = url.substring(url.indexOf('?') + 1).split('&');
        for (var i = 0, result = {}; i < qs.length; i++) {
            qs[i] = qs[i].split('=');
            result[qs[i][0]] = decodeURIComponent(qs[i][1]);
        }
        return result;
    }

    render() {
        return (
            <div className='word'>
                <h1 className='text-center'>{this.state.error || (!this.state.word && this.state.word != '') ? 'HATA!' : this.state.word == '' ? 'Yükleniyor...' : `Kelime: ${this.state.word}`}</h1>
                <div className='loader'>
                    <div className="wrapper">
                        <div className="circle"></div>
                        <div className="circle"></div>
                        <div className="circle"></div>
                        <div className="shadow"></div>
                        <div className="shadow"></div>
                        <div className="shadow"></div>
                    </div>
                </div>
                {((this.state.error || this.state.meanings.length === 0) && this.state.word != '') &&
                    <div className='error text-center'>
                        <h4>{this.state.error ? 'Kelime bilgileri alınırken bir şeyler ters gitti.' : 'HATA: Bu kelime TDK sözlüğünde bulunamadı. Lütfen başka bir kelime aratmayı deneyin.'}</h4>
                        {this.state.error && <button onClick={() => this.getMeanings()} className='mt-2'>Tekrar dene</button>}
                    </div>
                }
                {this.state.meanings.length > 0 && <h2>Anlamlar</h2>}
                <ul className='meanings'>
                    {this.state.meanings?.map((m, index) => <li key={index} className='mb-4'>
                        <h5>{m?.anlam}</h5>
                        {m?.orneklerListe?.length > 0 && <h6><span>Örnek: </span>{m?.orneklerListe[0]?.ornek}</h6>}
                    </li>)}
                </ul>
                {this.state.proverbs?.length > 0 &&
                <div>
                    <h2>Atasözleri & Deyimler</h2>
                    <ul className='proverbs'>
                        {this.state.proverbs?.map((p, index) =>
                            <li key={index}>{p?.madde}</li>
                            )}
                    </ul>
                </div>}
            </div>
        )
    }
}