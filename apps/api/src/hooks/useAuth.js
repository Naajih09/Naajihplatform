"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = void 0;
// apps/admin-web/src/hooks/useAuth.ts
var react_1 = require("react");
var useAuth = function () {
    var _a = (0, react_1.useState)(false), isAuthenticated = _a[0], setIsAuthenticated = _a[1];
    var _b = (0, react_1.useState)(null), userRole = _b[0], setUserRole = _b[1];
    var _c = (0, react_1.useState)(true), isLoading = _c[0], setIsLoading = _c[1];
    // Function to perform login actions
    var login = (0, react_1.useCallback)(function (token, role) {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('userRole', role);
        setIsAuthenticated(true);
        setUserRole(role);
    }, []);
    // Function to perform logout actions
    var logout = (0, react_1.useCallback)(function () {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userRole');
        setIsAuthenticated(false);
        setUserRole(null);
    }, []);
    (0, react_1.useEffect)(function () {
        var token = localStorage.getItem('accessToken');
        var role = localStorage.getItem('userRole');
        if (token && role) {
            setIsAuthenticated(true);
            setUserRole(role);
        }
        else {
            setIsAuthenticated(false);
            setUserRole(null);
        }
        setIsLoading(false); // Finished checking auth status
    }, []);
    return {
        isAuthenticated: isAuthenticated,
        userRole: userRole,
        isLoading: isLoading,
        login: login,
        logout: logout,
    };
};
exports.useAuth = useAuth;
