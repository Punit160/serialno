import { lazy, Suspense, useEffect } from 'react';
import Index from './jsx/index';
import { connect, useDispatch } from 'react-redux';
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { checkAutoLogin } from './services/AuthService';
import { isAuthenticated } from './store/selectors/AuthSelectors';

import './assets/vendor/swiper/css/swiper-bundle.min.css';
import "./assets/css/style.css";

const Login = lazy(() => import('./jsx/pages/Login.jsx'));
const SignUp = lazy(() => import('./jsx/pages/Registration.jsx'));

function withRouter(Component) {
    function ComponentWithRouterProp(props) {
        let location = useLocation();
        let navigate = useNavigate();
        let params = useParams();

        return (
            <Component
                {...props}
                router={{ location, navigate, params }}
            />
        );
    }
    return ComponentWithRouterProp;
}

function App(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
  checkAutoLogin(dispatch, navigate);
}, []);

    return (
        <Suspense
            fallback={
                <div id="preloader">
                    <div className="sk-three-bounce">
                        <div className="sk-child sk-bounce1"></div>
                        <div className="sk-child sk-bounce2"></div>
                        <div className="sk-child sk-bounce3"></div>
                    </div>
                </div>
            }
        >
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/page-register" element={<SignUp />} />

                {/* Main App Routes (Dashboard + all internal pages) */}
                <Route path="/*" element={<Index />} />
            </Routes>
        </Suspense>
    );
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: isAuthenticated(state),
    };
};

export default withRouter(connect(mapStateToProps)(App));
