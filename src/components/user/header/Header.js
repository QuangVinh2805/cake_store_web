import React, {useEffect, useState} from 'react';
import ContactBar from '../contactBar/ContactBar';
import './Header.css';
import {FiSearch} from 'react-icons/fi';
import {useNavigate} from "react-router-dom";
import axios from "axios";

const Header = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [open, setOpen] = useState(false);


    const [keyword, setKeyword] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggest, setShowSuggest] = useState(false);

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (!keyword.trim()) {
            setSuggestions([]);
            setShowSuggest(false);
            return;
        }

        const fetchSearch = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:8080/api/products/search",
                    {
                        params: {
                            keyword: keyword.trim(),
                            page: 0,
                            size: 5 // 🔥 autocomplete chỉ cần 5
                        }
                    }
                );

                setSuggestions(res.data.content || []);
                setShowSuggest(true);
            } catch (err) {
                console.log("Search error", err);
            }
        };

        const debounce = setTimeout(fetchSearch, 400);
        return () => clearTimeout(debounce);
    }, [keyword]);


    /* ================= GET CATEGORY ================= */
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:8080/api/categories/getAll"
                );
                setCategories(res.data);
            } catch {
                console.log("Category error");
            }
        };
        fetchCategory();
    }, []);

    const handleSearch = () => {
        if (!keyword.trim()) return;
        setShowSuggest(false);
        navigate(`/product/search?keyword=${keyword}`);
    };

    return (
        <header>
            <ContactBar/>

            <div className="main-header">
                <div className="logo" onClick={() => navigate("/")}>
                    Sweet Dreams
                </div>

                <nav className="nav-left">
                    {/* ✅ HOME */}
                    <span className="nav-link"
                          onClick={() => navigate("/")}
                    >
                        Trang chủ
                    </span>

                    <span
                        className="nav-link"
                        onClick={() => navigate("/product")}
                    >
                        Sản phẩm
                    </span>

                </nav>

                <nav className="nav-right">
                    {/*<span className="contact">Liên hệ</span>*/}

                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Hôm nay bạn ăn gì?"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        />
                        <button onClick={handleSearch}>
                            <FiSearch/>
                        </button>

                        {showSuggest && suggestions.length > 0 && (
                            <div className="search-suggest">
                                {suggestions.map((item, index) => (
                                    <div
                                        key={index}
                                        className="suggest-item"
                                        onClick={() =>
                                            navigate(
                                                `/product/search?keyword=${item.productName}`
                                            )
                                        }
                                    >
                                        <img
                                            src={`http://localhost:8080${item.image}`}
                                            alt={item.productName}
                                        />
                                        <span>{item.productName}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
