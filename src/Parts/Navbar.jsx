import React, { Component } from 'react';
import words from '../words.json';
import mtal from '../assets/mtal.png';
import $ from 'jquery';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            menu: false,
            words: words,
        }
    }

    componentDidMount() {
        this.searchWord();
        $(document).on('keyup', (e) => e.key === 'Enter' ? this.searchButton(e) : this.searchWord());
        $('html').attr('theme', localStorage.getItem('theme') || 'light');
        $(window).width() >= 768 ? $('#menu').css('display', 'none') : $('#menu').css('display', 'block')
        $(window).on('resize', () => {
            $('#menu').css('display', $(window).width() >= 768 ? 'none' : 'block');
            $('.search-area').css('display', $(window).width() >= 768 || this.state.menu ? 'block' : 'none');
            $('.main').css('display', $(window).width() >= 768 ? 'block' : this.state.menu && 'none');
            $('.words').css('display', $(window).width() >= 768 ? 'block' : this.state.menu || 'none');
        })
    }

    searchWord() {
        const filter = [
            ["â", "a"],
            ["û", "u"],
            ["î", "i"]
        ]

        const search = $('.navbar .search')
            .val()
            .toLocaleLowerCase('tr-TR');

        const filtered = words.filter(w => {
            let replaced = w;

            for (let f of filter)
                replaced = replaced.replace(f[0], f[1]);

            return w.includes(search) || replaced.includes(search);
        });
        
        this.setState({ words: filtered });
    }

    searchButton() {
        const search = $('.navbar .search').val().toLocaleLowerCase('tr-TR');
        return window.location.href = `/word?q=${search}`;
    }

    toggleTheme(element) {
        const html = $('html');
        const theme = html.attr('theme');

        if (html.hasClass('change')) return;
        html.addClass('change');

        localStorage.setItem('theme', theme == 'light' ? 'dark' : 'light');
        $(element.target).attr('class', theme == 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon');

        html.attr('theme', theme == 'light' ? 'dark' : 'light');
        setTimeout(() => html.removeClass('change'), 3000);
    }

    toggleMenu() { // ONLY MOBILE
        if ($('html').hasClass('change')) return;
        $('.navbar #menu').attr('class', this.state.menu ? 'fa-solid fa-bars' : 'fa-solid fa-x');
        this.setState({ menu: !this.state.menu }, () => {
            const open = this.state.menu;
            $('.search-area').css('display', open ? 'block' : 'none');
            $('.main').css('display', open ? 'none' : 'block');

            $('.words').stop().animate({ width: 'toggle', display: 'block' }, 500);
        })
    }

    scrollTop() {
        $('.panel').css('overflow-y', 'hidden');
        $('.panel').scrollTop(0);
    }

    render() {
        return (
            <>
                <div className="navbar">
                    <i id="menu" onClick={(el) => this.toggleMenu(el)} className="fa-solid fa-bars"></i>
                    <div className='search-area'>
                        <input className='search' type="text" /><button onClick={() => this.searchButton()}><i className="fa-solid fa-magnifying-glass"></i></button>
                    </div>
                    <div className='main'>
                        <i onClick={(el) => this.toggleTheme(el)} className={localStorage.getItem('theme') == 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon'}></i>
                        <Link to="/"><img src={mtal} alt="" /></Link>
                    </div>
                </div>
                <div className='words'>
                    {(this.state.words.length > 0 && words.length != this.state.words.length) && <p className='text-center showing'>{words.length} sözcükten {this.state.words.length} tane gösteriliyor.</p>}
                    {this.state.words.length === 0 && <p className='text-center notfound'>Bu sözcük kaydedilmemiş. TDK üzerinden aramak istiyorsanız lütfen "Arama" butonuna tıklayınız.</p>}
                    <ul>
                        {this.state.words.map((w, index) => <li key={index}>
                            <Link onClick={() => { this.scrollTop(); this.state.menu && this.toggleMenu() }} to={`/word?q=${w}`}>{w}</Link>
                        </li>)}
                    </ul>
                    <p className='mt-2'>Telif Hakkı &copy; Tüm Hakları Saklıdır.</p>
                </div>
            </>
        )
    }
}