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
import ProductSearch from "./components/user/productSearch/ProductSearch";
import ProductCategory from "./components/user/productCategory/ProductCategory";
import OrderDetail from "./components/user/orderDetail/OrderDetail";
import UserManagement from "./components/admin/userManagement/UserManagement";
import ProductManagement from "./components/admin/productManagement/ProductManagement";
import CategoryManagement from "./components/admin/categoryManagement/CategoryManagement";
import OrderManagement from "./components/admin/orderManagement/OrderManagement";
import TagManagement from "./components/admin/tagManagement/TagManagement";
import BannerManagement from "./components/admin/bannerManagement/BannerManagement";
import Statistic from "./components/admin/statistic/Statistic";
import ForgotPassword from "./components/login_register/forgetPassword/ForgotPassword";
import UserRoute from "./UserRoute";
import AdminRoute from "./AdminRoute";




function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={ <Home/>}/>
                    <Route path="/product" element={ <Product/>}/>
                    <Route path="/product/:hashId" element={<ProductDetail/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/forgot-password" element={<ForgotPassword/>}/>
                    <Route path="/cart" element={<Cart/>}/>
                    <Route path="/checkout" element={<CheckOut/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/change-password" element={<ChangePassword/>}/>
                    <Route path="/product/search" element={<ProductSearch />} />
                    <Route path="/product/category/:id" element={<ProductCategory />} />
                    <Route path="/my-orders" element={<OrderDetail />} />
                    <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
                    <Route path="/admin/products" element={<AdminRoute><ProductManagement /></AdminRoute>} />
                    <Route path="/admin/categories" element={<AdminRoute><CategoryManagement /></AdminRoute>} />
                    <Route path="/admin/orders" element={<AdminRoute><OrderManagement /></AdminRoute>} />
                    <Route path="/admin/tags" element={<AdminRoute><TagManagement /></AdminRoute>} />
                    <Route path="/admin/banners" element={<AdminRoute><BannerManagement /></AdminRoute>} />
                    <Route path="/admin/statistics" element={<AdminRoute><Statistic /></AdminRoute>} />

                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
