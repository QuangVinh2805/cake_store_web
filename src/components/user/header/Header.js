import React from 'react';
import ContactBar from '../contactBar/ContactBar';
import './Header.css';
import { FiSearch } from 'react-icons/fi';
import {useNavigate} from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    const goToHome = () => {
        navigate(`/`);
    };
    return (
        <header>
            <ContactBar />
            <div className="main-header">
                <div className="logo" onClick={() => goToHome()}>Sweet Dreams</div>
                <nav className="nav-left">
                    <a href="#">Trang chủ</a>
                    <div className="dropdown">
                        <a href="#">Sản phẩm ▾</a>
                        {/* Menu con nếu cần */}
                    </div>
                </nav>
                <nav className="nav-right">
                    <a className="contact" href="#">Liên hệ</a>
                    <div className="search-bar">
                        <input type="text" placeholder="Hôm nay bạn ăn gì?"/>
                        <button><FiSearch/></button>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
