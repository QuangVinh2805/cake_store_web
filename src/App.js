import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import React from "react";
import Home from "../src/components/user/home/Home"
import Product from "../src/components/user/product/Product"
import ProductDetail from "../src/components/user/productDetail/ProductDetail"
import Login from "../src/components/login_register/login/Login"
import Register from "../src/components/login_register/register/Register"
import Cart from "../src/components/user/cart/Cart"
import CheckOut from "../src/components/user/checkout/CheckOut"
import Profile from "./components/user/profile/Profile";
import {AuthProvider} from "./context/AuthContext";
import ChangePassword from "./components/user/changePassword/ChangePassword";


function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/product" element={<Product/>}/>
                    <Route path="/product/:hashId" element={<ProductDetail/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/cart" element={<Cart/>}/>
                    <Route path="/checkout" element={<CheckOut/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/change-password" element={<ChangePassword/>}/>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
